import bs58 from "bs58";

export interface Env {
    ASSETS?: Fetcher;
    SECURE_NOTES: DurableObjectNamespace;
}

export class SecureNoteStorage {
    state: DurableObjectState;
    env: Env;

    constructor(state: DurableObjectState, env: Env) {
        this.state = state;
        this.env = env;
        console.log("[DO] SecureNoteStorage instance created");
    }

    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;
        const segments = path.split('/').filter(Boolean);

        console.log("[DO] ========== DURABLE OBJECT FETCH ==========");
        console.log("[DO] Received request:", request.method, path);
        console.log("[DO] Full URL:", request.url);
        console.log("[DO] Path segments:", segments);
        console.log("[DO] Segments length:", segments.length);
        console.log("[DO] Request headers:", JSON.stringify(Object.fromEntries(request.headers.entries())));

        // Ensure API path starts with /api/notes
        if (segments.length < 2 || segments[0] !== 'api' || segments[1] !== 'notes') {
            console.log("[DO] ❌ Invalid API path: unauthorized access");
            console.log("[DO] Segment 0:", segments[0], "Segment 1:", segments[1]);
            return new Response(JSON.stringify({ error: 'Unauthorized access' }), {
                status: 403,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Expecting only /api/notes/:id
        if (segments.length !== 3) {
            console.log("[DO] ❌ Invalid API path: wrong segment count", segments.length);
            console.log("[DO] Expected 3 segments, got:", segments.length);
            console.log("[DO] Segments:", JSON.stringify(segments));
            return new Response(JSON.stringify({ error: 'Invalid API path' }), {
                status: 400,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const noteId = segments[2];
        console.log(`[DO] ✅ Processing note ID: ${noteId}`);
        console.log(`[DO] Request method: ${request.method}`);

        if (request.method === 'POST') {
            console.log(`[DO] → Routing to createNote for ID: ${noteId}`);
            return await this.createNote(request, noteId);
        } else if (request.method === 'GET') {
            console.log(`[DO] → Routing to getNote for ID: ${noteId}`);
            return await this.getNote(noteId);
        } else if (request.method === 'DELETE') {
            console.log(`[DO] → Routing to deleteNote for ID: ${noteId}`);
            // Run background cleanup
            this.cleanupExpiredNotes();
            return await this.deleteNote(noteId);
        }

        console.log(`[DO] ❌ Method not allowed: ${request.method}`);
        console.log(`[DO] Allowed methods: POST, GET, DELETE`);
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    async createNote(request: Request, noteId: string): Promise<Response> {
        try {
            console.log(`[DO] ========== CREATE NOTE ==========`);
            console.log(`[DO] Creating note with ID: ${noteId}`);
            console.log(`[DO] Request URL: ${request.url}`);
            console.log(`[DO] Request method: ${request.method}`);

            // Read body and check content type
            const contentType = request.headers.get('Content-Type') || '';
            console.log(`[DO] Content-Type header: "${contentType}"`);
            console.log(`[DO] All request headers:`, JSON.stringify(Object.fromEntries(request.headers.entries())));

            let noteData: any;
            
            if (contentType.includes('application/json')) {
                console.log(`[DO] ✅ Detected JSON content type`);
                // Handle JSON format (from client)
                console.log(`[DO] Attempting to parse JSON body...`);
                let body;
                try {
                    body = await request.json();
                    console.log(`[DO] ✅ Successfully parsed JSON body`);
                    console.log(`[DO] Body keys:`, Object.keys(body));
                    console.log(`[DO] Body preview (first 500 chars):`, JSON.stringify(body).substring(0, 500));
                } catch (jsonError) {
                    console.error(`[DO] ❌ Error parsing JSON:`, jsonError);
                    console.error(`[DO] Error details:`, jsonError.toString());
                    return new Response(JSON.stringify({ 
                        error: 'Invalid JSON body', 
                        details: jsonError.toString() 
                    }), {
                        status: 400,
                        headers: { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
                
                const { 
                    content, 
                    iv, 
                    expiryDays = 1, 
                    maxReads = 1,
                    isPasswordProtected = false,
                    salt = null,
                    encryptedKey = null,
                    encryptedKeyIv = null
                } = body;
                
                console.log(`[DO] Extracted fields:`, {
                    hasContent: !!content,
                    hasIv: !!iv,
                    expiryDays,
                    maxReads,
                    isPasswordProtected
                });
                
                if (!content || !iv) {
                    console.log(`[DO] ❌ Validation failed: Missing content or IV`);
                    console.log(`[DO] Content present: ${!!content}, IV present: ${!!iv}`);
                    return new Response(JSON.stringify({ error: 'Content and IV are required' }), {
                        status: 400,
                        headers: { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
                
                // Check if password protection fields are provided when needed
                if (isPasswordProtected && (!salt || !encryptedKeyIv)) {
                    console.log(`[DO] ❌ Password protection validation failed`);
                    console.log(`[DO] Salt present: ${!!salt}, encryptedKeyIv present: ${!!encryptedKeyIv}`);
                    return new Response(JSON.stringify({ 
                        error: 'Salt and encryptedKeyIv are required for password-protected notes' 
                    }), {
                        status: 400,
                        headers: { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
                
                // Calculate expiration date based on expiryDays
                const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
                
                noteData = {
                    content,
                    iv,
                    expiresAt: expiresAt.toISOString(),
                    maxReads: maxReads || 0,
                    currentReads: 0,
                    isPasswordProtected,
                    createdAt: new Date().toISOString(),
                    ...(isPasswordProtected && {
                        salt,
                        encryptedKeyIv
                    })
                };
            } else if (contentType.includes('application/octet-stream')) {
                console.log(`[DO] ✅ Detected binary content type (legacy)`);
                // Handle binary format (legacy support)
                const buffer = await request.arrayBuffer();
                console.log(`[DO] Received body size: ${buffer.byteLength} bytes`);
                
                const createdAt = Date.now();
                noteData = {
                    data: Array.from(new Uint8Array(buffer)),
                    createdAt: new Date(createdAt).toISOString()
                };
            } else {
                console.log(`[DO] ❌ Invalid Content-Type: "${contentType}"`);
                console.log(`[DO] Expected: application/json or application/octet-stream`);
                return new Response(JSON.stringify({ 
                    error: 'Invalid Content-Type. Expected application/json or application/octet-stream',
                    received: contentType
                }), {
                    status: 400,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }

            const metaKey = `${noteId}-meta`;
            console.log(`[DO] Creating metadata with key: ${metaKey}`);
            console.log(`[DO] Note data structure:`, {
                hasContent: !!noteData.content,
                hasIv: !!noteData.iv,
                expiresAt: noteData.expiresAt,
                maxReads: noteData.maxReads,
                isPasswordProtected: noteData.isPasswordProtected
            });

            // Store note data as JSON
            console.log(`[DO] Storing note data to storage...`);
            try {
                await this.state.storage.put(noteId, JSON.stringify(noteData));
                console.log(`[DO] ✅ Note data stored`);
                await this.state.storage.put(metaKey, JSON.stringify({ createdAt: noteData.createdAt }));
                console.log(`[DO] ✅ Metadata stored`);
            } catch (storageError) {
                console.error(`[DO] ❌ Storage error:`, storageError);
                throw storageError;
            }

            console.log(`[DO] ✅ Note and metadata stored successfully`);
            console.log(`[DO] Returning success response with ID: ${noteId}`);

            const response = new Response(JSON.stringify({ id: noteId }), {
                status: 201,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
            console.log(`[DO] Response status: ${response.status}`);
            return response;
        } catch (e) {
            console.error(`[DO] ❌❌❌ ERROR CREATING NOTE ❌❌❌`);
            console.error(`[DO] Error type: ${e.constructor.name}`);
            console.error(`[DO] Error message: ${e.toString()}`);
            console.error(`[DO] Error stack: ${e.stack}`);
            if (e instanceof Error) {
                console.error(`[DO] Error name: ${e.name}`);
                console.error(`[DO] Error message: ${e.message}`);
            }
            return new Response(JSON.stringify({ 
                error: 'Error creating note', 
                details: e.toString(),
                type: e.constructor.name
            }), {
                status: 500,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    }

    async getNote(noteId: string): Promise<Response> {
        try {
            console.log(`[DO] Attempting to get note with ID: ${noteId}`);
            const metaKey = `${noteId}-meta`;

            // Get note data
            const noteDataStr = await this.state.storage.get(noteId);
            
            if (!noteDataStr) {
                console.log(`[DO] Note not found for ID: ${noteId}`);
                return new Response(JSON.stringify({ error: 'Note not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            let noteData: any;
            try {
                noteData = JSON.parse(noteDataStr as string);
            } catch (parseError) {
                // Legacy format: try to read as binary
                console.log(`[DO] Attempting to read as legacy binary format`);
                const buffer = await this.state.storage.get(noteId, { type: "arrayBuffer" });
                if (!buffer) {
                    return new Response(JSON.stringify({ error: 'Note not found' }), {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                
                // Convert to base64 for legacy format
                const bytes = new Uint8Array(buffer);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                const base64Data = btoa(binary);
                
                return new Response(JSON.stringify({ data: base64Data }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Check expiration
            if (noteData.expiresAt) {
                const expiresAt = new Date(noteData.expiresAt);
                const now = new Date();
                
                if (now > expiresAt) {
                    console.log(`[DO] Note expired and will be deleted`);
                    await this.deleteNote(noteId);
                    return new Response(JSON.stringify({ error: 'Note has expired' }), {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            } else if (noteData.createdAt) {
                // Legacy: check 1 day expiration
                const createdAt = new Date(noteData.createdAt).getTime();
                const now = Date.now();
                const ONE_DAY = 24 * 60 * 60 * 1000;
                
                if (now - createdAt > ONE_DAY) {
                    console.log(`[DO] Note expired and will be deleted`);
                    await this.deleteNote(noteId);
                    return new Response(JSON.stringify({ error: 'Note expired and deleted' }), {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }

            // Check read count limit
            if (noteData.maxReads && noteData.maxReads > 0) {
                const currentReads = (noteData.currentReads || 0) + 1;
                
                if (currentReads > noteData.maxReads) {
                    return new Response(JSON.stringify({ error: 'Note has reached maximum read count' }), {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                
                // Update read count
                noteData.currentReads = currentReads;
                await this.state.storage.put(noteId, JSON.stringify(noteData));
                
                // If reached max reads, delete after response
                if (currentReads >= noteData.maxReads) {
                    this.deleteNote(noteId).catch(err => 
                        console.error(`Error deleting note after reaching read limit: ${err}`)
                    );
                }
            }

            // Return note data in expected format
            const response = {
                content: noteData.content,
                iv: noteData.iv,
                readCount: noteData.currentReads || 0,
                maxReads: noteData.maxReads || 0,
                expiresAt: noteData.expiresAt,
                isPasswordProtected: noteData.isPasswordProtected || false,
                ...(noteData.isPasswordProtected && {
                    salt: noteData.salt,
                    encryptedKey: noteData.encryptedKey,
                    encryptedKeyIv: noteData.encryptedKeyIv
                })
            };

            console.log(`[DO] Sending successful response for note: ${noteId}`);
            return new Response(JSON.stringify(response), {
                status: 200,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });

        } catch (e) {
            console.error(`[DO] Error retrieving note: ${e.toString()}`);
            console.error(`[DO] Error stack: ${e.stack}`);
            return new Response(JSON.stringify({ error: 'Error retrieving note', details: e.toString() }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    // 🔹 Delete note and metadata
    async deleteNote(noteId: string): Promise<Response> {
        try {
            console.log(`[DO] Deleting note with ID: ${noteId}`);

            // Verify note exists before deletion
            const noteExists = await this.state.storage.get(noteId);
            const metaExists = await this.state.storage.get(`${noteId}-meta`);

            console.log(`[DO] Note exists: ${!!noteExists}, Metadata exists: ${!!metaExists}`);

            await this.state.storage.delete(noteId);
            await this.state.storage.delete(`${noteId}-meta`); // Delete metadata too

            console.log(`[DO] Note and metadata deleted successfully`);

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (e) {
            console.error(`[DO] Error deleting note: ${e.toString()}`);
            console.error(`[DO] Error stack: ${e.stack}`);
            return new Response(JSON.stringify({ error: 'Error deleting note', details: e.toString() }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    // 🔹 Periodic cleanup of expired notes
    async cleanupExpiredNotes(): Promise<void> {
        try {
            console.log("[DO] Starting cleanup process for expired notes");

            // Fetch the last cleanup timestamp
            const lastCleanupStr = await this.state.storage.get("last-cleanup");
            const lastCleanup = lastCleanupStr ? parseInt(lastCleanupStr as string, 10) : null;
            console.log(`[DO] Last cleanup timestamp: ${lastCleanup || 'never'}`);

            const now = Date.now();
            const CLEANUP_INTERVAL = 12 * 60 * 60 * 1000; // Every 12 hours

            // If cleanup ran recently, skip it
            if (lastCleanup && now - lastCleanup < CLEANUP_INTERVAL) {
                console.log(`[DO] Skipping cleanup: last run was too recent (${(now - lastCleanup) / 1000 / 60 / 60} hours ago)`);
                return;
            }

            console.log("[DO] Running cleanup for expired notes...");

            // Store new cleanup timestamp
            await this.state.storage.put("last-cleanup", now.toString());
            console.log(`[DO] Updated last-cleanup timestamp to: ${now}`);

            // List stored notes (limit to 100 per cleanup)
            const keys = await this.state.storage.list({ prefix: "", limit: 100 });
            const keyCount = Array.from(keys.keys()).length;
            console.log(`[DO] Found ${keyCount} keys to check for expiration`);

            const ONE_DAY = 24 * 60 * 60 * 1000; // 1 day in milliseconds
            let expiredCount = 0;

            for (const key of keys.keys()) {
                console.log(`[DO] Checking key: ${key}`);

                // Skip metadata keys and cleanup timestamp
                if (key.endsWith("-meta") || key === "last-cleanup") {
                    continue;
                }

                try {
                    const noteDataStr = await this.state.storage.get(key);
                    if (!noteDataStr) continue;

                    const noteData = JSON.parse(noteDataStr as string);
                    
                    // Check expiration using expiresAt if available, otherwise use createdAt
                    let isExpired = false;
                    if (noteData.expiresAt) {
                        const expiresAt = new Date(noteData.expiresAt);
                        isExpired = new Date() > expiresAt;
                    } else if (noteData.createdAt) {
                        const createdAt = new Date(noteData.createdAt).getTime();
                        isExpired = now - createdAt > ONE_DAY;
                    }

                    if (isExpired) {
                        console.log(`[DO] Note expired and will be deleted: ${key}`);
                        await this.deleteNote(key);
                        expiredCount++;
                    }
                } catch (parseError) {
                    // Legacy format: check metadata
                    const metaKey = `${key}-meta`;
                    const metaStr = await this.state.storage.get(metaKey);
                    if (metaStr) {
                        try {
                            const meta = JSON.parse(metaStr as string);
                            if (meta && meta.createdAt) {
                                const createdAt = typeof meta.createdAt === 'string' 
                                    ? new Date(meta.createdAt).getTime() 
                                    : meta.createdAt;
                                if (now - createdAt > ONE_DAY) {
                                    console.log(`[DO] Legacy note expired and will be deleted: ${key}`);
                                    await this.deleteNote(key);
                                    expiredCount++;
                                }
                            }
                        } catch (e) {
                            console.error(`[DO] Error parsing metadata for ${key}: ${e}`);
                        }
                    }
                }
            }

            console.log(`[DO] Cleanup complete. Deleted ${expiredCount} expired notes.`);
        } catch (e) {
            console.error(`[DO] Error cleaning up expired notes: ${e}`);
            console.error(`[DO] Error stack: ${e.stack}`);
        }
    }
} 
