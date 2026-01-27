#!/usr/bin/env python3
"""
Download WebLLM models without symlinks
Usage: python3 scripts/download-models.py
"""

import os
import sys
from pathlib import Path

try:
    from huggingface_hub import snapshot_download
except ImportError:
    print("❌ huggingface-hub not installed")
    print("Install with: pip install huggingface-hub")
    sys.exit(1)

def download_model(repo_id: str, local_dir: str, model_name: str):
    """Download a model from HuggingFace"""
    print(f"\n📥 Downloading {model_name}...")
    print(f"   Repository: {repo_id}")
    print(f"   Destination: {local_dir}")
    print(f"   This may take a while...")
    
    try:
        snapshot_download(
            repo_id=repo_id,
            local_dir=local_dir,
            local_dir_use_symlinks=False,
            resume_download=True
        )
        print(f"✅ {model_name} downloaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to download {model_name}: {e}")
        return False

def main():
    # Remove existing broken symlink directories
    models_dir = Path("./models")
    gemma_1b_dir = models_dir / "gemma-3-1b-it-mlc"
    gemma_270m_dir = models_dir / "gemma-3-270m-it-mlc"
    
    if gemma_1b_dir.exists() or gemma_270m_dir.exists():
        print("⚠️  Found existing model directories")
        print("   These appear to be broken symlinks. Removing...")
        if gemma_1b_dir.exists():
            import shutil
            shutil.rmtree(gemma_1b_dir, ignore_errors=True)
        if gemma_270m_dir.exists():
            import shutil
            shutil.rmtree(gemma_270m_dir, ignore_errors=True)
        print("✅ Removed old directories\n")
    
    # Create models directory
    models_dir.mkdir(exist_ok=True)
    
    # Download models
    success = True
    
    success &= download_model(
        "mlc-ai/gemma-3-1b-it-q4f32_1-MLC",
        str(gemma_1b_dir),
        "Gemma 3 1B"
    )
    
    success &= download_model(
        "llinguini/gemma-3-270m-it-q4f16_1-MLC",
        str(gemma_270m_dir),
        "Gemma 3 270M"
    )
    
    if success:
        print("\n🎉 All models downloaded successfully!")
        print("\n📝 Next steps:")
        print("  1. Verify files: ls -la models/gemma-3-1b-it-mlc/")
        print("  2. Upload to R2: ./scripts/upload-models-to-r2-s3.sh")
    else:
        print("\n❌ Some downloads failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
