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

        console.log("[DO] Received request:", request.method, path);
        console.log("[DO] Path segments:", segments);

        // Ensure API path starts with /api/notes
        if (segments.length < 2 || segments[0] !== 'api' || segments[1] !== 'notes') {
            console.log("[DO] Invalid API path: unauthorized access");
            return new Response(JSON.stringify({ error: 'Unauthorized access' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Expecting only /api/notes/:id
        if (segments.length !== 3) {
            console.log("[DO] Invalid API path: wrong segment count", segments.length);
            return new Response(JSON.stringify({ error: 'Invalid API path' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const noteId = segments[2];
        console.log(`[DO] Processing note ID: ${noteId}`);

        if (request.method === 'POST') {
            console.log(`[DO] Creating note with ID: ${noteId}`);
            return await this.createNote(request, noteId);
        } else if (request.method === 'GET') {
            console.log(`[DO] Getting note with ID: ${noteId}`);
            return await this.getNote(noteId);
        } else if (request.method === 'DELETE') {
            console.log(`[DO] Deleting note with ID: ${noteId}`);
            // Run background cleanup
            this.cleanupExpiredNotes();
            return await this.deleteNote(noteId);
        }

        console.log(`[DO] Method not allowed: ${request.method}`);
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async createNote(request: Request, noteId: string): Promise<Response> {
        try {
            console.log(`[DO] Creating note with ID: ${noteId}`);

            // Read body **before** returning any response
            const buffer = await request.arrayBuffer();
            console.log(`[DO] Received body size: ${buffer.byteLength} bytes`);

            // Validate content type AFTER reading
            const contentType = request.headers.get('Content-Type');
            console.log(`[DO] Content-Type header: ${contentType}`);

            if (contentType !== 'application/octet-stream') {
                console.log(`[DO] Invalid Content-Type: ${contentType}`);
                return new Response(JSON.stringify({ error: 'Invalid Content-Type' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            const createdAt = Date.now(); // Store timestamp in milliseconds
            const metaKey = `${noteId}-meta`;
            const metaValue = JSON.stringify({ createdAt });

            console.log(`[DO] Creating note with ID: ${noteId}`);
            console.log(`[DO] Creating metadata with key: ${metaKey}`);
            console.log(`[DO] Metadata value: ${metaValue}`);

            // Store encrypted note and metadata separately
            await this.state.storage.put(noteId, buffer);
            await this.state.storage.put(metaKey, metaValue);

            console.log(`[DO] Note and metadata stored successfully`);

            // List all keys to verify storage
            console.log(`[DO] Verifying storage - listing all keys:`);
            const allKeys = await this.state.storage.list({ prefix: "" });
            for (const key of allKeys.keys()) {
                console.log(`[DO] Storage key after creation: ${key}`);
            }

            return new Response(JSON.stringify({ id: noteId, url: `/note/${noteId}` }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (e) {
            console.error(`[DO] Error creating note: ${e.toString()}`);
            console.error(`[DO] Error stack: ${e.stack}`);
            return new Response(JSON.stringify({ error: 'Error creating note', details: e.toString() }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    async getNote(noteId: string): Promise<Response> {
        try {
            console.log(`[DO] Attempting to get note with ID: ${noteId}`);
            const metaKey = `${noteId}-meta`;
            console.log(`[DO] Looking for metadata with key: ${metaKey}`);

            // List all keys to help debug
            console.log(`[DO] Current storage keys:`);
            const allKeysBeforeGet = await this.state.storage.list({ prefix: "" });
            for (const key of allKeysBeforeGet.keys()) {
                console.log(`[DO] Storage key: ${key}`);
            }

            // Get metadata as string and parse it manually
            const metaStr = await this.state.storage.get(metaKey);
            console.log(`[DO] Raw metadata string: ${metaStr}`);

            let meta;
            if (metaStr) {
                try {
                    meta = JSON.parse(metaStr as string);
                    console.log(`[DO] Parsed metadata: ${JSON.stringify(meta)}`);
                } catch (parseError) {
                    console.error(`[DO] Error parsing metadata: ${parseError}`);
                    console.error(`[DO] Error stack: ${parseError.stack}`);
                }
            } else {
                console.log(`[DO] No metadata found for key: ${metaKey}`);
            }

            if (!meta || !meta.createdAt) {
                console.log(`[DO] Note metadata not found or invalid for ID: ${noteId}`);
                return new Response(JSON.stringify({ error: 'Note metadata not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            const createdAt = meta.createdAt;
            const now = Date.now();
            const ONE_DAY = 24 * 60 * 60 * 1000; // 1 day in milliseconds

            console.log(`[DO] Note creation timestamp: ${createdAt}, current time: ${now}`);
            console.log(`[DO] Note age: ${(now - createdAt) / 1000 / 60} minutes`);

            // If expired, delete it
            if (now - createdAt > ONE_DAY) {
                console.log(`[DO] Note expired and will be deleted`);
                await this.deleteNote(noteId);
                return new Response(JSON.stringify({ error: 'Note expired and deleted' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Retrieve the encrypted note
            console.log(`[DO] Retrieving note content for ID: ${noteId}`);
            const buffer = await this.state.storage.get(noteId, { type: "arrayBuffer" });

            if (!buffer) {
                console.log(`[DO] Note content not found for ID: ${noteId}`);
                return new Response(JSON.stringify({ error: 'Note content not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            console.log(`[DO] Note content retrieved, size: ${buffer.byteLength} bytes`);

            // Convert ArrayBuffer to Base64 string without using Node.js Buffer
            const bytes = new Uint8Array(buffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            const base64Data = btoa(binary);

            console.log(`[DO] Note content encoded to base64, length: ${base64Data.length}`);

            const response = new Response(JSON.stringify({ data: base64Data }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

            console.log(`[DO] Sending successful response for note: ${noteId}`);
            return response;

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
            const lastCleanup = await this.state.storage.get("last-cleanup", { type: "json" });
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
            await this.state.storage.put("last-cleanup", now);
            console.log(`[DO] Updated last-cleanup timestamp to: ${now}`);

            // List stored notes (limit to 100 per cleanup)
            const keys = await this.state.storage.list({ prefix: "", limit: 100 });
            const keyCount = Array.from(keys.keys()).length;
            console.log(`[DO] Found ${keyCount} keys to check for expiration`);

            const ONE_DAY = 24 * 60 * 60 * 1000; // 1 day in milliseconds
            let expiredCount = 0;

            for (const key of keys.keys()) {
                console.log(`[DO] Checking key: ${key}`);

                if (key.endsWith("-meta")) {
                    const meta = await this.state.storage.get(key, { type: "json" });
                    console.log(`[DO] Metadata for ${key}: ${JSON.stringify(meta)}`);

                    if (meta && meta.createdAt && now - meta.createdAt > ONE_DAY) {
                        const noteId = key.replace("-meta", "");
                        console.log(`[DO] Note expired and will be deleted: ${noteId}, age: ${(now - meta.createdAt) / 1000 / 60 / 60} hours`);
                        await this.deleteNote(noteId);
                        expiredCount++;
                    } else if (meta && meta.createdAt) {
                        console.log(`[DO] Note not expired: ${key.replace("-meta", "")}, age: ${(now - meta.createdAt) / 1000 / 60 / 60} hours`);
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