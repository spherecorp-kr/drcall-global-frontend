import { apiClient } from './api';

/**
 * Storage Service
 * 파일 업로드/다운로드 관련 API 호출
 */

export interface UploadFileRequest {
  file: File;
  category: 'APPOINTMENT_SYMPTOM_IMAGE' | 'PRESCRIPTION_IMAGE' | 'PATIENT_ID_CARD' | 'PATIENT_PROFILE_IMAGE';
  entityType?: string;
  entityId?: number;
}

export interface FileMetadata {
  id: number;
  externalId: string;
  originalFilename: string;
  storedFilename: string;
  mimeType: string;
  fileSize: number;
  category: string;
  entityType?: string;
  entityId?: number;
  userId: number;
  s3Key?: string;
  s3Url?: string;
  localPath?: string;
  uploadedAt: string;
  createdAt: string;
}

export const storageService = {
  /**
   * 파일 업로드
   * @param request 업로드 요청 (파일, 카테고리 등)
   * @returns 업로드된 파일 메타데이터
   */
  uploadFile: async (request: UploadFileRequest): Promise<FileMetadata> => {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('category', request.category);

    if (request.entityType) {
      formData.append('entityType', request.entityType);
    }

    if (request.entityId) {
      formData.append('entityId', request.entityId.toString());
    }

    const response = await apiClient.post<FileMetadata>('/api/v1/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * 파일 메타데이터 조회
   * @param fileId 파일 ID
   * @returns 파일 메타데이터
   */
  getFileMetadata: async (fileId: number): Promise<FileMetadata> => {
    const response = await apiClient.get<FileMetadata>(`/api/v1/storage/${fileId}`);
    return response.data;
  },

  /**
   * 파일 다운로드 URL 조회
   * @param fileId 파일 ID
   * @returns 다운로드 URL
   */
  getDownloadUrl: (fileId: number): string => {
    return `${import.meta.env.VITE_API_BASE_URL}/api/v1/storage/download/${fileId}`;
  },

  /**
   * 엔티티별 파일 목록 조회
   * @param entityType 엔티티 타입 (APPOINTMENT, PATIENT 등)
   * @param entityId 엔티티 ID
   * @returns 파일 메타데이터 목록
   */
  getFilesByEntity: async (entityType: string, entityId: number): Promise<FileMetadata[]> => {
    const response = await apiClient.get<FileMetadata[]>(
      `/api/v1/storage/entity/${entityType}/${entityId}`
    );
    return response.data;
  },

  /**
   * 파일 삭제
   * @param fileId 파일 ID
   */
  deleteFile: async (fileId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/storage/${fileId}`);
  },
};
