
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { validateMedicalImage, type ValidationResult } from '../utils/imageValidator';
import { useAuth } from '../context/AuthContext';
import type { Analysis } from '../utils/userDataManager';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from '../context/ToastContext';
import { uploadService } from '../api/uploadService';
import { analysisService } from '../api/analysisService';

interface UploadCardProps {
  className?: string;
  onAnalysisComplete?: (analysis: Analysis) => void;
}


const UploadCard: React.FC<UploadCardProps> = ({ className = '', onAnalysisComplete }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidationWarning, setShowValidationWarning] = useState(false);
  const [overrideValidation, setOverrideValidation] = useState(false);
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_FORMATS = ['.dcm', '.dicom', '.jpg', '.jpeg', '.png', '.tiff', '.tif'];


  const validateFile = useCallback(async (file: File) => {
    setIsValidating(true);
    setError(null);
    setValidationResult(null);

    try {
      const result = await validateMedicalImage(file);
      setValidationResult(result);

      if (!result.isValid && result.requiresConfirmation) {
        // Show warning modal and allow user to override
        setSelectedFile(file);
        setShowValidationWarning(true);
        setOverrideValidation(false);
      } else if (!result.isValid) {
        // Direct rejection without confirmation modal
        setSelectedFile(file);
        setError(result.message);
      } else {
        setSelectedFile(file);
        // log detected type
        if (result.detectedType) {
          addToast(`${result.detectedType} detected (${result.confidence}%)`, 'info', 3000);
        }
      }
    } catch (err) {
      setError('Error validating image. Please try again.');
      setSelectedFile(null);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    validateFile(file);
  }, [validateFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleChooseFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClearFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);


  const handleAnalyze = useCallback(async () => {
    if (!selectedFile || !currentUser?.id || !validationResult) return;
    if (!validationResult.isValid && !overrideValidation) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Upload the image to the backend
      const uploadResponse = await uploadService.uploadImage(selectedFile, currentUser.id);

      // DEBUG: Log full response for production debugging
      console.log('[UploadCard] Upload response:', JSON.stringify(uploadResponse, null, 2));

      // Validate upload response structure
      if (!uploadResponse) {
        throw new Error('No response received from server');
      }

      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message || 'Upload failed');
      }

      // CRITICAL FIX: Add null checks for image property (response structure: { success, image, message })
      if (!uploadResponse.image) {
        console.error('[UploadCard] Missing image in upload response:', uploadResponse);
        throw new Error('Invalid response: missing image');
      }

      if (!uploadResponse.image.id) {
        console.error('[UploadCard] Missing image ID in upload response:', uploadResponse);
        throw new Error('Invalid response: missing image ID');
      }

      const imageId = uploadResponse.image.id;
      console.log('[UploadCard] Upload successful, imageId:', imageId);

      // Poll for analysis completion
      let analysisResult = null;
      let attempts = 0;
      const maxAttempts = 60; // 60 seconds max

      while (attempts < maxAttempts) {
        try {
          const response = await analysisService.getAnalysisResult(imageId);

          // DEBUG: Log polling response
          console.log(`[UploadCard] Poll attempt ${attempts + 1}:`, JSON.stringify(response, null, 2));

          // The API returns { success: true, analysis: {...} }
          // getAnalysisResult() now returns the analysis object directly
          analysisResult = response;

          if (!analysisResult) {
            console.warn(`[UploadCard] No analysis result yet, attempt ${attempts + 1}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
            continue;
          }

          if (analysisResult.status === 'completed') {
            console.log('[UploadCard] Analysis completed:', analysisResult.id);
            break;
          } else if (analysisResult.status === 'failed') {
            console.error('[UploadCard] Analysis failed:', analysisResult.error);
            throw new Error(analysisResult.error || 'Analysis failed');
          }

          // Wait 1 second before next attempt
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
        } catch (pollError) {
          // If it's a 404, the analysis might not be ready yet
          if (pollError instanceof Error && pollError.message.includes('404')) {
            console.warn(`[UploadCard] 404 on attempt ${attempts + 1}, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
            continue;
          }
          console.error('[UploadCard] Polling error:', pollError);
          throw pollError;
        }
      }

      if (!analysisResult || analysisResult.status !== 'completed') {
        throw new Error('Analysis timed out or failed');
      }

      // Reset form
      setSelectedFile(null);
      setValidationResult(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Navigate to results page with the analysis ID
      navigate(`/results/${encodeURIComponent(analysisResult.id)}`);

    } catch (err) {
      console.error('[UploadCard] Error during analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze file.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile, currentUser?.id, validationResult, navigate]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFilePreview = () => {
    if (!selectedFile) return null;

    const isImage = selectedFile.type.startsWith('image/') || 
                   /\.(jpg|jpeg|png|tiff|tif)$/i.test(selectedFile.name);
    
    if (isImage) {
      return (
        <div className="mt-4 flex justify-center">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="File preview"
            className="max-h-48 max-w-full rounded-lg object-contain"
            onLoad={(e) => {
              // Clean up object URL after image loads
              const img = e.currentTarget;
              setTimeout(() => URL.revokeObjectURL(img.src), 100);
            }}
          />
        </div>
      );
    }

    return (
      <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-gray-50 p-4">
        <svg
          className="h-8 w-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div className="text-left">
          <p className="font-semibold text-gray-900">{selectedFile.name}</p>
          <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* File Upload Section */}
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleChooseFileClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleChooseFileClick();
          }
        }}
        className={`
          relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 sm:p-12 transition-all duration-300
          ${isDragging 
            ? 'border-primary bg-primary-50 scale-[1.02]' 
            : 'border-[#E0E0E0] bg-gray-50 hover:border-primary hover:bg-white'
          }
          ${selectedFile ? 'cursor-default' : 'cursor-pointer'}
          shadow-sm
        `}
        aria-label="File upload area"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".dcm,.dicom,.jpg,.jpeg,.png,.tiff,.tif"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="File input"
        />

        {/* Cloud Upload Icon */}
        <svg
          className="mb-6 h-16 w-16 sm:h-20 sm:w-20 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        {/* Upload Text */}
        <p className="mb-2 text-lg sm:text-xl font-semibold text-[#333333] text-center">
          Drag and drop your file here
        </p>
        <p className="mb-6 text-sm sm:text-base text-[#666666] text-center">
          or click to browse from your computer
        </p>

        {/* Choose File Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleChooseFileClick();
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white font-semibold shadow-md transition duration-300 ease-in-out hover:scale-[1.02] hover:bg-primary-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
          aria-label="Choose file"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <span>Choose File</span>
        </button>

        {/* File Info Sections - Responsive Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {/* Supported Formats */}
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-sm">
            <svg
              className="h-5 w-5 text-blue-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-sm font-medium text-[#333333]">
              <span className="text-gray-500">Formats:</span>{' '}
              <span className="text-gray-900">DICOM (.dcm), JPEG, PNG, TIFF</span>
            </span>
          </div>

          {/* Maximum File Size */}
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-sm">
            <svg
              className="h-5 w-5 text-blue-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
            <span className="text-sm font-medium text-[#333333]">
              <span className="text-gray-500">Max:</span>{' '}
              <span className="text-gray-900">50MB (500MB for DICOM)</span>
            </span>
          </div>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="mt-6 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {isValidating && (
                  <div className="flex-shrink-0 animate-spin">
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                )}
                {!isValidating && (
                  <svg
                    className="h-8 w-8 flex-shrink-0 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#333333]" title={selectedFile.name}>
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-[#666666]">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearFile}
                className="flex-shrink-0 rounded-lg bg-danger-50 px-3 py-2 text-sm font-semibold text-danger transition duration-300 ease-in-out hover:scale-[1.02] hover:bg-danger-100 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 w-full sm:w-auto"
                aria-label="Clear file"
              >
                Clear
              </button>
            </div>

            {/* Validation Status */}
            {isValidating && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <svg className="h-5 w-5 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium text-blue-700">Validating image...</span>
              </div>
            )}

            {validationResult && !isValidating && (
              <div
                className={`mt-4 rounded-lg p-3 flex items-start gap-3 ${
                  validationResult.isValid
                    ? 'bg-success-50 border border-success-200'
                    : 'bg-danger-50 border border-danger-200'
                }`}
              >
                <svg
                  className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                    validationResult.isValid ? 'text-success-600' : 'text-danger-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {validationResult.isValid ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      validationResult.isValid ? 'text-success-900' : 'text-danger-900'
                    }`}
                  >
                    {validationResult.message}
                  </p>

                  {validationResult.detectedType && (
                    <p className={`text-xs mt-1 ${
                      validationResult.isValid ? 'text-success-700' : 'text-danger-700'
                    }`}>
                      Type: <span className="font-semibold">{validationResult.detectedType}</span>
                      {validationResult.confidence && (
                        <span> • Confidence: <span className="font-semibold">{validationResult.confidence}%</span></span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* File Preview */}
        {selectedFile && getFilePreview()}

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {/* Validation Warning Modal */}
        <ConfirmationModal
          isOpen={showValidationWarning}
          title="This doesn't look like a medical image"
          message={validationResult?.message || "The selected file may not be a medical image. Are you sure you want to continue?"}
          isDangerous
          confirmText="Continue Anyway"
          cancelText="Cancel"
          loading={isValidating}
          onCancel={() => {
            setShowValidationWarning(false);
            setSelectedFile(null);
            setValidationResult(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          onConfirm={() => {
            setOverrideValidation(true);
            setShowValidationWarning(false);
            addToast('Continuing with non-standard image', 'warning');
          }}
        />
      </div>

      {/* Analyze Image Button - Responsive */}
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!selectedFile || isAnalyzing || isValidating || (!validationResult?.isValid && !overrideValidation)}
        className={`
          mt-6 sm:mt-8 flex w-full items-center justify-center gap-3 rounded-lg px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition duration-300 ease-in-out shadow-md
          ${selectedFile && !isAnalyzing && !isValidating && (validationResult?.isValid || overrideValidation)
            ? 'bg-primary text-white hover:scale-[1.02] hover:bg-primary-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95'
            : 'cursor-not-allowed bg-gray-300 text-gray-500 shadow-none'
          }
        `}
        aria-label="Analyze image"
        aria-disabled={!selectedFile || isAnalyzing || isValidating || (!validationResult?.isValid && !overrideValidation)}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span className="hidden sm:inline">{isValidating ? 'Validating...' : isAnalyzing ? 'Analyzing...' : 'Analyze Image'}</span>
        <span className="sm:hidden">{isValidating ? 'Validating...' : isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
      </button>
    </div>
  );
};

export default UploadCard;
