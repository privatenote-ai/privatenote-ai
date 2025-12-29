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
            console.log(`API request: ${request.method} ${path}`);

            // Split path into parts
            const parts = path.split('/').filter(Boolean);

            if (request.method === 'POST' && parts.length === 2) {
                const id = crypto.randomUUID();
                console.log(`Creating new note with ID: ${id}`);

                // Forward to Durable Object
                const doId = env.SECURE_NOTES.idFromName(id);
                const storage = env.SECURE_NOTES.get(doId);

                // Create a new URL for the Durable Object
                const doUrl = new URL(request.url);
                doUrl.pathname = `/api/notes/${id}`;

                // Create a new request with the modified URL but same body and headers
                const doRequest = new Request(doUrl.toString(), {
                    method: request.method,
                    headers: request.headers,
                    body: request.body,
                    redirect: request.redirect,
                });

                console.log(`Forwarding POST request to Durable Object for ID: ${id}`);
                const response = await storage.fetch(doRequest);
                console.log(`Received response from DO: ${response.status}`);

                return addCorsHeaders(response);
            } else if (parts.length === 3) {
                const noteId = parts[2];
                console.log(`Handling request for note ID: ${noteId}`);

                const id = env.SECURE_NOTES.idFromName(noteId);
                const storage = env.SECURE_NOTES.get(id);

                console.log(`Forwarding request to Durable Object`);
                const response = await storage.fetch(request.clone());
                console.log(`Received response from DO: ${response.status}`);

                return addCorsHeaders(response);
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