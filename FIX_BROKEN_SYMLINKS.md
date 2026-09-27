# Fix Broken Symlinks in Model Files

Your model files are **symbolic links** that are broken. The files point to a `blobs/` directory that doesn't exist or isn't accessible.

## Quick Fix: Re-download Without Symlinks

The easiest solution is to re-download the models without using symlinks:

```bash
# Remove existing models
rm -rf models/gemma-3-1b-it-mlc models/gemma-3-270m-it-mlc

# Re-download Gemma 3 1B without symlinks
huggingface-cli download mlc-ai/gemma-3-1b-it-q4f32_1-MLC \
  --local-dir ./models/gemma-3-1b-it-mlc \
  --local-dir-use-symlinks False

# Re-download Gemma 3 270M without symlinks
huggingface-cli download llinguini/gemma-3-270m-it-q4f16_1-MLC \
  --local-dir ./models/gemma-3-270m-it-mlc \
  --local-dir-use-symlinks False
```

## Alternative: Find and Copy Blob Files

If you want to keep the symlink structure, find where the blob files actually are:

```bash
# Find the blobs directory
find . -type d -name "blobs" 2>/dev/null

# Or check if blobs are in a parent directory
ls -la ../blobs/ 2>/dev/null
ls -la ../../blobs/ 2>/dev/null
```

If you find the blobs directory, you can either:
1. Copy the blob files to match the symlink structure
2. Update the symlinks to point to the correct location
3. Copy all files (following symlinks) to a new directory

## Copy Files Following Symlinks

If you want to create a copy with actual files (not symlinks):

```bash
# Create new directories with actual files
mkdir -p models-fixed/gemma-3-1b-it-mlc
mkdir -p models-fixed/gemma-3-270m-it-mlc

# Copy following symlinks
cp -RL models/gemma-3-1b-it-mlc/* models-fixed/gemma-3-1b-it-mlc/
cp -RL models/gemma-3-270m-it-mlc/* models-fixed/gemma-3-270m-it-mlc/

# Then use models-fixed for upload
```

## Verify Files Are Real (Not Symlinks)

After fixing, verify:

```bash
# Check if files are real files (not symlinks)
file models/gemma-3-1b-it-mlc/mlc-chat-config.json

# Should show: "ASCII text" or "JSON data", NOT "symbolic link"
```

## Updated Upload Scripts

The upload scripts have been updated to follow symlinks (`find -L`), but if the blob files don't exist, the uploads will still fail. The best solution is to re-download without symlinks.
