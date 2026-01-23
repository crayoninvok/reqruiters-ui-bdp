"use client";
import React, { useState } from "react";
import {
  X,
  Share2,
  MessageCircle,
  Linkedin,
  Instagram,
  Copy,
  Check,
  QrCode,
  Download,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareUrl = "https://bdphrdatabase.vercel.app/recruitment-form",
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Check if device is mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Check if Web Share API is supported
  const canUseNativeShare = () => {
    return typeof navigator.share === "function" && isMobile();
  };

  const shareQRCode = async (platform: string) => {
    const qrImageUrl = `${window.location.origin}/qrcode.jpg`;
    const message = `🚀 Join our team! Scan this QR code to apply: ${shareUrl}`;

    // Use native sharing on mobile when available
    if (canUseNativeShare() && platform !== "copy") {
      try {
        await navigator.share({
          title: "BDP Recruitment - QR Code",
          text: `🚀 Join our team! Apply now: ${shareUrl}\n\n📱 QR Code: ${qrImageUrl}`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fall back to platform-specific sharing if native share fails
      }
    }

    switch (platform) {
      case "whatsapp":
        const whatsappMessage = `🚀 Join our team! Apply now through our recruitment portal: ${shareUrl}\n\n📱 QR Code available at: ${qrImageUrl}`;
        if (isMobile()) {
          // Use WhatsApp mobile app URL scheme
          window.location.href = `whatsapp://send?text=${encodeURIComponent(
            whatsappMessage
          )}`;
        } else {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`,
            "_blank"
          );
        }
        break;

      case "linkedin":
        const linkedinText = `🚀 We Are Hiring Now!! \n\n Exciting career opportunities available at PT.Batara Dharma Persada!\n\n✨ We're looking for talented individuals to join our growing team.\n\n📝 Apply now: ${shareUrl}\n\n📱 QR Code: ${qrImageUrl}\n\n#Bataramining #BataraDharmaPersada #BDP #Recruitment #BataraRecruitment`;
        if (isMobile()) {
          // Use LinkedIn mobile app URL scheme
          window.location.href = `linkedin://sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}&title=${encodeURIComponent(
            "BDP Recruitment"
          )}&summary=${encodeURIComponent(linkedinText)}`;
        } else {
          window.open(
            `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
              linkedinText
            )}`,
            "_blank"
          );
        }
        break;

      case "instagram":
        if (isMobile()) {
          // Try Instagram app URL scheme first
          const instagramUrl = `instagram://share?text=${encodeURIComponent(
            `🚀 Join our team! ${shareUrl}`
          )}`;
          const fallbackMessage = `Kode QR dan tautan disalin! Anda sekarang dapat menempelkannya di Instagram.\n\nTautan: ${shareUrl}\nKode QR: Unduh dari aplikasi`;

          // Try to open Instagram app, fallback to copy
          try {
            window.location.href = instagramUrl;
            setTimeout(() => {
              copyToClipboard();
              alert(fallbackMessage);
            }, 1000);
          } catch (err) {
            copyToClipboard();
            alert(fallbackMessage);
          }
        } else {
            copyToClipboard();
            alert(
              `Gambar kode QR dan tautan disalin! \n\nAnda sekarang dapat:\n1. Simpan gambar kode QR dari /qrcode.jpg\n2. Posting di Instagram\n3. Tambahkan tautan ${shareUrl} ke bio atau story Anda`
            );
        }
        break;

      case "copy":
        try {
          await navigator.clipboard.writeText(
            `QR Code Image: ${qrImageUrl}\nRecruitment Link: ${shareUrl}`
          );
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          copyToClipboard();
        }
        break;
    }
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        const message = `🚀 Join our team! Apply now through our recruitment portal: ${shareUrl}`;

        if (canUseNativeShare()) {
          navigator
            .share({
              title: "BDP Recruitment Opportunity",
              text: message,
              url: shareUrl,
            })
            .catch(() => {
              // Fallback to WhatsApp URL
              if (isMobile()) {
                window.location.href = `whatsapp://send?text=${encodeURIComponent(
                  message
                )}`;
              } else {
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(message)}`,
                  "_blank"
                );
              }
            });
        } else if (isMobile()) {
          window.location.href = `whatsapp://send?text=${encodeURIComponent(
            message
          )}`;
        } else {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(message)}`,
            "_blank"
          );
        }
      },
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {
        const text = `🚀 We Are Hiring Now!! \n\n Exciting career opportunities available at PT.Batara Dharma Persada!\n\n✨ We're looking for talented individuals to join our growing team.\n\n📝 Apply now: ${shareUrl}\n\n#Bataramining #BataraDharmaPersada #BDP #Recruitment #BataraRecruitment`;

        if (canUseNativeShare()) {
          navigator
            .share({
              title: "BDP Career Opportunity",
              text: text,
              url: shareUrl,
            })
            .catch(() => {
              // Fallback to LinkedIn URL
              if (isMobile()) {
                window.location.href = `linkedin://sharing/share-offsite/?url=${encodeURIComponent(
                  shareUrl
                )}`;
              } else {
                window.open(
                  `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
                    text
                  )}`,
                  "_blank"
                );
              }
            });
        } else if (isMobile()) {
          window.location.href = `linkedin://sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`;
        } else {
          window.open(
            `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
              text
            )}`,
            "_blank"
          );
        }
      },
    },
    {
      name: "Instagram",
      icon: Instagram,
      color:
        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      action: () => {
        if (canUseNativeShare()) {
          navigator
            .share({
              title: "BDP Recruitment",
              text: `🚀 Join our team! Apply now: ${shareUrl}`,
              url: shareUrl,
            })
            .catch(() => {
              copyToClipboard();
              alert(
                "Tautan disalin! Anda sekarang dapat menempelkannya di bio atau story Instagram Anda."
              );
            });
        } else {
          copyToClipboard();
          alert(
            "Link copied! You can now paste it in your Instagram bio or story."
          );
        }
      },
    },
    {
      name: "Copy Link",
      icon: copied ? Check : Copy,
      color: copied ? "bg-green-500" : "bg-gray-600 hover:bg-gray-700",
      action: copyToClipboard,
    },
  ];

  const downloadQR = () => {
    // Create a link element and trigger download
    const link = document.createElement("a");
    link.href = "/qrcode.jpg";
    link.download = "recruitment-form-qr.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Bagikan Form Rekrutmen
              </h3>
              <p className="text-sm text-gray-500">
                Bagikan kesempatan ini dengan orang lain
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* URL Display */}
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-sm text-gray-600 mb-2">URL Form Rekrutmen:</p>
            <p className="text-sm font-mono text-gray-800 break-all">
              {shareUrl}
            </p>
          </div>

          {/* QR Code Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <QrCode className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Kode QR</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  showQR ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showQR && (
              <div className="mt-4 p-4 bg-white border rounded-lg">
                <div className="flex flex-col items-center">
                  <img
                    src="/qrcode.jpg"
                    alt="QR Code for Recruitment Form"
                    className="w-48 h-48 border rounded-lg mb-4"
                  />

                  {/* QR Code Action Buttons */}
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={downloadQR}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh</span>
                    </button>
                    <button
                      onClick={() => shareQRCode("copy")}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Bagikan QR</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Share Options */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-4">
              Bagikan tautan melalui:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className={`flex items-center space-x-3 p-4 rounded-xl text-white transition-all duration-200 transform hover:scale-105 ${option.color}`}
                >
                  <option.icon className="w-5 h-5" />
                  <span className="font-medium">{option.name === "Copy Link" ? "Salin Tautan" : option.name}</span>
                </button>
              ))}
            </div>

            {/* Additional sharing tips */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                📱 Tips Profesional:
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>
                  • <strong>LinkedIn:</strong> Membuka dengan posting profesional yang sudah ditulis
                </li>
                <li>
                  • <strong>WhatsApp:</strong> Sempurna untuk pendekatan langsung ke kandidat
                </li>
                <li>
                  • <strong>Kode QR:</strong> Bagus untuk materi cetak dan pemindaian mobile
                </li>
                <li>
                  • <strong>Instagram:</strong> Salin tautan untuk berbagi di bio atau story
                </li>
                <li>
                  • <strong>Berbagi QR:</strong> Bagikan gambar kode QR dengan info tautan di berbagai platform
                </li>
              </ul>
            </div>
          </div>

          {/* Success Message */}
          {copied && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Konten disalin ke clipboard!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            Bagikan tautan atau kode QR ini untuk membantu kandidat dengan mudah mengakses form rekrutmen
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;