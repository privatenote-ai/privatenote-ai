# R2 S3 Compatibility API Setup for Large Files

Cloudflare R2 has a 300MB file size limit for Wrangler CLI uploads. For larger files, use the S3 Compatibility API.

## Quick Setup

### Step 1: Install AWS CLI

**macOS:**
```bash
brew install awscli
```

**Linux:**
```bash
pip install awscli
# or
sudo apt-get install awscli  # Ubuntu/Debian
```

**Windows:**
```bash
# Download from: https://awscli.amazonaws.com/AWSCLIV2.msi
```

### Step 2: Get R2 API Credentials

1. Go to Cloudflare Dashboard: https://dash.cloudflare.com/
2. Navigate to: **R2** → **Manage R2 API Tokens**
3. Click **Create API Token**
4. Give it a name (e.g., "R2 Upload Token")
5. Set permissions: **Object Read & Write**
6. Click **Create API Token**
7. **Save the credentials** - you'll see:
   - Access Key ID
   - Secret Access Key

### Step 3: Get Your Account ID

```bash
wrangler whoami
```

Look for "Account ID" in the output, or find it in:
- Dashboard → Right sidebar → Account ID

### Step 4: Configure AWS CLI

```bash
aws configure
```

Enter the following:
- **AWS Access Key ID**: Your R2 Access Key ID
- **AWS Secret Access Key**: Your R2 Secret Access Key
- **Default region name**: `auto` (required but not used by R2)
- **Default output format**: `json`

### Step 5: Test Configuration

```bash
# Test with a small file
aws s3 ls s3://webllm-models/ --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

Replace `<ACCOUNT_ID>` with your actual account ID.

## Upload Models

### Option 1: Use the S3 Upload Script (Recommended)

```bash
./scripts/upload-models-to-r2-s3.sh
```

This script automatically:
- Uses S3 API for files > 300MB
- Uses Wrangler CLI for smaller files
- Handles all file types correctly

### Option 2: Manual Upload with AWS CLI

```bash
# Set your account ID
export ACCOUNT_ID="your-account-id"
export R2_ENDPOINT="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"

# Upload a single file
aws s3 cp ./models/gemma-3-1b-it-mlc/mlc-chat-config.json \
  s3://webllm-models/gemma-3-1b-it-mlc/mlc-chat-config.json \
  --endpoint-url "$R2_ENDPOINT"

# Upload entire directory
aws s3 sync ./models/gemma-3-1b-it-mlc/ \
  s3://webllm-models/gemma-3-1b-it-mlc/ \
  --endpoint-url "$R2_ENDPOINT"
```

### Option 3: Use AWS CLI with Profile

Create a profile specifically for R2:

```bash
aws configure --profile r2
# Enter R2 credentials when prompted
```

Then use:
```bash
aws s3 cp file.txt s3://bucket/file.txt \
  --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com \
  --profile r2
```

## Verify Upload

```bash
# List objects
aws s3 ls s3://webllm-models/ --endpoint-url "$R2_ENDPOINT" --recursive

# Or use the verification script
./scripts/verify-r2-upload.sh
```

## Troubleshooting

### "Access Denied" Error
- Check your API token has "Object Read & Write" permissions
- Verify credentials are correct: `aws configure list`

### "Invalid endpoint" Error
- Verify your account ID is correct
- Endpoint format: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
- Account ID should be 32 characters (hex)

### "Connection timeout" Error
- Check your internet connection
- Verify R2 is enabled in your account
- Try from a different network

### Large File Upload Fails
- S3 API supports files up to 5TB
- For very large files, consider using multipart upload
- Check available disk space

## Alternative: Use Cloudflare Dashboard

For one-time uploads, you can also:
1. Go to: https://dash.cloudflare.com/ → R2 → webllm-models
2. Click **Upload**
3. Select files (supports large files via browser)
4. Wait for upload to complete

This is slower but doesn't require CLI setup.
