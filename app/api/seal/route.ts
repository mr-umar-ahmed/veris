import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface SealRequest {
  hash: string;
  phash: string;
  filename: string;
  size: number;
  deviceSignature: string;
  ownerId?: string;
}

export async function POST(request: Request) {
  try {
    const body: SealRequest = await request.json();
    const { hash, phash, filename, size, deviceSignature, ownerId } = body;

    if (!hash || !phash) {
      return NextResponse.json({ error: 'Incomplete cryptographic payload' }, { status: 400 });
    }

    // Document ID is the SHA-256 for O(1) exact lookup
    const sealRef = doc(db, 'seals', hash);
    
    await setDoc(sealRef, {
      hash,
      phash, // Essential for detecting "Derived" or "Edited" work
      filename,
      size,
      deviceSignature,
      ownerId: ownerId || 'anonymous_origin',
      timestamp: serverTimestamp(),
      verisIndex: 100, // Assets start with perfect trust upon sealing
      status: 'origin_sealed'
    });

    return NextResponse.json({ 
      success: true, 
      hash,
      message: "Origin Seal generated successfully" 
    });

  } catch (error: unknown) {
    console.error("Sealing Error:", error);
    return NextResponse.json({ error: 'Failed to write to Veris Ledger' }, { status: 500 });
  }
}