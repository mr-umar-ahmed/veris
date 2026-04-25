from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import io
import hashlib
import numpy as np
import cv2
import imagehash
from PIL import Image
from PIL.ExifTags import TAGS
import base64

app = FastAPI(title="Veris Command Engine")

# Configure CORS so Next.js on port 3000 can talk to Python on port 8000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """Full forensic scan for the public scanner and deep forensics pages."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # Simulate ELA and Noise processing
        img_array = np.array(image)
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY).astype(np.float64)
        noise_variance = float(np.var(cv2.Laplacian(gray, cv2.CV_64F)))
        
        # Heuristic mock for Error Level Analysis
        ela_score = round(np.random.uniform(2.0, 15.0), 2)
        
        is_suspicious = ela_score > 10 or noise_variance < 100
        trust = 95 if not is_suspicious else 45
        phash = str(imagehash.phash(image))

        return {
            "success": True,
            "phash": phash,
            "forensics": {
                "ela_score": ela_score,
                "noise_variance": round(noise_variance, 2),
                "estimated_trust": trust,
                "is_suspicious": is_suspicious
            }
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/seal-data")
async def seal_data(file: UploadFile = File(...)):
    """Simulates embedding a DWT-DCT watermark and returns the protected image data."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        phash = str(imagehash.phash(image))
        
        # In a production app, the watermarking algorithm goes here.
        # For the MVP, we return the base64 of the image to simulate the result.
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
    """Generates multiple perceptual hashes and a cryptographic SHA-256."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        sha256_hash = hashlib.sha256(contents).hexdigest()
        
        return {
            "success": True,
            "hashes": {
                "pHash": str(imagehash.phash(image)),
                "dHash": str(imagehash.dhash(image)),
                "aHash": str(imagehash.average_hash(image)),
                "sha256": sha256_hash
            }
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/metadata")
async def extract_metadata(file: UploadFile = File(...)):
    """Extracts EXIF data and structural info from the uploaded image."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        file_size_mb = round(len(contents) / (1024 * 1024), 2)
        width, height = image.size
        
        metadata_report = {
            "camera": {"make": "Unknown", "model": "Unknown", "lens": "Unknown"},
            "settings": {"aperture": "Unknown", "shutter": "Unknown", "iso": "Unknown", "focalLength": "Unknown"},
            "fileInfo": {"size": f"{file_size_mb} MB", "dimensions": f"{width} x {height}", "format": image.format, "colorSpace": image.mode},
            "software": "Unknown",
            "dateCreated": "Unknown",
            "warnings": []
        }

        exif_data = image.getexif()
        if exif_data:
            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)
                if tag == "Make": metadata_report["camera"]["make"] = str(value)
                elif tag == "Model": metadata_report["camera"]["model"] = str(value)
                elif tag == "Software": 
                    metadata_report["software"] = str(value)
                    if "Photoshop" in str(value) or "Lightroom" in str(value):
                        metadata_report["warnings"].append(f"Editing software detected: {value}")
                elif tag == "DateTime": metadata_report["dateCreated"] = str(value)

        return {"success": True, "metadata": metadata_report}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/ai-detect")
async def detect_ai_content(file: UploadFile = File(...)):
    """Simulates AI detection based on noise variance heuristics."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        img_array = np.array(image)
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY).astype(np.float64)
        noise_variance = float(np.var(cv2.Laplacian(gray, cv2.CV_64F)))
        
        # AI models typically produce unnaturally smooth noise compared to real camera sensors
        if noise_variance < 150:
            ai_prob = 85 + (150 - noise_variance) * 0.1 
        else:
            ai_prob = max(5, 100 - (noise_variance * 0.05))
            
        ai_prob = min(99, max(1, round(ai_prob, 1)))
        
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
    uvicorn.run(app, host="0.0.0.0", port=8000)