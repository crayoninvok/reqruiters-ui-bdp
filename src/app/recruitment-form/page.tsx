"use client";
import React, { useState, useEffect } from "react";
import { Clock, Mail, Home, AlertCircle } from "lucide-react";

const UnderMaintenancePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const goToHomepage = () => {
    window.location.href = "/tracking";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icon Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative inline-block">
              <div className="loader-container">
                <img
                  src="/nobgbtr.png"
                  alt="Batara Logo"
                  className="logo-center"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Sedang Dalam Perbaikan
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8">Halaman Rekrutmen Publik</p>

          {/* Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start text-left">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Mohon Maaf atas Ketidaknyamanannya
                </h3>
                <p className="text-blue-800 leading-relaxed">
                  Kami sedang melakukan pemeliharaan dan peningkatan sistem
                  untuk memberikan pengalaman yang lebih baik. Formulir
                  rekrutmen sementara tidak dapat diakses.
                </p>
              </div>
            </div>
          </div>

          {/* Current Time */}
          <div className="flex items-center justify-center text-gray-600 mb-8">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-mono text-lg">
              {currentTime.toLocaleString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>

          {/* Expected Time */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <p className="text-green-800 font-medium">
              ⏱️ Estimasi selesai: <span className="font-bold">Segera</span>
            </p>
            <p className="text-green-700 text-sm mt-1">
              Kami bekerja keras untuk menyelesaikannya secepat mungkin
            </p>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
              <div className="text-center">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800">
                  info@bataramining.com
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={goToHomepage}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Home className="h-5 w-5 mr-2" />
              Kembali ke Beranda
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              🔄 Refresh Halaman
            </button>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Terima kasih atas pengertian dan kesabaran Anda
            </p>
            <p className="text-xs text-gray-400 mt-2">
              PT. Batara Dharma Persada © {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            💡 <span className="font-semibold">Tips:</span> Simpan halaman ini
            dan coba kembali nanti
          </p>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .loader-container {
          position: relative;
          width: 96px;
          height: 96px;
        }

        .loader-container::before,
        .loader-container::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          box-sizing: border-box;
          border: 6px solid transparent;
        }

        .loader-container::before {
          border-top-color: #e85c23;
          border-right-color: #e85c23;
          animation: rotation 1.5s linear infinite;
        }

        .loader-container::after {
          border-bottom-color: #1fbfb8;
          border-left-color: #1fbfb8;
          animation: rotation 1.5s linear infinite;
        }

        .logo-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          z-index: 10;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default UnderMaintenancePage;
