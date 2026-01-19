/**
 * Upload Service for MedAIx
 * Handles image upload operations
 */

import { apiClient } from './apiClient';

export interface UploadImageResponse {
  success: boolean;
  image: {
    id: string;
    fileName: string;
    originalFileName: string | null;
    fileSize: string | null | undefined;
    mimeType: string | null | undefined;
    imageType: string | null | undefined;
    analysisStatus: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export const uploadService = {
  async uploadImage(file: File, userId: string): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', userId);

    // Note: Do NOT set Content-Type header manually when using FormData
    // The browser automatically sets it with the correct multipart boundary
    return apiClient.post('/upload/image', formData);
  },
};

