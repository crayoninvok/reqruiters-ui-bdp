"use client";
import React, { useState, useEffect } from 'react';
import { PublicRecruitmentService, PublicRecruitmentFormData } from '@/services/public-recruitment.service';
import { Upload, User, MapPin, Phone, GraduationCap, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface FormOptions {
  provinces: string[];
  shirtSizes: string[];
  safetyShoeSizes: string[];
  pantsSizes: string[];
  certificates: string[];
  educationLevels: string[];
  maritalStatuses: string[];
  positions: string[];
  experienceLevels: string[];
}

interface FormFiles {
  documentPhoto?: File;
  documentCv?: File;
  documentKtp?: File;
  documentSkck?: File;
  documentVaccine?: File;
  supportingDocs?: File;
}

const PublicRecruitmentPage: React.FC = () => {
  const [formData, setFormData] = useState<PublicRecruitmentFormData>({
    fullName: '',
    birthPlace: '',
    birthDate: '',
    province: '',
    heightCm: 0,
    weightKg: 0,
    shirtSize: '',
    safetyShoesSize: '',
    pantsSize: '',
    address: '',
    whatsappNumber: '',
    certificate: [],
    education: '',
    schoolName: '',
    workExperience: '',
    maritalStatus: '',
    appliedPosition: '',
    experienceLevel: ''
  });

  const [files, setFiles] = useState<FormFiles>({});
  const [options, setOptions] = useState<FormOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    applicationId?: string;
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  // Load form options on component mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await PublicRecruitmentService.getFormOptions();
        setOptions(response.options);
      } catch (error) {
        console.error('Failed to load form options:', error);
      }
    };

    loadOptions();
  }, []);

  const handleInputChange = (field: keyof PublicRecruitmentFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleFileChange = (field: keyof FormFiles, file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [field]: file || undefined
    }));
  };

  const handleCertificateChange = (certificate: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      certificate: checked 
        ? [...(prev.certificate || []), certificate]
        : (prev.certificate || []).filter(c => c !== certificate)
    }));
  };

  const validateAndSubmit = async () => {
    // Validate form data
    const formErrors = PublicRecruitmentService.validateFormData(formData);
    const fileErrors = PublicRecruitmentService.validateFileUploads(files);
    
    const allErrors = [...formErrors, ...fileErrors];
    
    if (allErrors.length > 0) {
      setErrors(allErrors);
      setCurrentStep(1); // Go back to first step to show errors
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const formDataToSubmit = PublicRecruitmentService.createFormData(formData, files);
      
      const response = await PublicRecruitmentService.submitRecruitmentForm(
        formDataToSubmit,
        (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      );

      setSubmissionResult({
        success: true,
        message: response.message,
        applicationId: response.applicationId
      });
      setIsSubmitted(true);
    } catch (error: any) {
      const errorMessage = PublicRecruitmentService.formatErrorMessage(error);
      setSubmissionResult({
        success: false,
        message: errorMessage
      });
      setErrors([errorMessage]);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const formatEnumValue = (value: string) => {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      birthPlace: '',
      birthDate: '',
      province: '',
      heightCm: 0,
      weightKg: 0,
      shirtSize: '',
      safetyShoesSize: '',
      pantsSize: '',
      address: '',
      whatsappNumber: '',
      certificate: [],
      education: '',
      schoolName: '',
      workExperience: '',
      maritalStatus: '',
      appliedPosition: '',
      experienceLevel: ''
    });
    setFiles({});
    setIsSubmitted(false);
    setSubmissionResult(null);
    setErrors([]);
    setCurrentStep(1);
  };

  if (!options) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted && submissionResult?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">{submissionResult.message}</p>
          {submissionResult.applicationId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your Application ID:</p>
              <p className="text-lg font-mono font-bold text-blue-600">{submissionResult.applicationId}</p>
              <p className="text-xs text-gray-500 mt-2">Save this ID to check your application status</p>
            </div>
          )}
          <button
            onClick={resetForm}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600">Submit your application and take the next step in your career</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && <div className={`w-16 h-0.5 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h3>
                <ul className="text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <User className="h-6 w-6 mr-2 text-blue-600" />
                Personal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Place *</label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your birth place"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date *</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Province *</label>
                  <select
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Province</option>
                    {options.provinces.map(province => (
                      <option key={province} value={province}>{formatEnumValue(province)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm) *</label>
                  <input
                    type="number"
                    value={formData.heightCm || ''}
                    onChange={(e) => handleInputChange('heightCm', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="170"
                    min="100"
                    max="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
                  <input
                    type="number"
                    value={formData.weightKg || ''}
                    onChange={(e) => handleInputChange('weightKg', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="70"
                    min="30"
                    max="200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    {options.maritalStatuses.map(status => (
                      <option key={status} value={status}>{formatEnumValue(status)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your complete address"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number *</label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+62812345678 or 08123456789"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <GraduationCap className="h-6 w-6 mr-2 text-blue-600" />
                Professional Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education Level *</label>
                  <select
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Education</option>
                    {options.educationLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School/University Name *</label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter institution name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Applied Position *</label>
                  <select
                    value={formData.appliedPosition}
                    onChange={(e) => handleInputChange('appliedPosition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Position</option>
                    {options.positions.map(position => (
                      <option key={position} value={position}>{formatEnumValue(position)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Experience</option>
                    {options.experienceLevels.map(level => (
                      <option key={level} value={level}>{formatEnumValue(level)}</option>
                    ))}
                  </select>
                </div>

                {/* Uniform Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shirt Size *</label>
                  <select
                    value={formData.shirtSize}
                    onChange={(e) => handleInputChange('shirtSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Size</option>
                    {options.shirtSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Safety Shoes Size *</label>
                  <select
                    value={formData.safetyShoesSize}
                    onChange={(e) => handleInputChange('safetyShoesSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Size</option>
                    {options.safetyShoeSizes.map(size => (
                      <option key={size} value={size}>{size.replace('SIZE_', '')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pants Size *</label>
                  <select
                    value={formData.pantsSize}
                    onChange={(e) => handleInputChange('pantsSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Size</option>
                    {options.pantsSizes.map(size => (
                      <option key={size} value={size}>{size.replace('SIZE_', '')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience (Optional)</label>
                <textarea
                  value={formData.workExperience}
                  onChange={(e) => handleInputChange('workExperience', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your relevant work experience"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Certificates (Optional)</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {options.certificates.map(cert => (
                    <label key={cert} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.certificate || []).includes(cert)}
                        onChange={(e) => handleCertificateChange(cert, e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{formatEnumValue(cert)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Document Upload
              </h2>

              <div className="space-y-6">
                {[
                  { key: 'documentPhoto', label: 'Profile Photo', required: false },
                  { key: 'documentCv', label: 'CV/Resume', required: false },
                  { key: 'documentKtp', label: 'KTP (ID Card)', required: false },
                  { key: 'documentSkck', label: 'SKCK (Police Record)', required: false },
                  { key: 'documentVaccine', label: 'Vaccine Certificate', required: false },
                  { key: 'supportingDocs', label: 'Supporting Documents', required: false }
                ].map(({ key, label, required }) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label} {required && '*'}
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(key as keyof FormFiles, e.target.files?.[0] || null)}
                        className="hidden"
                        id={key}
                      />
                      <label
                        htmlFor={key}
                        className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg border border-blue-200 transition-colors flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </label>
                      {files[key as keyof FormFiles] && (
                        <span className="text-sm text-gray-600 truncate">
                          {files[key as keyof FormFiles]?.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, JPG, PNG. Max size: 5MB
                    </p>
                  </div>
                ))}
              </div>

              {isLoading && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Loader className="animate-spin h-5 w-5 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <p className="text-blue-800 font-medium">Submitting your application...</p>
                      <div className="mt-2 bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-blue-600 text-sm mt-1">{uploadProgress}% complete</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            >
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={validateAndSubmit}
                disabled={isLoading}
                className="px-8 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicRecruitmentPage;