#!/bin/bash

# Script to verify WebLLM models are uploaded to Cloudflare R2
# Usage: ./scripts/verify-r2-upload.sh

set -e

BUCKET_NAME="webllm-models"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Verifying WebLLM models in R2${NC}"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found${NC}"
    exit 1
fi

# Function to test if a file exists
test_file() {
    local object_path=$1
    local description=$2
    
    echo -e "${BLUE}Testing: ${description}${NC}"
    if wrangler r2 object get "$BUCKET_NAME/$object_path" --file=/tmp/r2-test.tmp &>/dev/null; then
        file_size=$(stat -f%z /tmp/r2-test.tmp 2>/dev/null || stat -c%s /tmp/r2-test.tmp 2>/dev/null || echo "unknown")
        rm -f /tmp/r2-test.tmp
        echo -e "  ${GREEN}✅ Found (${file_size} bytes)${NC}"
        return 0
    else
        echo -e "  ${RED}❌ Not found${NC}"
        return 1
    fi
}

# Test key files from Gemma 3 1B
echo -e "${BLUE}📦 Gemma 3 1B Model:${NC}"
test_file "gemma-3-1b-it-mlc/mlc-chat-config.json" "Config file"
test_file "gemma-3-1b-it-mlc/tokenizer.json" "Tokenizer"
test_file "gemma-3-1b-it-mlc/params_shard_0.bin" "Model shard 0"
test_file "gemma-3-1b-it-mlc/params_shard_1.bin" "Model shard 1"

# Test key files from Gemma 3 270M
echo ""
echo -e "${BLUE}📦 Gemma 3 270M Model:${NC}"
test_file "gemma-3-270m-it-mlc/mlc-chat-config.json" "Config file"
test_file "gemma-3-270m-it-mlc/tokenizer.json" "Tokenizer"
test_file "gemma-3-270m-it-mlc/params_shard_0.bin" "Model shard 0"

echo ""
echo -e "${BLUE}💡 Tip:${NC} To see all files, use the Cloudflare Dashboard:"
echo "   https://dash.cloudflare.com/ → R2 → $BUCKET_NAME"
echo ""
echo -e "${GREEN}✅ Verification complete!${NC}"
