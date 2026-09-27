#!/bin/bash

# Script to download only Gemma 3 270M model
# Usage: ./scripts/download-gemma-270m.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📥 Downloading Gemma 3 270M model (without symlinks)${NC}"
echo ""

# Check if huggingface-cli is available
HUGGINGFACE_CLI=""

if command -v huggingface-cli &> /dev/null; then
    HUGGINGFACE_CLI="huggingface-cli"
elif [ -f ~/.local/bin/huggingface-cli ]; then
    HUGGINGFACE_CLI="$HOME/.local/bin/huggingface-cli"
elif python3 -c "import huggingface_hub" &>/dev/null; then
    HUGGINGFACE_CLI="python3 -m huggingface_hub.cli"
else
    echo -e "${RED}❌ huggingface-hub not found${NC}"
    echo ""
    echo -e "${YELLOW}Please install it first:${NC}"
    echo -e "${GREEN}pip install huggingface-hub${NC}"
    echo -e "${GREEN}or${NC}"
    echo -e "${GREEN}python3 -m pip install --user huggingface-hub${NC}"
    echo ""
    echo -e "${BLUE}After installing, you may need to add to PATH:${NC}"
    echo -e "${GREEN}export PATH=\"\$HOME/.local/bin:\$PATH\"${NC}"
    exit 1
fi

# Test the command
if ! $HUGGINGFACE_CLI --help &>/dev/null 2>&1; then
    # Try Python API directly
    if python3 -c "from huggingface_hub import snapshot_download" &>/dev/null; then
        echo -e "${BLUE}Using Python API directly...${NC}"
        python3 << 'PYTHON_SCRIPT'
import os
from pathlib import Path
from huggingface_hub import snapshot_download

models_dir = Path("./models")
gemma_270m_dir = models_dir / "gemma-3-270m-it-mlc"

# Remove existing directory if it exists
if gemma_270m_dir.exists():
    import shutil
    print("⚠️  Removing existing directory...")
    shutil.rmtree(gemma_270m_dir, ignore_errors=True)

# Create models directory
models_dir.mkdir(exist_ok=True)

# Download model
print("\n📥 Downloading Gemma 3 270M model...")
print("   Repository: llinguini/gemma-3-270m-it-q4f16_1-MLC")
print("   Destination: models/gemma-3-270m-it-mlc")
print("   This may take a while (~200MB)...")

snapshot_download(
    repo_id="llinguini/gemma-3-270m-it-q4f16_1-MLC",
    local_dir=str(gemma_270m_dir),
    local_dir_use_symlinks=False,
    resume_download=True
)

print("\n✅ Gemma 3 270M model downloaded successfully!")
print("\n📝 Next steps:")
print("  1. Verify files: ls -la models/gemma-3-270m-it-mlc/")
print("  2. Upload to R2: ./scripts/upload-models-to-r2-s3.sh")
PYTHON_SCRIPT
        exit $?
    else
        echo -e "${RED}❌ Cannot use huggingface-cli or Python API${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Using: ${HUGGINGFACE_CLI}${NC}"

# Remove existing broken symlink directory
if [ -d "./models/gemma-3-270m-it-mlc" ]; then
    echo -e "${YELLOW}⚠️  Found existing model directory${NC}"
    echo -e "${YELLOW}Removing...${NC}"
    rm -rf ./models/gemma-3-270m-it-mlc
    echo -e "${GREEN}✅ Removed old directory${NC}"
    echo ""
fi

# Create models directory if it doesn't exist
mkdir -p ./models

# Download Gemma 3 270M model
echo -e "${BLUE}📥 Downloading Gemma 3 270M model...${NC}"
echo -e "${YELLOW}This may take a while (~200MB download)...${NC}"
$HUGGINGFACE_CLI download llinguini/gemma-3-270m-it-q4f16_1-MLC \
  --local-dir ./models/gemma-3-270m-it-mlc \
  --local-dir-use-symlinks False

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Gemma 3 270M model downloaded${NC}"
    echo ""
    echo -e "${BLUE}📝 Next steps:${NC}"
    echo "  1. Verify files: ls -la models/gemma-3-270m-it-mlc/"
    echo "  2. Upload to R2: ./scripts/upload-models-to-r2-s3.sh"
else
    echo -e "${RED}❌ Failed to download Gemma 3 270M model${NC}"
    exit 1
fi
