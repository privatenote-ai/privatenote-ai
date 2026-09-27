import { SecureNoteStorage } from './durable_objects/secure_note_storage';
import { ExportedHandler } from '@cloudflare/workers-types';
export { SecureNoteStorage };

interface Env {
    ASSETS: Fetcher;
    SECURE_NOTES: DurableObjectNamespace;
}

// Add CORS headers
function addCorsHeaders(response: Response): Response {
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins
    headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token');
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        console.log(`Request received: ${request.method} ${path}`);

        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            console.log('Handling CORS preflight request');
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                    'Access-Control-Max-Age': '86400'
                }
            });
        }

        // Handle API requests
        if (path.startsWith('/api/notes')) {
            console.log(`[WORKER] API request: ${request.method} ${path}`);
            console.log(`[WORKER] Request headers:`, JSON.stringify(Object.fromEntries(request.headers.entries())));
            console.log(`[WORKER] Request URL: ${request.url}`);

            // Split path into parts
            const parts = path.split('/').filter(Boolean);
            console.log(`[WORKER] Path parts:`, parts);
            console.log(`[WORKER] Parts length: ${parts.length}, Method: ${request.method}`);

            if (request.method === 'POST' && parts.length === 2) {
                const id = crypto.randomUUID();
                console.log(`[WORKER] Creating new note with ID: ${id}`);

                // Log request body info (without reading it fully to avoid consuming the stream)
                const contentType = request.headers.get('Content-Type');
                const contentLength = request.headers.get('Content-Length');
                console.log(`[WORKER] Request Content-Type: ${contentType}`);
                console.log(`[WORKER] Request Content-Length: ${contentLength}`);

                // Forward to Durable Object
                const doId = env.SECURE_NOTES.idFromName(id);
                console.log(`[WORKER] Durable Object ID: ${doId.toString()}`);
                const storage = env.SECURE_NOTES.get(doId);
                console.log(`[WORKER] Got Durable Object stub`);

                // Create a new URL for the Durable Object
                const doUrl = new URL(request.url);
                doUrl.pathname = `/api/notes/${id}`;
                console.log(`[WORKER] Durable Object URL: ${doUrl.toString()}`);

                // Create a new request with the modified URL but same body and headers
                const doRequest = new Request(doUrl.toString(), {
                    method: request.method,
                    headers: request.headers,
                    body: request.body,
                    redirect: request.redirect,
                });

                console.log(`[WORKER] Forwarding POST request to Durable Object for ID: ${id}`);
                console.log(`[WORKER] DO Request method: ${doRequest.method}`);
                console.log(`[WORKER] DO Request URL: ${doRequest.url}`);
                console.log(`[WORKER] DO Request headers:`, JSON.stringify(Object.fromEntries(doRequest.headers.entries())));
                
                try {
                    const response = await storage.fetch(doRequest);
                    console.log(`[WORKER] Received response from DO: ${response.status} ${response.statusText}`);
                    console.log(`[WORKER] Response headers:`, JSON.stringify(Object.fromEntries(response.headers.entries())));
                    
                    // Log response body for debugging (read it first, then recreate)
                    const responseText = await response.text();
                    console.log(`[WORKER] Response body: ${responseText.substring(0, 500)}`);
                    
                    const newResponse = new Response(responseText, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                    
                    return addCorsHeaders(newResponse);
                } catch (error) {
                    console.error(`[WORKER] Error calling Durable Object:`, error);
                    console.error(`[WORKER] Error stack:`, error.stack);
                    return addCorsHeaders(new Response(JSON.stringify({ 
                        error: 'Error calling Durable Object', 
                        details: error.toString() 
                    }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
            } else if (parts.length === 3) {
                const noteId = parts[2];
                console.log(`[WORKER] Handling request for note ID: ${noteId}`);

                const id = env.SECURE_NOTES.idFromName(noteId);
                const storage = env.SECURE_NOTES.get(id);

                console.log(`[WORKER] Forwarding request to Durable Object`);
                try {
                    const response = await storage.fetch(request.clone());
                    console.log(`[WORKER] Received response from DO: ${response.status}`);
                    return addCorsHeaders(response);
                } catch (error) {
                    console.error(`[WORKER] Error calling Durable Object:`, error);
                    return addCorsHeaders(new Response(JSON.stringify({ 
                        error: 'Error calling Durable Object', 
                        details: error.toString() 
                    }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
            } else {
                console.log(`[WORKER] No matching route handler. Parts: ${parts.length}, Method: ${request.method}`);
                return addCorsHeaders(new Response(JSON.stringify({ error: 'Invalid API path' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }
        }

        // For /note/:id routes
        if (path.startsWith('/note/')) {
            const noteId = path.split('/')[2];
            console.log(`Serving React app for note ID: ${noteId}`);

            // Serve the React app (index.html)
            return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, {
                method: 'GET',
                headers: request.headers
            }));
        }

        // For all other requests
        console.log(`Serving static asset or fallback: ${path}`);
        try {
            const assetResponse = await env.ASSETS.fetch(request.clone());
            console.log(`Asset response status: ${assetResponse.status}`);

            if (assetResponse.status < 400) {
                return assetResponse;
            }

            console.log(`Asset not found, serving index.html as fallback`);
            return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, {
                method: 'GET',
                headers: request.headers
            }));
        } catch (err) {
            console.error(`Error serving asset: ${err}`);
            return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, {
                method: 'GET',
                headers: request.headers
            }));
        }
    }
} satisfies ExportedHandler;