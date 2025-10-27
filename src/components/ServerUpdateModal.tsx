"use client";
import { useState, useEffect } from "react";
import { X, Server, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface ServerUpdateModalProps {
  onClose?: () => void;
}

export default function ServerUpdateModal({ onClose }: ServerUpdateModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Show modal after a brief delay for smooth animation
    const showTimer = setTimeout(() => setIsVisible(true), 300);

    // Update clock every second
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(clockTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto transform transition-all duration-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-t-2xl p-6 text-white overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20 animate-pulse delay-150"></div>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon and title */}
            <div className="relative flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <Server className="h-8 w-8 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Pembaruan Server</h2>
                <p className="text-orange-100 text-sm mt-1">
                  Pemberitahuan Penting
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Date Badge */}
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-full px-6 py-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-900">
                    {currentTime.toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Main message */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Sedang Dalam Pembaruan
                  </h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    Kami sedang melakukan pembaruan server untuk meningkatkan
                    performa dan keamanan sistem. Beberapa layanan mungkin
                    mengalami gangguan sementara.
                  </p>
                </div>
              </div>
            </div>

            {/* Status items */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    Tracking Status
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Berfungsi Normal
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900">
                    Form Rekrutmen
                  </p>
                  <p className="text-xs text-orange-700 mt-0.5">
                    Dalam Perbaikan
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Server className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Dashboard HR
                  </p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Berfungsi Normal
                  </p>
                </div>
              </div>
            </div>

            {/* Estimated time */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-teal-100 rounded-full p-2">
                    <Clock className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-900">
                      Estimasi Selesai
                    </p>
                    <p className="text-xs text-teal-700 mt-0.5">
                      Kami bekerja secepat mungkin
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-teal-600">Segera</p>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Terima kasih atas pengertian dan kesabaran Anda
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="p-6 pt-0">
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
