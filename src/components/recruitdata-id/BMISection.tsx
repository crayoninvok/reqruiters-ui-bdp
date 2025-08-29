import React from "react";
import { RecruitmentForm } from "@/types/types";

interface BMISectionProps {
  recruitmentForm: RecruitmentForm;
}

const calculateBMI = (heightCm: number, weightKg: number) => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

const getBMICategory = (bmi: number) => {
  if (bmi < 18.5)
    return {
      category: "Underweight",
      color: "text-blue-300 bg-blue-900/30 border-blue-400/20",
    };
  if (bmi < 25)
    return {
      category: "Normal",
      color: "text-green-300 bg-green-900/30 border-green-400/20",
    };
  if (bmi < 30)
    return {
      category: "Overweight",
      color: "text-yellow-300 bg-yellow-900/30 border-yellow-400/20",
    };
  return { 
    category: "Obese", 
    color: "text-red-300 bg-red-900/30 border-red-400/20" 
  };
};

const getBMIStatus = (bmi: number) => {
  if (bmi < 18.5) return "Below normal weight";
  if (bmi < 25) return "Healthy weight range";
  if (bmi < 30) return "Above normal weight";
  return "Significantly above normal weight";
};

export const BMISection: React.FC<BMISectionProps> = ({ recruitmentForm }) => {
  const bmi = calculateBMI(recruitmentForm.heightCm, recruitmentForm.weightKg);
  const bmiInfo = getBMICategory(bmi);
  const bmiStatus = getBMIStatus(bmi);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl p-6 print-section">
      <h2 className="text-lg font-semibold text-white mb-4 print-section-title flex items-center">
        <span className="mr-2">⚖️</span>
        Body Mass Index (BMI)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print-grid-3">
        {/* BMI Value */}
        <div className="text-center p-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-lg">
          <div className="text-3xl font-bold text-white mb-1">
            {bmi}
          </div>
          <div className="text-sm text-gray-400">
            BMI Value
          </div>
        </div>

        {/* BMI Category */}
        <div className="text-center p-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-lg">
          <div
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${bmiInfo.color}`}
          >
            {bmiInfo.category}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Category
          </div>
        </div>

        {/* BMI Status */}
        <div className="text-center p-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-lg">
          <div className="text-sm text-white font-medium">
            {bmiStatus}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Health Status
          </div>
        </div>
      </div>

      {/* BMI Reference Chart */}
      <div className="mt-6 p-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-lg">
        <h3 className="text-sm font-semibold text-white mb-3">
          BMI Reference Chart
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-gray-300">
              &lt; 18.5 Underweight
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-gray-300">
              18.5-24.9 Normal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-gray-300">
              25.0-29.9 Overweight
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-gray-300">
              ≥ 30.0 Obese
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};