# Veris Command Center 🛡️

Veris is an enterprise-grade cryptographic image forensics and watermarking platform. It provides sports organizations, media companies, and creators with the tools to authenticate digital assets, embed invisible ownership signatures, and detect unauthorized manipulation or AI generation.

## 🌟 Key Features

* **Public Verification Scanner:** A public-facing portal where anyone can upload media to verify its cryptographic origin against the global Veris ledger.
* **Invisible Watermarking:** Embed cryptographic IDs directly into the frequency domain of images. Survives cropping, compression, and filtering without altering visual fidelity.
* **Deep Pixel Forensics:** Advanced visual analysis including Error Level Analysis (ELA), Laplacian Noise Variance, and Copy-Move Clone Detection.
* **Perceptual Fingerprinting:** Generates robust `pHash`, `dHash`, and `aHash` vectors, alongside fragile cryptographic `SHA-256` checksums.
* **AI Neural Detection:** Evaluates image noise patterns to detect synthetic generation (e.g., Midjourney, Stable Diffusion) versus authentic camera sensor noise.
* **Metadata Provenance:** Extracts hidden EXIF data to locate editing software signatures and hardware capture parameters.
* **Secure Vault:** Firebase-authenticated dashboard to manage cryptographically sealed assets and monitor global scans.

## 🛠️ Tech Stack

**Frontend:**
* Next.js 14 (App Router)
* React 18
* Tailwind CSS (Glassmorphism UI)
* Lucide React (Icons)
* Firebase (Authentication & Firestore)

**Backend Engine:**
* Python 3.10+
* FastAPI & Uvicorn
* OpenCV (cv2)
* NumPy
* Pillow (PIL)
* ImageHash

## 🚀 Getting Started

### 1. Start the Python Forensics Engine
Open a terminal and navigate to your backend folder (or root if `main.py` is in the root):
```bash
pip install fastapi uvicorn python-multipart Pillow numpy opencv-python ImageHash
python main.py
The engine will run on https://veris-iz3o.onrender.com.

2. Start the Next.js Command Center
Open a second terminal in the root of your Next.js project:

Bash
npm install
npm run dev
The web app will run on http://localhost:3000.

3. Environment Variables
Ensure you have a .env.local file in your root directory with your Firebase configuration:

Code snippet
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
🎨 UI/UX Design
The platform utilizes a modern, light-theme "Bookavy" glassmorphism design system, featuring frosted cards, heavy border radii, and soft elemental glows to communicate enterprise trust and cutting-edge technology.


***

### Step 2: Push Everything to GitHub

Now that your README is saved, let's get your project onto GitHub.

**1. Go to GitHub and Create a Repo:**
* Log into [GitHub](https://github.com/).
* Click the **"+"** icon in the top right and select **"New repository"**.
* Name it `veris-mvp`.
* **IMPORTANT:** Leave "Add a README file" and "Add .gitignore" **UNCHECKED**. (You just made your own README!).
* Click **Create repository**.

**2. Run these commands in your Terminal:**
Open your terminal, make sure you are inside your `veris-mvp` folder, and run these commands one by one:

```bash
# Initialize git if you haven't already
git init

# Add all your files (including the new README)
git add .

# Commit your code
git commit -m "Initial commit: Veris MVP with Full UI and Python Engine"

# Set the branch name to main
git branch -M main

# Link your local folder to your new GitHub repo 
# (REPLACE 'YOUR_USERNAME' WITH YOUR ACTUAL GITHUB USERNAME!)
git remote add origin https://github.com/YOUR_USERNAME/veris-mvp.git

# Push the code to GitHub
git push -u origin main