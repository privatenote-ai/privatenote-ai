#!/bin/bash

# Script to download WebLLM models without symlinks
# Usage: ./scripts/download-models.sh
# 
# Note: This script tries to use huggingface-cli, but if that fails,
#       it will use the Python script instead.

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📥 Downloading WebLLM models (without symlinks)${NC}"
echo ""

# Check if huggingface-cli is installed
HUGGINGFACE_CLI=""

# Try different methods to find huggingface-cli
if command -v huggingface-cli &> /dev/null; then
    HUGGINGFACE_CLI="huggingface-cli"
elif [ -f ~/.local/bin/huggingface-cli ]; then
    HUGGINGFACE_CLI="$HOME/.local/bin/huggingface-cli"
elif python3 -c "import huggingface_hub" &>/dev/null; then
    # Use Python module directly
    HUGGINGFACE_CLI="python3 -m huggingface_hub.cli"
elif python -c "import huggingface_hub" &>/dev/null; then
    HUGGINGFACE_CLI="python -m huggingface_hub.cli"
else
    echo -e "${RED}❌ huggingface-hub not found${NC}"
    echo -e "${YELLOW}Install with: pip install huggingface-hub${NC}"
    echo -e "${YELLOW}Or try: python3 -m pip install --user huggingface-hub${NC}"
    echo ""
    echo -e "${BLUE}After installing, you may need to add to PATH:${NC}"
    echo -e "${GREEN}export PATH=\"\$HOME/.local/bin:\$PATH\"${NC}"
    exit 1
fi

# Test the command
if ! $HUGGINGFACE_CLI --help &>/dev/null; then
    echo -e "${YELLOW}⚠️  Testing alternative method...${NC}"
    # Try as Python module
    if python3 -c "from huggingface_hub import snapshot_download" &>/dev/null; then
        echo -e "${BLUE}Using Python API directly...${NC}"
        HUGGINGFACE_CLI="python3"
        USE_PYTHON_API=true
    else
        echo -e "${RED}❌ Cannot use huggingface-cli${NC}"
        exit 1
    fi
else
    USE_PYTHON_API=false
fi

echo -e "${GREEN}✅ Using: ${HUGGINGFACE_CLI}${NC}"

# If we can't use CLI, fall back to Python script
if [ "$USE_PYTHON_API" = "true" ]; then
    echo -e "${BLUE}Using Python script instead...${NC}"
    python3 "$(dirname "$0")/download-models.py"
    exit $?
fi

# Remove existing broken symlink directories
if [ -d "./models/gemma-3-1b-it-mlc" ] || [ -d "./models/gemma-3-270m-it-mlc" ]; then
    echo -e "${YELLOW}⚠️  Found existing model directories${NC}"
    echo -e "${YELLOW}These appear to be broken symlinks. Removing...${NC}"
    rm -rf ./models/gemma-3-1b-it-mlc ./models/gemma-3-270m-it-mlc
    echo -e "${GREEN}✅ Removed old directories${NC}"
    echo ""
fi

# Create models directory if it doesn't exist
mkdir -p ./models

# Download Gemma 3 1B model
echo -e "${BLUE}📥 Downloading Gemma 3 1B model...${NC}"
echo -e "${YELLOW}This may take a while (~600MB download)...${NC}"
$HUGGINGFACE_CLI download mlc-ai/gemma-3-1b-it-q4f32_1-MLC \
  --local-dir ./models/gemma-3-1b-it-mlc \
  --local-dir-use-symlinks False

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Gemma 3 1B model downloaded${NC}"
else
    echo -e "${RED}❌ Failed to download Gemma 3 1B model${NC}"
    exit 1
fi

echo ""

# Download Gemma 3 270M model
echo -e "${BLUE}📥 Downloading Gemma 3 270M model...${NC}"
echo -e "${YELLOW}This may take a while (~200MB download)...${NC}"
$HUGGINGFACE_CLI download llinguini/gemma-3-270m-it-q4f16_1-MLC \
  --local-dir ./models/gemma-3-270m-it-mlc \
  --local-dir-use-symlinks False

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Gemma 3 270M model downloaded${NC}"
else
    echo -e "${RED}❌ Failed to download Gemma 3 270M model${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All models downloaded successfully!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "  1. Verify files: ls -la models/gemma-3-1b-it-mlc/"
echo "  2. Upload to R2: ./scripts/upload-models-to-r2-s3.sh"
