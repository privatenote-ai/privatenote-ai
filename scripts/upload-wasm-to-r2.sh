#!/bin/bash

# Script to upload WASM files to Cloudflare R2
# Usage: ./scripts/upload-wasm-to-r2.sh

set -e

BUCKET_NAME="webllm-models"
MODELS_DIR="./models"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Uploading WASM files to Cloudflare R2${NC}"
echo ""

# Get account ID
ACCOUNT_ID="4cf4e785755949c2f0a61d2f3b532b69"
R2_ENDPOINT="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"

echo -e "${BLUE}Using endpoint: ${R2_ENDPOINT}${NC}"
echo ""

# Function to upload a WASM file
upload_wasm_file() {
    local local_path=$1
    local remote_path=$2
    
    if [ ! -f "$local_path" ]; then
        echo -e "  ⚠️  File not found: $local_path" >&2
        return 1
    fi
    
    local file_size=$(stat -f%z "$local_path" 2>/dev/null || stat -c%s "$local_path" 2>/dev/null || echo "0")
    local size_mb=$((file_size / 1024 / 1024))
    
    echo -e "  📤 Uploading WASM (${size_mb}MB): ${remote_path}"
    
    if wrangler r2 object put "$BUCKET_NAME/$remote_path" \
        --file="$local_path" \
        --content-type="application/wasm" 2>&1; then
        echo -e "  ✅ ${remote_path}"
        return 0
    else
        echo -e "  ❌ Failed: ${remote_path}" >&2
        return 1
    fi
}

# Upload Gemma 270M WASM
echo -e "${BLUE}📤 Uploading Gemma 3 270M WASM...${NC}"
# Try direct path first (not nested)
WASM_270M_LOCAL="models/gemma-3-270m-it-mlc/libs/gemma-3-270m-it-q4f16_1-webgpu.wasm"
WASM_270M_REMOTE="gemma-3-270m-it-mlc/libs/gemma-3-270m-it-q4f16_1-webgpu.wasm"

# If direct path doesn't exist, try nested path
if [ ! -f "$WASM_270M_LOCAL" ]; then
    WASM_270M_LOCAL="models/gemma-3-270m-it-mlc/libs/gemma-3-270m-it-q4f16_1-webgpu.wasm/gemma-3-270m-it-q4f16_1-webgpu.wasm"
    WASM_270M_REMOTE="gemma-3-270m-it-mlc/libs/gemma-3-270m-it-q4f16_1-webgpu.wasm/gemma-3-270m-it-q4f16_1-webgpu.wasm"
fi

if [ -f "$WASM_270M_LOCAL" ]; then
    upload_wasm_file "$WASM_270M_LOCAL" "$WASM_270M_REMOTE"
else
    echo -e "${YELLOW}⚠️  WASM file not found: $WASM_270M_LOCAL${NC}"
    echo -e "${YELLOW}   You may need to download it from HuggingFace first${NC}"
fi

# Check for Gemma 1B WASM
echo ""
echo -e "${BLUE}📤 Checking for Gemma 3 1B WASM...${NC}"
# Try direct path first
WASM_1B_LOCAL="models/gemma-3-1b-it-mlc/libs/gemma-3-1b-it-q4f32_1-webgpu.wasm"
WASM_1B_REMOTE="gemma-3-1b-it-mlc/libs/gemma-3-1b-it-q4f32_1-webgpu.wasm"

# If direct path doesn't exist, try nested or find any WASM file
if [ ! -f "$WASM_1B_LOCAL" ]; then
    WASM_1B_LOCAL=$(find models/gemma-3-1b-it-mlc -name "*.wasm" -type f 2>/dev/null | head -1)
    if [ -n "$WASM_1B_LOCAL" ]; then
        # Extract relative path
        WASM_1B_REMOTE="${WASM_1B_LOCAL#models/}"
    fi
fi

if [ -n "$WASM_1B_LOCAL" ] && [ -f "$WASM_1B_LOCAL" ]; then
    upload_wasm_file "$WASM_1B_LOCAL" "$WASM_1B_REMOTE"
else
    echo -e "${YELLOW}⚠️  Gemma 1B WASM file not found${NC}"
    echo -e "${YELLOW}   You may need to download it from HuggingFace first${NC}"
    echo -e "${YELLOW}   Run: ./scripts/download-wasm.sh${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Upload complete!${NC}"
