from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import io
import hashlib
import numpy as np
import cv2
import imagehash
from PIL import Image, ImageChops
from PIL.ExifTags import TAGS
import base64

app = FastAPI(title="Veris Command Engine", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_ela(image_bytes: bytes, quality: int = 90):
    """
    Performs basic Error Level Analysis.
    Detects if portions of an image have different compression levels.
    """
    original = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    
    # Temporarily save and reopen to simulate resaving at a specific quality
    temp_buffer = io.BytesIO()
    original.save(temp_buffer, format='JPEG', quality=quality)
    resaved = Image.open(io.BytesIO(temp_buffer.getvalue()))
    
    # Calculate pixel difference
    ela_image = ImageChops.difference(original, resaved)
    
    # Get extrema to calculate a normalized score
    extrema = ela_image.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    if max_diff == 0: max_diff = 1
    
    # Scale image for better visibility (not returned here, but used for score)
    score = round(max_diff * 0.1, 2) 
    return score

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """Deep pixel forensics: ELA, Noise, and Perceptual Hashing."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # 1. Noise Variance Analysis (Laplacian)
        img_array = np.array(image)
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY).astype(np.float64)
        noise_variance = float(np.var(cv2.Laplacian(gray, cv2.CV_64F)))
        
        # 2. Error Level Analysis
        ela_score = calculate_ela(contents)
        
        # 3. Decision Logic
        # Suspect if ELA is high (splicing) or noise is too low (AI smoothing)
        is_suspicious = ela_score > 12.0 or noise_variance < 80.0
        trust_index = 98 if not is_suspicious else 35
        
        # 4. Neural Identity
        phash = str(imagehash.phash(image))

        return {
            "success": True,
            "phash": phash,
            "forensics": {
                "ela_score": ela_score,
                "noise_variance": round(noise_variance, 2),
                "estimated_trust": trust_index,
                "is_suspicious": is_suspicious
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/seal-data")
async def seal_data(file: UploadFile = File(...)):
    """Simulates Frequency Domain Sealing (DWT-DCT)."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # Calculate Hashes for the Registry
        phash = str(imagehash.phash(image))
        
        # Simulate Result Image (returning original for MVP simulation)
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return {
            "success": True,
            "phash": phash,
            "watermarked_image_b64": img_str
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/fingerprint")
async def generate_fingerprints(file: UploadFile = File(...)):
    """Derives multi-dimensional visual DNA."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        return {
            "success": True,
            "hashes": {
                "pHash": str(imagehash.phash(image)),
                "dHash": str(imagehash.dhash(image)),
                "aHash": str(imagehash.average_hash(image)),
                "sha256": hashlib.sha256(contents).hexdigest()
            }
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/metadata")
async def extract_metadata(file: UploadFile = File(...)):
    """Bitstream EXIF extraction."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        metadata_report = {
            "camera": {"make": "N/A", "model": "N/A", "lens": "Unknown"},
            "settings": {"aperture": "N/A", "shutter": "N/A", "iso": "N/A"},
            "fileInfo": {
                "size": f"{round(len(contents) / 1024, 1)} KB", 
                "dimensions": f"{image.width}x{image.height}", 
                "format": image.format, 
                "colorSpace": image.mode
            },
            "software": "Native Camera Hardware",
            "dateCreated": "Metadata Stripped",
            "warnings": []
        }

        exif_data = image.getexif()
        if not exif_data:
            metadata_report["warnings"].append("Integrity Risk: No EXIF headers found.")
        else:
            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)
                if tag == "Make": metadata_report["camera"]["make"] = str(value)
                elif tag == "Model": metadata_report["camera"]["model"] = str(value)
                elif tag == "Software": 
                    metadata_report["software"] = str(value)
                    if any(x in str(value).lower() for x in ["adobe", "photoshop", "gimp"]):
                        metadata_report["warnings"].append(f"Modification signature: {value}")
                elif tag == "DateTime": metadata_report["dateCreated"] = str(value)

        return {"success": True, "metadata": metadata_report}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/ai-detect")
async def detect_ai_content(file: UploadFile = File(...)):
    """Neural detection based on Laplacian noise distributions."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        img_array = np.array(image)
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY).astype(np.float64)
        noise_variance = float(np.var(cv2.Laplacian(gray, cv2.CV_64F)))
        
        # Probabilistic model: Generative AI often produces smoother textures 
        # (lower variance) compared to organic sensor noise.
        if noise_variance < 120:
            ai_prob = 88.5 + (120 - noise_variance) * 0.08
        else:
            ai_prob = max(2.5, 100 - (noise_variance * 0.12))
            
        ai_prob = min(99.9, round(ai_prob, 1))
        
        return {
            "success": True,
            "results": {
                "ai": ai_prob,
                "real": round(100 - ai_prob, 1)
            }
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    # Verify Engine serves on Port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)