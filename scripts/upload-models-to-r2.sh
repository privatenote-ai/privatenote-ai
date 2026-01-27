#!/bin/bash

# Script to upload WebLLM models to Cloudflare R2
# Usage: ./scripts/upload-models-to-r2.sh

set -e

BUCKET_NAME="webllm-models"
MODELS_DIR="./models"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Uploading WebLLM models to Cloudflare R2${NC}"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler CLI not found. Installing...${NC}"
    npm install -g wrangler
fi

# Check if bucket exists, create if not
echo -e "${BLUE}📦 Checking R2 bucket...${NC}"
if ! wrangler r2 bucket list | grep -q "$BUCKET_NAME"; then
    echo -e "${YELLOW}Creating bucket: $BUCKET_NAME${NC}"
    wrangler r2 bucket create "$BUCKET_NAME"
    echo -e "${GREEN}✅ Bucket created${NC}"
else
    echo -e "${GREEN}✅ Bucket exists${NC}"
fi

# Function to upload a file
upload_file() {
    local local_path=$1
    local remote_path=$2
    
    if [ ! -f "$local_path" ]; then
        echo -e "  ⚠️  File not found: $local_path" >&2
        return 1
    fi
    
    # Upload with error handling
    if wrangler r2 object put "$BUCKET_NAME/$remote_path" --file="$local_path" --content-type="$(get_content_type "$local_path")" 2>&1; then
        echo -e "  ✅ ${remote_path}"
        return 0
    else
        echo -e "  ❌ Failed: ${remote_path}" >&2
        return 1
    fi
}

# Function to upload directory recursively
upload_directory() {
    local local_dir=$1
    local remote_prefix=$2
    local upload_count=0
    local error_count=0
    
    if [ ! -d "$local_dir" ]; then
        echo -e "  ⚠️  Directory not found: $local_dir"
        return 1
    fi
    
    # Find all files and upload them (follow symlinks with -L)
    # Use process substitution to avoid subshell issues
    while IFS= read -r file; do
        # Get relative path from local_dir
        rel_path="${file#$local_dir/}"
        rel_path="${rel_path#./}"  # Remove leading ./
        remote_path="$remote_prefix/$rel_path"
        
        if upload_file "$file" "$remote_path"; then
            ((upload_count++))
        else
            ((error_count++))
        fi
    done < <(find -L "$local_dir" -type f 2>/dev/null || find "$local_dir" -type f)
    
    echo -e "  📊 Uploaded: ${upload_count} files, Errors: ${error_count}"
    
    if [ $error_count -gt 0 ]; then
        return 1
    fi
    return 0
}

# Get content type based on extension
get_content_type() {
    local file=$1
    case "$file" in
        *.json) echo "application/json" ;;
        *.bin) echo "application/octet-stream" ;;
        *.wasm) echo "application/wasm" ;;
        *.model) echo "application/octet-stream" ;;
        *) echo "application/octet-stream" ;;
    esac
}

# Upload Gemma 3 1B model
echo ""
echo -e "${BLUE}📤 Uploading Gemma 3 1B model...${NC}"
GEMMA_1B_DIR="$MODELS_DIR/gemma-3-1b-it-mlc"
if [ -d "$GEMMA_1B_DIR" ]; then
    if upload_directory "$GEMMA_1B_DIR" "gemma-3-1b-it-mlc"; then
        echo -e "${GREEN}✅ Gemma 3 1B model uploaded successfully${NC}"
    else
        echo -e "${RED}❌ Gemma 3 1B model upload had errors${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Gemma 3 1B model directory not found: $GEMMA_1B_DIR${NC}"
    exit 1
fi

# Upload Gemma 3 270M model
echo ""
echo -e "${BLUE}📤 Uploading Gemma 3 270M model...${NC}"
GEMMA_270M_DIR="$MODELS_DIR/gemma-3-270m-it-mlc"
if [ -d "$GEMMA_270M_DIR" ]; then
    if upload_directory "$GEMMA_270M_DIR" "gemma-3-270m-it-mlc"; then
        echo -e "${GREEN}✅ Gemma 3 270M model uploaded successfully${NC}"
    else
        echo -e "${RED}❌ Gemma 3 270M model upload had errors${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Gemma 3 270M model directory not found: $GEMMA_270M_DIR${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Upload complete!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "  1. Verify files in R2 Dashboard: https://dash.cloudflare.com/ → R2 → $BUCKET_NAME"
echo "  2. Or test a file: wrangler r2 object get $BUCKET_NAME/gemma-3-1b-it-mlc/mlc-chat-config.json --file=/tmp/test.json"
echo "  3. Set up custom domain (optional): models.privatenote.ai"
echo "  4. Update VITE_MODEL_BASE_URL if using custom domain"
echo "  5. Deploy your Worker to serve models"
