// app/verify/[hash]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { ShieldCheck, AlertTriangle, HardDrive, FileText, Activity } from 'lucide-react';

// 1. Define the exact shape of your Firestore data
interface VerisSeal {
  hash: string;
  filename: string;
  size: number;
  deviceSignature: string;
  timestamp: Timestamp;
  verisIndex: number;
  status: string;
}

export default function VerifyPage() {
  const params = useParams();
  const hash = params.hash as string;

  const [loading, setLoading] = useState(true);
  
  // 2. Replace <any> with your new interface
  const [sealData, setSealData] = useState<VerisSeal | null>(null);

  useEffect(() => {
    async function fetchSeal() {
      if (!hash) return;
      try {
        const docRef = doc(db, 'seals', hash);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Cast the returned data to your interface
          setSealData(docSnap.data() as VerisSeal);
        } else {
          setSealData(null); 
        }
      } catch (error) {
        console.error("Error fetching seal:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSeal();
  }, [hash]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Verifying cryptographic signature...</p>
      </div>
    );
  }

  if (!sealData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Integrity Compromised</h1>
        <p className="text-gray-600 mt-2 max-w-md">
          This cryptographic hash does not exist in the Veris registry. The media may be forged, altered, or never sealed at origin.
        </p>
        <div className="mt-6 bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-mono text-xs break-all max-w-lg">
          {hash}
        </div>
      </div>
    );
  }

  const date = sealData.timestamp?.toDate() 
    ? new Date(sealData.timestamp.toDate()).toLocaleString() 
    : 'Just now';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center">
          <ShieldCheck className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight">Veris Certificate</h1>
          <p className="mt-2 text-lg text-gray-500">Cryptographic Proof of Origin</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-green-50 to-white">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Veris Trust Index</h2>
              <p className="text-sm text-gray-500 mt-1">Calculated via semantic and structural analysis</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <span className="text-5xl font-black text-green-600">{sealData.verisIndex}</span>
              <span className="text-xl text-gray-400">/ 100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-400" /> File Metadata
              </h3>
              <div>
                <p className="text-xs text-gray-500 mb-1">Original Filename</p>
                <p className="text-sm font-medium text-gray-900 truncate">{sealData.filename}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">File Size</p>
                <p className="text-sm font-medium text-gray-900">{(sealData.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center">
                <Activity className="h-4 w-4 mr-2 text-gray-400" /> Provenance Data
              </h3>
              <div>
                <p className="text-xs text-gray-500 mb-1">Capture Device Signature</p>
                <p className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">{sealData.deviceSignature}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Sealed On</p>
                <p className="text-sm font-medium text-gray-900">{date}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 uppercase font-bold mb-2 tracking-wider flex items-center">
              <HardDrive className="h-4 w-4 mr-2" /> Immutable Origin Hash (SHA-256)
            </p>
            <p className="font-mono text-sm text-gray-700 break-all bg-white p-3 border rounded-lg shadow-inner">
              {sealData.hash}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}