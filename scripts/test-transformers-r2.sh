#!/bin/bash

# Verify a public host for the mobile Transformers.js runtime.
# Usage:
#   ./scripts/test-transformers-r2.sh
#   TRANSFORMERS_REMOTE_HOST=https://pub-...r2.dev \
#   TRANSFORMERS_MODEL_ID=onnx-community/SmolLM-135M-Instruct-ONNX \
#   ./scripts/test-transformers-r2.sh

set -euo pipefail

TRANSFORMERS_REMOTE_HOST="${TRANSFORMERS_REMOTE_HOST:-https://huggingface.co}"
TRANSFORMERS_MODEL_ID="${TRANSFORMERS_MODEL_ID:-onnx-community/SmolLM-135M-Instruct-ONNX}"
TRANSFORMERS_REVISION="${TRANSFORMERS_REVISION:-main}"
if [ -z "${TRANSFORMERS_REMOTE_PATH_TEMPLATE:-}" ]; then
  TRANSFORMERS_REMOTE_PATH_TEMPLATE='{model}/resolve/{revision}/'
fi
TEST_ORIGIN="${TEST_ORIGIN:-https://privatenote.ai}"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

trim_trailing_slash() {
  printf "%s" "${1%/}"
}

build_base_url() {
  local template="$1"
  template="${template//\{model\}/MODEL_PLACEHOLDER}"
  template="${template//\{revision\}/REVISION_PLACEHOLDER}"
  template="${template//MODEL_PLACEHOLDER/$TRANSFORMERS_MODEL_ID}"
  template="${template//REVISION_PLACEHOLDER/$TRANSFORMERS_REVISION}"
  printf "%s/%s" "$(trim_trailing_slash "$TRANSFORMERS_REMOTE_HOST")" "$template"
}

BASE_URL="$(build_base_url "$TRANSFORMERS_REMOTE_PATH_TEMPLATE")"

fetch_headers() {
  local url="$1"
  curl -sSI -H "Origin: $TEST_ORIGIN" "$url"
}

require_200() {
  local url="$1"
  local description="$2"
  echo -e "${BLUE}Testing file:${NC} ${description}"
  echo "  $url"
  local headers
  headers="$(fetch_headers "$url")"
  local status
  status="$(printf "%s\n" "$headers" | awk 'NR==1 {print $2}')"
  if [ "$status" != "200" ]; then
    echo -e "  ${RED}❌ Expected 200, got ${status}${NC}"
    printf "%s\n" "$headers"
    return 1
  fi
  local cors
  cors="$(printf "%s\n" "$headers" | awk 'BEGIN{IGNORECASE=1} /^Access-Control-Allow-Origin:/ {print $2}' | tr -d '\r')"
  if [ -n "$cors" ]; then
    echo -e "  ${GREEN}✅ 200 OK${NC} with CORS: ${cors}"
  else
    echo -e "  ${YELLOW}⚠️ 200 OK${NC} but no Access-Control-Allow-Origin header"
  fi
}

echo -e "${BLUE}🧪 Testing Transformers.js public host${NC}"
echo "Host:     $(trim_trailing_slash "$TRANSFORMERS_REMOTE_HOST")"
echo "Model:    $TRANSFORMERS_MODEL_ID"
echo "Revision: $TRANSFORMERS_REVISION"
echo "Template: $TRANSFORMERS_REMOTE_PATH_TEMPLATE"
echo "Origin:   $TEST_ORIGIN"
echo "Base URL: $BASE_URL"
echo

require_200 "${BASE_URL}config.json" "config.json"
require_200 "${BASE_URL}tokenizer.json" "tokenizer.json"
require_200 "${BASE_URL}tokenizer_config.json" "tokenizer_config.json"
require_200 "${BASE_URL}generation_config.json" "generation_config.json"
require_200 "${BASE_URL}onnx/model_q4.onnx" "onnx/model_q4.onnx"

echo
echo -e "${BLUE}Checking preflight behavior${NC}"
preflight_headers="$(curl -sSI -X OPTIONS -H "Origin: $TEST_ORIGIN" -H "Access-Control-Request-Method: GET" "${BASE_URL}config.json")"
preflight_status="$(printf "%s\n" "$preflight_headers" | awk 'NR==1 {print $2}')"
if [ "$preflight_status" = "200" ] || [ "$preflight_status" = "204" ]; then
  echo -e "  ${GREEN}✅ OPTIONS responded with ${preflight_status}${NC}"
else
  echo -e "  ${YELLOW}⚠️ OPTIONS responded with ${preflight_status}${NC}"
fi
printf "%s\n" "$preflight_headers" | awk 'BEGIN{IGNORECASE=1} /^Access-Control-Allow-Origin:|^Access-Control-Allow-Methods:|^Access-Control-Allow-Headers:/ {print "  " $0}'

echo
echo -e "${BLUE}Result${NC}"
echo "If any file is 404, the host layout does not match the runtime path template."
echo "If files are 200 but CORS headers are missing, browser fetches will still fail."
