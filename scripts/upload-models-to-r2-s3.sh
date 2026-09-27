#!/bin/bash

# Script to upload WebLLM models to Cloudflare R2 using S3 Compatibility API
# This handles files larger than 300MB which Wrangler CLI cannot upload
# Usage: ./scripts/upload-models-to-r2-s3.sh

set -e

BUCKET_NAME="webllm-models"
MODELS_DIR="./models"
MAX_WRANGLER_SIZE=314572800  # 300MB in bytes

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Uploading WebLLM models to Cloudflare R2 (S3 API)${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found${NC}"
    echo -e "${YELLOW}Install with: brew install awscli (macOS) or pip install awscli${NC}"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws configure list &>/dev/null || [ -z "$(aws configure get aws_access_key_id 2>/dev/null)" ]; then
    echo -e "${YELLOW}⚠️  AWS CLI is not configured${NC}"
    echo ""
    echo -e "${BLUE}📝 Setup Instructions:${NC}"
    echo "1. Get your R2 API credentials:"
    echo "   → Go to: https://dash.cloudflare.com/"
    echo "   → Navigate to: R2 → Manage R2 API Tokens"
    echo "   → Click: Create API Token"
    echo "   → Name it (e.g., 'R2 Upload Token')"
    echo "   → Permissions: Object Read & Write"
    echo "   → Copy the Access Key ID and Secret Access Key"
    echo ""
    echo "2. Configure AWS CLI:"
    echo "   Run: ${GREEN}aws configure${NC}"
    echo ""
    echo "   When prompted, enter:"
    echo "   - AWS Access Key ID: [Your R2 Access Key ID]"
    echo "   - AWS Secret Access Key: [Your R2 Secret Access Key]"
    echo "   - Default region name: ${GREEN}auto${NC}"
    echo "   - Default output format: ${GREEN}json${NC}"
    echo ""
    read -p "Press Enter after you've configured AWS CLI (or Ctrl+C to cancel)..."
    
    # Verify configuration
    if [ -z "$(aws configure get aws_access_key_id 2>/dev/null)" ]; then
        echo -e "${RED}❌ AWS CLI still not configured. Please run 'aws configure' first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ AWS CLI configured${NC}"
    echo ""
fi

# Get R2 endpoint URL
echo -e "${BLUE}📋 R2 Configuration:${NC}"
echo -e "  Bucket: ${BUCKET_NAME}"

# Get account ID from wrangler config or ask user
echo -e "${BLUE}Getting Account ID...${NC}"
# Try multiple methods to extract account ID
ACCOUNT_ID=$(wrangler whoami 2>/dev/null | grep -i "Account ID" | awk -F'│' '{print $2}' | awk '{print $1}' | tr -d ' ')
if [ -z "$ACCOUNT_ID" ]; then
    ACCOUNT_ID=$(wrangler whoami 2>/dev/null | grep -i "Account ID" | awk '{print $NF}' | tr -d ' ')
fi
if [ -z "$ACCOUNT_ID" ]; then
    ACCOUNT_ID=$(wrangler whoami 2>/dev/null | awk '/Account ID/ {for(i=1;i<=NF;i++) if($i=="ID") {print $(i+1); break}}' | tr -d ' ')
fi

if [ -z "$ACCOUNT_ID" ] || [ ${#ACCOUNT_ID} -lt 10 ]; then
    echo -e "${YELLOW}Could not auto-detect Account ID.${NC}"
    echo -e "${YELLOW}Your Account ID is: 4cf4e785755949c2f0a61d2f3b532b69${NC}"
    echo -e "${YELLOW}Enter your Cloudflare Account ID (or press Enter to use the one above):${NC}"
    read -r ACCOUNT_ID
    if [ -z "$ACCOUNT_ID" ]; then
        ACCOUNT_ID="4cf4e785755949c2f0a61d2f3b532b69"
    fi
fi

if [ -z "$ACCOUNT_ID" ] || [ ${#ACCOUNT_ID} -lt 10 ]; then
    echo -e "${RED}❌ Invalid Account ID${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Account ID: ${ACCOUNT_ID}${NC}"

R2_ENDPOINT="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"

echo -e "${BLUE}Using endpoint: ${R2_ENDPOINT}${NC}"

# Test AWS CLI configuration
echo -e "${BLUE}Testing AWS CLI configuration...${NC}"
if aws s3 ls "s3://${BUCKET_NAME}/" --endpoint-url "$R2_ENDPOINT" &>/dev/null; then
    echo -e "${GREEN}✅ AWS CLI configured and working${NC}"
elif aws configure list | grep -q "access_key"; then
    echo -e "${YELLOW}⚠️  AWS CLI configured but connection test failed${NC}"
    echo -e "${YELLOW}   This might be normal if the bucket is empty. Continuing...${NC}"
else
    echo -e "${RED}❌ AWS CLI not properly configured${NC}"
    echo -e "${YELLOW}   Please run: aws configure${NC}"
    echo -e "${YELLOW}   Then enter your R2 Access Key ID and Secret Access Key${NC}"
    exit 1
fi
echo ""

# Function to get file size in bytes
get_file_size() {
    stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null || echo "0"
}

# Function to get content type
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

# Function to upload a file (chooses method based on size)
upload_file() {
    local local_path=$1
    local remote_path=$2
    local file_size=$(get_file_size "$local_path")
    local content_type=$(get_content_type "$local_path")
    
    if [ ! -f "$local_path" ]; then
        echo -e "  ⚠️  File not found: $local_path" >&2
        return 1
    fi
    
    # Convert file size to human readable
    local size_mb=$((file_size / 1024 / 1024))
    
    # Use S3 API for files larger than 300MB
    if [ "$file_size" -gt "$MAX_WRANGLER_SIZE" ]; then
        echo -e "  📤 Uploading (S3 API, ${size_mb}MB): ${remote_path}"
        if aws s3 cp "$local_path" "s3://${BUCKET_NAME}/${remote_path}" \
            --endpoint-url "$R2_ENDPOINT" \
            --content-type "$content_type" \
            --no-progress 2>&1; then
            echo -e "  ✅ ${remote_path}"
            return 0
        else
            echo -e "  ❌ Failed: ${remote_path}" >&2
            return 1
        fi
    else
        # Use Wrangler for smaller files
        echo -e "  📤 Uploading (Wrangler, ${size_mb}MB): ${remote_path}"
        if wrangler r2 object put "$BUCKET_NAME/$remote_path" \
            --file="$local_path" \
            --content-type="$content_type" 2>&1; then
            echo -e "  ✅ ${remote_path}"
            return 0
        else
            echo -e "  ❌ Failed: ${remote_path}" >&2
            return 1
        fi
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
    # Use a temporary file to avoid subshell issues
    local temp_file=$(mktemp)
    find -L "$local_dir" -type f > "$temp_file" 2>/dev/null || find "$local_dir" -type f > "$temp_file"
    
    while IFS= read -r file; do
        if [ -z "$file" ]; then
            continue
        fi
        
        # Get relative path from local_dir
        # Remove the local_dir prefix and any leading ./
        rel_path="${file#$local_dir/}"
        rel_path="${rel_path#./}"  # Remove leading ./
        
        # Skip .DS_Store files
        if [[ "$rel_path" == *".DS_Store"* ]]; then
            continue
        fi
        
        remote_path="$remote_prefix/$rel_path"
        
        if upload_file "$file" "$remote_path"; then
            ((upload_count++))
        else
            ((error_count++))
        fi
    done < "$temp_file"
    
    rm -f "$temp_file"
    
    echo -e "  📊 Uploaded: ${upload_count} files, Errors: ${error_count}"
    
    if [ $upload_count -eq 0 ]; then
        echo -e "  ⚠️  No files found in: $local_dir"
        echo -e "  💡 Checking for broken symlinks..."
        
        # Check if files are symlinks
        local symlink_count=$(find "$local_dir" -type l 2>/dev/null | wc -l | tr -d ' ')
        if [ "$symlink_count" -gt 0 ]; then
            echo -e "  ⚠️  Found $symlink_count symlinks. Checking if they're broken..."
            local broken_count=0
            while IFS= read -r link; do
                if [ ! -e "$link" ]; then
                    ((broken_count++))
                fi
            done < <(find "$local_dir" -type l 2>/dev/null)
            
            if [ "$broken_count" -gt 0 ]; then
                echo -e "  ${RED}❌ Found $broken_count broken symlinks!${NC}"
                echo -e "  ${YELLOW}Your model files are symlinks pointing to missing blob files.${NC}"
                echo ""
                echo -e "  ${BLUE}Solution: Re-download models without symlinks:${NC}"
                echo -e "  ${GREEN}huggingface-cli download mlc-ai/gemma-3-1b-it-q4f32_1-MLC \\${NC}"
                echo -e "  ${GREEN}  --local-dir ./models/gemma-3-1b-it-mlc \\${NC}"
                echo -e "  ${GREEN}  --local-dir-use-symlinks False${NC}"
                echo ""
                echo -e "  See FIX_BROKEN_SYMLINKS.md for details"
            fi
        fi
        
        echo -e "  💡 Try: ls -la $local_dir"
        return 1
    fi
    
    if [ $error_count -gt 0 ]; then
        return 1
    fi
    return 0
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
echo "  2. Run verification: ./scripts/verify-r2-upload.sh"
echo "  3. Deploy your Worker to serve models"
