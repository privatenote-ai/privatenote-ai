#!/bin/bash

# Script to download WASM files directly from HuggingFace
# Usage: ./scripts/download-wasm.sh

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📥 Downloading WASM files from HuggingFace${NC}"
echo ""

# Create directories
mkdir -p models/gemma-3-270m-it-mlc/libs
mkdir -p models/gemma-3-1b-it-mlc/libs

# Download Gemma 270M WASM
echo -e "${BLUE}📥 Downloading Gemma 3 270M WASM...${NC}"
# Try the direct path first (not nested)
WASM_270M_URL="https://huggingface.co/llinguini/gemma-3-270m-it-q4f16_1-MLC/resolve/main/libs/gemma-3-270m-it-q4f16_1-webgpu.wasm"
WASM_270M_PATH="models/gemma-3-270m-it-mlc/libs/gemma-3-270m-it-q4f16_1-webgpu.wasm"

if curl -L -f -o "$WASM_270M_PATH" "$WASM_270M_URL" 2>/dev/null; then
    file_size=$(stat -f%z "$WASM_270M_PATH" 2>/dev/null || stat -c%s "$WASM_270M_PATH" 2>/dev/null || echo "0")
    size_mb=$((file_size / 1024 / 1024))
    echo -e "${GREEN}✅ Downloaded Gemma 270M WASM (${size_mb}MB)${NC}"
else
    echo -e "${RED}❌ Failed to download Gemma 270M WASM${NC}"
    echo -e "${YELLOW}   URL: $WASM_270M_URL${NC}"
    exit 1
fi

# Download Gemma 1B WASM (if needed)
echo ""
echo -e "${BLUE}📥 Downloading Gemma 3 1B WASM...${NC}"
WASM_1B_URL="https://huggingface.co/mlc-ai/gemma-3-1b-it-q4f32_1-MLC/resolve/main/libs/gemma-3-1b-it-q4f32_1-webgpu.wasm/gemma-3-1b-it-q4f32_1-webgpu.wasm"
WASM_1B_PATH="models/gemma-3-1b-it-mlc/libs/gemma-3-1b-it-q4f32_1-webgpu.wasm/gemma-3-1b-it-q4f32_1-webgpu.wasm"

mkdir -p "$(dirname "$WASM_1B_PATH")"

if curl -L -f -o "$WASM_1B_PATH" "$WASM_1B_URL" 2>/dev/null; then
    file_size=$(stat -f%z "$WASM_1B_PATH" 2>/dev/null || stat -c%s "$WASM_1B_PATH" 2>/dev/null || echo "0")
    size_mb=$((file_size / 1024 / 1024))
    echo -e "${GREEN}✅ Downloaded Gemma 1B WASM (${size_mb}MB)${NC}"
else
    echo -e "${YELLOW}⚠️  Failed to download Gemma 1B WASM (may not be available)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Download complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Upload WASM files to R2: ./scripts/upload-wasm-to-r2.sh"
echo "  2. Or upload manually via Cloudflare Dashboard"
