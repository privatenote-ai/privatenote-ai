# Enable Cloudflare R2

You need to enable R2 in your Cloudflare account before you can create buckets.

## Steps to Enable R2

### Option 1: Via Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**:
   - Visit: https://dash.cloudflare.com/
   - Log in to your account

2. **Navigate to R2**:
   - Click on **"R2"** in the left sidebar
   - Or go directly to: https://dash.cloudflare.com/?to=/:account/r2

3. **Enable R2**:
   - If you see a prompt to "Enable R2", click it
   - You may need to:
     - Agree to terms of service
     - Set up billing (R2 has a free tier, but requires payment method)
     - Wait a few minutes for activation

4. **Verify R2 is Enabled**:
   - You should see the R2 dashboard
   - You can create buckets from here

### Option 2: Via Wrangler (After Dashboard Setup)

Once R2 is enabled in the dashboard, you can use wrangler:

```bash
# Verify R2 is accessible
wrangler r2 bucket list

# Create the bucket
wrangler r2 bucket create webllm-models
```

## R2 Pricing & Free Tier

- **Free Tier**: 
  - 10 GB storage per month
  - 1 million Class A operations (writes)
  - 10 million Class B operations (reads)
  - **First 10 GB egress per month is FREE**

- **Paid Tier** (after free tier):
  - Storage: $0.015/GB/month
  - Class A: $4.50 per million
  - Class B: $0.36 per million
  - Egress: $0.09/GB (after first 10GB free)

For WebLLM models:
- **Storage**: ~800MB total → Well within free tier
- **Egress**: First 10GB/month free → Perfect for model downloads
- **Cost**: Essentially **FREE** for most use cases!

## After Enabling R2

Once R2 is enabled, run:

```bash
# Create the bucket
wrangler r2 bucket create webllm-models

# Upload models
./scripts/upload-models-to-r2.sh
```

## Troubleshooting

### "Please enable R2 through the Cloudflare Dashboard"
- R2 is not enabled in your account
- Follow the steps above to enable it

### "Account not found" or "Permission denied"
- Make sure you're logged in: `wrangler login`
- Verify you're using the correct account
- Check you have admin/owner permissions

### Billing Issues
- R2 requires a payment method even for free tier
- Add payment method in Cloudflare Dashboard → Billing
- Free tier won't charge you unless you exceed limits
