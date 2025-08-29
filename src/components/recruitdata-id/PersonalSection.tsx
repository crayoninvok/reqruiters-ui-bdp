import React, { useState } from "react";
import { RecruitmentForm } from "@/types/types";
import { formatDate, calculateAge, getGeneration } from "@/utils/utils";
import { Info, X } from "lucide-react";

interface PersonalInfoSectionProps {
  recruitmentForm: RecruitmentForm;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  recruitmentForm,
}) => {
  const [showMaritalModal, setShowMaritalModal] = useState(false);

  // Marital status information mapping
  const maritalStatusInfo: Record<string, string> = {
    TK_0: "Tidak Kawin, Tidak ada tanggungan",
    TK_1: "Tidak Kawin, 1 tanggungan",
    TK_2: "Tidak Kawin, 2 tanggungan",
    TK_3: "Tidak Kawin, 3 tanggungan",
    K_0: "Kawin, Tidak ada tanggungan",
    K_1: "Kawin, 1 tanggungan",
    K_2: "Kawin, 2 tanggungan",
    K_3: "Kawin, 3 tanggungan",
    K_I_0: "Kawin dengan Istri, Tidak ada tanggungan",
    K_I_1: "Kawin dengan Istri, 1 tanggungan",
    K_I_2: "Kawin dengan Istri, 2 tanggungan",
    K_I_3: "Kawin dengan Istri, 3 tanggungan",
  };

  const formatMaritalStatus = (value: string) => {
    // Handle K_I_ pattern for marital status
    if (value.startsWith("K_I_")) {
      const number = value.replace("K_I_", "");
      return `K/I/${number}`;
    }

    // Original logic for other values but always return uppercase
    const formatted = value
      .replace(/_/g, "/")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return formatted.toUpperCase();
  };

  const getMaritalStatusExplanation = (status: string) => {
    return maritalStatusInfo[status] || status;
  };

  return (
    <>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6 print-section print-personal-info">
        <h2 className="text-lg font-semibold text-white mb-4 print-section-title">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-grid">
          <div>
            <label className="block text-sm font-medium text-gray-400 print-label mb-1">
              Full Name
            </label>
            <p className="text-white font-medium print-value">
              {recruitmentForm.fullName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 print-label mb-1">
              Birth Place & Date
            </label>
            <p className="text-white print-value">
              {recruitmentForm.birthPlace},{" "}
              {formatDate(recruitmentForm.birthDate)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 print-label mb-1">
              Age
            </label>
            <p className="text-white print-value">
              {calculateAge(recruitmentForm.birthDate)} years old
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 print-label mb-1">
              Generation
            </label>
            <p className="text-white print-value">
              {getGeneration(recruitmentForm.birthDate)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 print-label mb-1">
              Religion
            </label>
            <p className="text-white print-value">
              {recruitmentForm.religion.replace(/_/g, " ")}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 print-label mb-1">
              Gender
            </label>
            <p className="text-white print-value">
              {recruitmentForm.gender.replace(/_/g, " ")}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 print-label mb-1">
              Province
            </label>
            <p className="text-white print-value">
              {recruitmentForm.province.replace(/_/g, " ")}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 print-label mb-1">
              WhatsApp Number
            </label>
            <p className="text-white print-value">
              {recruitmentForm.whatsappNumber}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 print-label items-center mb-1">
              Martial Status
              <button
                type="button"
                onClick={() => setShowMaritalModal(true)}
                className="ml-2 p-1 text-blue-400 hover:text-blue-300 transition-colors rounded-full hover:bg-blue-900/20"
                title="Lihat penjelasan status pernikahan"
              >
                <Info className="h-4 w-4" />
              </button>
            </label>
            <p className="text-white print-value">
              {formatMaritalStatus(recruitmentForm.maritalStatus)}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 print-label mb-1">
              Address
            </label>
            <p className="text-white print-value">
              {recruitmentForm.address}
            </p>
          </div>
        </div>
      </div>

      {/* Marital Status Modal */}
      {showMaritalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/95 backdrop-blur-md border border-gray-700/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-400" />
                Penjelasan Kode Status Pernikahan (PTKP)
              </h3>
              <button
                onClick={() => setShowMaritalModal(false)}
                className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tidak Kawin (TK) */}
                <div className="bg-blue-900/30 backdrop-blur-sm p-4 rounded-lg border border-blue-400/20">
                  <h4 className="font-semibold text-blue-300 mb-3 text-center">
                    Tidak Kawin (TK)
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-400">
                        TK/0:
                      </span>
                      <span className="text-blue-300">
                        Tidak ada tanggungan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-400">
                        TK/1:
                      </span>
                      <span className="text-blue-300">
                        1 tanggungan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-400">
                        TK/2:
                      </span>
                      <span className="text-blue-300">
                        2 tanggungan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-400">
                        TK/3:
                      </span>
                      <span className="text-blue-300">
                        3 tanggungan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Kawin (K) */}
                <div className="bg-green-900/30 backdrop-blur-sm p-4 rounded-lg border border-green-400/20">
                  <h4 className="font-semibold text-green-300 mb-3 text-center">
                    Kawin (K)
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-green-400">
                        K/0:
                      </span>
                      <span className="text-green-300">
                        Tidak ada tanggungan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-green-400">
                        K/1:
                      </span>
                      <span className="text-green-300">
                        1 tanggungan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-green-400">
                        K/2:
                      </span>
                      <span className="text-green-300">
                        2 tanggungan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-green-400">
                        K/3:
                      </span>
                      <span className="text-green-300">
                        3 tanggungan
                      </span>
                    </div>
                  </div>
                </div>

                {/* Kawin dengan Istri (K/I) */}
                <div className="bg-purple-900/30 backdrop-blur-sm p-4 rounded-lg border border-purple-400/20 md:col-span-2 lg:col-span-1">
                  <h4 className="font-semibold text-purple-300 mb-3 text-center">
                    Kawin dengan Istri (K/I)
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-purple-400">
                        K/I/0:
                      </span>
                      <span className="text-purple-300">
                        Tidak ada tanggungan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-purple-400">
                        K/I/1:
                      </span>
                      <span className="text-purple-300">
                        1 tanggungan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-purple-400">
                        K/I/2:
                      </span>
                      <span className="text-purple-300">
                        2 tanggungan
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-purple-400">
                        K/I/3:
                      </span>
                      <span className="text-purple-300">
                        3 tanggungan
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status Highlight */}
              <div className="mt-6 p-4 bg-yellow-900/30 backdrop-blur-sm border border-yellow-400/20 rounded-lg">
                <h4 className="font-semibold text-yellow-300 mb-2">
                  Status Saat Ini:
                </h4>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium text-yellow-300">
                      {formatMaritalStatus(recruitmentForm.maritalStatus)}
                    </p>
                    <p className="text-sm text-yellow-400">
                      {getMaritalStatusExplanation(
                        recruitmentForm.maritalStatus
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-6 p-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-lg">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Catatan:</strong> Status ini digunakan untuk
                  perhitungan pajak penghasilan (PPh 21). Tanggungan adalah
                  anggota keluarga yang ditanggung secara finansial seperti anak
                  atau keluarga lain yang sah menurut hukum.
                </p>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-gray-700/50">
              <button
                onClick={() => setShowMaritalModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};