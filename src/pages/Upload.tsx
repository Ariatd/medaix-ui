import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import UploadCard from '../components/UploadCard';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import type { Analysis } from '../utils/userDataManager';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalysisComplete = (analysis: Analysis) => {
    setSuccessMessage('Analysis completed successfully! Redirecting to results...');
    
    setTimeout(() => {
      navigate(`/results/${encodeURIComponent(analysis.id)}`);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-4xl">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6">
              <SuccessAlert 
                message={successMessage} 
                onClose={() => setSuccessMessage(null)}
              />
            </div>
          )}
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6">
              <ErrorAlert 
                message={errorMessage} 
                onClose={() => setErrorMessage(null)}
              />
            </div>
          )}

          {/* Header - Responsive */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#333333]">
              Medical Image Analysis
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-[#666666] px-4">
              Upload your medical imaging files for AI-powered analysis
            </p>
          </div>

          {/* Upload Card - Responsive */}
          <div className="rounded-xl bg-white p-4 sm:p-6 lg:p-8 shadow-md transition duration-300 ease-in-out hover:shadow-lg">
            <UploadCard onAnalysisComplete={handleAnalysisComplete} />
          </div>

          {/* Important Notice - Responsive */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start gap-3 rounded-lg bg-warning-50 p-4 text-[#333333] shadow-sm" role="alert">
            <svg
              className="h-6 w-6 flex-shrink-0 text-warning self-start mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-[#333333]">
                <strong className="font-semibold">Important Notice:</strong> This tool is for research and educational purposes only. 
                Results are not a clinical diagnosis and should not be used as a substitute for professional medical advice.
              </p>
            </div>
          </div>

          {/* Additional Information - Responsive */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Supported Formats */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800">Supported Formats</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                DICOM, JPEG, PNG, TIFF files up to 50MB
              </p>
            </div>

            {/* Image Types */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800">Image Types</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                X-rays, MRI, CT scans, ultrasound images
              </p>
            </div>

            {/* Processing Time */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800">Processing Time</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Usually 30-60 seconds depending on file size
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload;
