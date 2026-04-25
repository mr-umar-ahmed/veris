// app/api/seal/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Notice we are now extracting the 'phash' from the frontend payload!
    const { hash, phash, filename, size, deviceSignature } = body;

    if (!hash) {
      return NextResponse.json({ error: 'Cryptographic hash is required' }, { status: 400 });
    }

    // We use the strict cryptographic hash (SHA-256) as the Document ID 
    const sealRef = doc(db, 'seals', hash);
    
    await setDoc(sealRef, {
      hash,
      phash: phash || null, // Save the Perceptual Hash for AI tracking!
      filename,
      size,
      deviceSignature,
      timestamp: serverTimestamp(),
      verisIndex: 100, // Origin files start with perfect trust
      status: 'origin_sealed'
    });

    return NextResponse.json({ success: true, hash });
  } catch (error) {
    console.error("Sealing Error:", error);
    return NextResponse.json({ error: 'Failed to generate Origin Seal' }, { status: 500 });
  }
}