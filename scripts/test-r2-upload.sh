#!/bin/bash

# Quick test script to manually upload a single file and verify
# Usage: ./scripts/test-r2-upload.sh

BUCKET_NAME="webllm-models"
TEST_FILE="./models/gemma-3-1b-it-mlc/mlc-chat-config.json"
TEST_PATH="gemma-3-1b-it-mlc/mlc-chat-config.json"

if [ ! -f "$TEST_FILE" ]; then
    echo "❌ Test file not found: $TEST_FILE"
    exit 1
fi

echo "📤 Uploading test file..."
if wrangler r2 object put "$BUCKET_NAME/$TEST_PATH" --file="$TEST_FILE" --content-type="application/json"; then
    echo "✅ Upload successful!"
    echo ""
    echo "🔍 Testing retrieval..."
    if wrangler r2 object get "$BUCKET_NAME/$TEST_PATH" --file=/tmp/r2-test-retrieve.json 2>/dev/null; then
        echo "✅ File retrieved successfully!"
        echo "📄 File size: $(stat -f%z /tmp/r2-test-retrieve.json 2>/dev/null || stat -c%s /tmp/r2-test-retrieve.json 2>/dev/null) bytes"
        rm -f /tmp/r2-test-retrieve.json
    else
        echo "❌ Failed to retrieve file"
    fi
else
    echo "❌ Upload failed"
    exit 1
fi
