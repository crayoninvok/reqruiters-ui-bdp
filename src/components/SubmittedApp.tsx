import React, { useState } from 'react';
import { CheckCircle, Home, Copy, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SubmissionResult {
  message: string;
  applicationId?: string;
}

interface FinnishTestProps {
  submissionResult?: SubmissionResult;
}

export default function SubmittedApp({ 
  submissionResult = { 
    message: "Terima kasih telah melamar! Kami akan menghubungi Anda segera.",
    applicationId: "APP-" + Date.now().toString().slice(-6)
  } 
}: FinnishTestProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showCopyReminder, setShowCopyReminder] = useState(false);

  const copyToClipboard = async () => {
    if (submissionResult.applicationId) {
      try {
        await navigator.clipboard.writeText(submissionResult.applicationId);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = submissionResult.applicationId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    }
  };

  const goToHomepage = () => {
    if (!copied && submissionResult.applicationId) {
      setShowCopyReminder(true);
      setTimeout(() => setShowCopyReminder(false), 5000);
      return;
    }
    router.push('/tracking'); // or wherever your homepage/tracking page is
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        
        {/* Copy Reminder Alert */}
        {showCopyReminder && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-amber-800 font-medium">
                Jangan lupa salin ID lamaran Anda sebelum keluar!
              </p>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Lamaran Tersubmit!
        </h1>
        
        {/* Animated attention-grabbing notice */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4 animate-pulse">
          <h2 className="text-lg font-bold text-yellow-800 mb-2">
            📸 PENTING: Screenshot & Salin ID!
          </h2>
          <p className="text-yellow-700 text-sm">
            Simpan ID ini untuk melacak status lamaran Anda
          </p>
        </div>
        
        <p className="text-gray-600 mb-6">{submissionResult.message}</p>
        
        {submissionResult.applicationId && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6 relative">
            {/* Blinking attention indicator */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 rounded-full"></div>
            
            <p className="text-sm text-blue-700 font-semibold mb-2 uppercase tracking-wide">
              ID Lamaran Anda:
            </p>
            
            <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-4 mb-4">
              <p className="text-2xl font-mono font-bold text-blue-600 mb-2 select-all">
                {submissionResult.applicationId}
              </p>
              
              <button
                onClick={copyToClipboard}
                className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    ID Tersalin! ✓
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    📋 SALIN ID SEKARANG
                  </>
                )}
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-blue-600 font-medium mb-1">
                ⚠️ ID ini WAJIB disimpan untuk cek status lamaran
              </p>
              <p className="text-xs text-gray-500">
                Tanpa ID ini, Anda tidak bisa melacak lamaran
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={goToHomepage}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
              copied 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
            disabled={!copied && !!submissionResult.applicationId}
          >
            <Home className="h-4 w-4 mr-2" />
            {copied ? 'Kembali ke Beranda Batara' : '🔒 Salin ID Dulu Sebelum Keluar'}
          </button>
          
          {!copied && submissionResult.applicationId && (
            <p className="text-xs text-red-600 text-center font-medium">
              Tombol akan aktif setelah ID disalin
            </p>
          )}
        </div>
      </div>
    </div>
  );
}