#!/usr/bin/env node

/**
 * Calculate Subresource Integrity (SRI) hashes for external resources
 * 
 * Usage:
 *   node scripts/calculate-sri.js
 * 
 * This script fetches external resources and calculates their SHA-384 hashes
 * for use in integrity attributes.
 */

import https from 'https';
import crypto from 'crypto';

function fetchAndHash(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      reject(new Error(`Too many redirects for ${url}`));
      return;
    }

    https.get(url, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        const location = res.headers.location;
        if (!location) {
          reject(new Error(`Redirect without location header for ${url}`));
          return;
        }
        // Handle relative redirects
        const redirectUrl = location.startsWith('http') ? location : new URL(location, url).href;
        return fetchAndHash(redirectUrl, redirectCount + 1).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const content = Buffer.concat(chunks);
        const hash = crypto.createHash('sha384').update(content).digest('base64');
        resolve({ url, hash: `sha384-${hash}` });
      });
    }).on('error', reject);
  });
}

async function main() {
  const resources = [
    {
      name: 'Google Fonts CSS',
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    },
    {
      name: 'Cloudflare Turnstile',
      url: 'https://challenges.cloudflare.com/turnstile/v0/api.js',
    },
  ];

  console.log('Calculating SRI hashes for external resources...\n');

  for (const resource of resources) {
    try {
      console.log(`Fetching ${resource.name}...`);
      const { url, hash } = await fetchAndHash(resource.url);
      console.log(`✓ ${resource.name}`);
      console.log(`  URL: ${url}`);
      console.log(`  Integrity: ${hash}\n`);
    } catch (error) {
      console.error(`✗ Failed to fetch ${resource.name}:`, error.message);
      console.log('');
    }
  }

  console.log('Note: Add these integrity hashes to the integrity attributes in client/index.html');
}

main().catch(console.error);
