#!/bin/bash

# Script to upload a single model directory to R2 with progress tracking
# Usage: ./scripts/upload-single-model.sh <model-dir-name>
# Example: ./scripts/upload-single-model.sh gemma-3-270m-it-mlc

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

MODEL_DIR_NAME=$1
BUCKET_NAME="webllm-models"
MODELS_DIR="./models"

if [ -z "$MODEL_DIR_NAME" ]; then
    echo -e "${RED}❌ Error: Model directory name required${NC}"
    echo "Usage: $0 <model-dir-name>"
    echo "Example: $0 gemma-3-270m-it-mlc"
    exit 1
fi

LOCAL_DIR="$MODELS_DIR/$MODEL_DIR_NAME"

if [ ! -d "$LOCAL_DIR" ]; then
    echo -e "${RED}❌ Directory not found: $LOCAL_DIR${NC}"
    exit 1
fi

# Get Account ID
echo -e "${BLUE}Getting Account ID...${NC}"
ACCOUNT_ID=$(wrangler whoami 2>/dev/null | awk '/Account ID/ {for(i=1;i<=NF;i++) if($i=="ID") {print $(i+1); break}}' | tr -d ' ')

if [ -z "$ACCOUNT_ID" ]; then
    ACCOUNT_ID="4cf4e785755949c2f0a61d2f3b532b69"  # Fallback
fi

R2_ENDPOINT="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"

echo -e "${GREEN}✅ Account ID: $ACCOUNT_ID${NC}"
echo -e "${BLUE}📤 Uploading: $MODEL_DIR_NAME${NC}"
echo ""

# Count total files first
echo -e "${BLUE}Counting files...${NC}"
TOTAL_FILES=$(find "$LOCAL_DIR" -type f ! -name ".DS_Store" 2>/dev/null | wc -l | tr -d ' ')

if [ "$TOTAL_FILES" -eq 0 ]; then
    echo -e "${RED}❌ No files found in $LOCAL_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}Found $TOTAL_FILES files to upload${NC}"
echo ""

# Create temp file with file list
TEMP_FILE=$(mktemp)
find "$LOCAL_DIR" -type f ! -name ".DS_Store" 2>/dev/null > "$TEMP_FILE"

CURRENT=0
SUCCESS=0
FAILED=0

# Upload each file
while IFS= read -r file; do
    [ -z "$file" ] && continue
    
    ((CURRENT++))
    
    # Get relative path
    rel_path="${file#$LOCAL_DIR/}"
    rel_path="${rel_path#./}"
    remote_path="$MODEL_DIR_NAME/$rel_path"
    
    # Get file size
    if [[ "$OSTYPE" == "darwin"* ]]; then
        size_bytes=$(stat -f%z "$file" 2>/dev/null || echo "0")
    else
        size_bytes=$(stat -c%s "$file" 2>/dev/null || echo "0")
    fi
    size_mb=$((size_bytes / 1024 / 1024))
    
    # Progress indicator
    printf "\r[%d/%d] 📤 %s (%dMB)..." "$CURRENT" "$TOTAL_FILES" "$rel_path" "$size_mb"
    
    # Determine content type
    case "$rel_path" in
        *.json) content_type="application/json" ;;
        *.bin) content_type="application/octet-stream" ;;
        *.wasm) content_type="application/wasm" ;;
        *.txt) content_type="text/plain" ;;
        *) content_type="application/octet-stream" ;;
    esac
    
    # Upload based on size
    if [ "$size_mb" -gt 300 ]; then
        # Use S3 API for large files
        if aws s3 cp "$file" "s3://$BUCKET_NAME/$remote_path" \
            --endpoint-url "$R2_ENDPOINT" \
            --content-type "$content_type" \
            --no-progress >/dev/null 2>&1; then
            ((SUCCESS++))
            printf "\r[%d/%d] ✅ %s\n" "$CURRENT" "$TOTAL_FILES" "$rel_path"
        else
            ((FAILED++))
            printf "\r[%d/%d] ❌ %s (FAILED)\n" "$CURRENT" "$TOTAL_FILES" "$rel_path"
        fi
    else
        # Use Wrangler for smaller files (suppress warnings)
        if wrangler r2 object put "$BUCKET_NAME/$remote_path" \
            --file="$file" \
            --content-type="$content_type" >/dev/null 2>&1; then
            ((SUCCESS++))
            printf "\r[%d/%d] ✅ %s\n" "$CURRENT" "$TOTAL_FILES" "$rel_path"
        else
            ((FAILED++))
            printf "\r[%d/%d] ❌ %s (FAILED)\n" "$CURRENT" "$TOTAL_FILES" "$rel_path"
        fi
    fi
done < "$TEMP_FILE"

rm -f "$TEMP_FILE"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Upload Summary:${NC}"
echo -e "   Total: $TOTAL_FILES files"
echo -e "   Success: $SUCCESS files"
if [ "$FAILED" -gt 0 ]; then
    echo -e "   ${RED}Failed: $FAILED files${NC}"
fi
echo -e "${BLUE}═══════════════════════════════════════${NC}"

if [ "$FAILED" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some files failed to upload${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Upload complete: $MODEL_DIR_NAME${NC}"
echo -e "${BLUE}📝 Verify: ./scripts/verify-r2-upload.sh${NC}"
