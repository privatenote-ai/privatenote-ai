#!/bin/bash

# Script to test if models are being served correctly from the Worker
# Usage: ./scripts/test-model-serving.sh

set -e

WORKER_URL="https://privatenote-api.marjan-skrobot.workers.dev"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🧪 Testing Model Serving from Worker${NC}"
echo -e "Worker URL: ${WORKER_URL}"
echo ""

# Test function
test_endpoint() {
    local path=$1
    local description=$2
    
    echo -e "${BLUE}Testing: ${description}${NC}"
    echo -e "  URL: ${WORKER_URL}${path}"
    
    response=$(curl -s -w "\n%{http_code}" "${WORKER_URL}${path}" 2>&1)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        size=$(echo "$body" | wc -c)
        echo -e "  ${GREEN}✅ Success (${http_code}) - ${size} bytes${NC}"
        
        # If it's JSON, show a preview
        if echo "$body" | head -c 1 | grep -q '{'; then
            preview=$(echo "$body" | head -c 100)
            echo -e "  Preview: ${preview}...${NC}"
        fi
        return 0
    else
        echo -e "  ${RED}❌ Failed (${http_code})${NC}"
        if [ -n "$body" ]; then
            echo -e "  Response: ${body:0:200}${NC}"
        fi
        return 1
    fi
}

# Test key files
echo -e "${BLUE}📦 Testing Gemma 3 270M Model:${NC}"
test_endpoint "/models/gemma-3-270m-it-mlc/mlc-chat-config.json" "Config file"
test_endpoint "/models/gemma-3-270m-it-mlc/tokenizer.json" "Tokenizer (first 100 bytes)"
echo ""

echo -e "${BLUE}📦 Testing Gemma 3 1B Model:${NC}"
test_endpoint "/models/gemma-3-1b-it-mlc/mlc-chat-config.json" "Config file"
test_endpoint "/models/gemma-3-1b-it-mlc/tokenizer.json" "Tokenizer (first 100 bytes)"
echo ""

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Testing complete!${NC}"
echo ""
echo -e "${BLUE}💡 Next steps:${NC}"
echo "  1. If all tests passed, your models are ready!"
echo "  2. Test in your app: Open the TestClientLLM page"
echo "  3. The app should automatically use self-hosted models"
echo ""
