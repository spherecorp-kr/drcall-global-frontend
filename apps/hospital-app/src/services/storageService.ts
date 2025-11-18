/**
 * Storage Service API
 * 
 * Storage Service는 Private 서비스이므로 프론트엔드에서 직접 통신 불가
 * 다른 서비스(Hospital, Patient 등)를 통해 간접 접근
 * 
 * TODO: 실제로는 Hospital Service나 다른 서비스를 통해 프록시로 호출해야 함
 * 현재는 Storage Service API 엔드포인트를 직접 호출하는 것으로 구현
 */

import { apiClient } from './api';

export type FileCategory = 'PROFILE_IMAGE' | 'LOGO' | 'PRESCRIPTION' | 'SYMPTOM_IMAGE' | 'OTHER';
export type OwnerType = 'PATIENT' | 'DOCTOR' | 'HOSPITAL' | 'ADMIN';
export type AccessLevel = 'PUBLIC' | 'PRIVATE';

export interface PresignedUploadRequest {
  filename: string;
  contentType: string;
  contentLength: number;
  category: FileCategory;
  ownerId: number;
  ownerType: OwnerType;
  hospitalId?: number;
  accessLevel?: AccessLevel;
  relatedEntityType?: string;
  relatedEntityId?: number;
}

export interface PresignedUploadResponse {
  fileId: number;
  externalId: string;
  uploadUrl: string;
  method: 'PUT' | 'POST';
  filePath: string;
  formData?: Record<string, string>;
  expiresAt: string; // ISO 8601 format
  contentType: string;
}

export interface DownloadUrlResponse {
  fileId: number;
  externalId: string;
  downloadUrl: string;
  filename: string;
  contentType: string;
  fileSize: number;
  expiresAt: string; // ISO 8601 format
}

/**
 * Presigned URL 요청
 * Step 1: Presigned URL 요청
 */
export async function requestPresignedUpload(
  request: PresignedUploadRequest
): Promise<PresignedUploadResponse> {
  // TODO: 실제로는 Hospital Service를 통해 프록시로 호출
  // 예: POST /api/v1/hospitals/storage/presigned-upload
  const response = await apiClient.post<PresignedUploadResponse>(
    '/api/v2/storage/presigned-upload',
    request
  );
  return response.data;
}

/**
 * 파일 업로드 완료 알림
 * Step 3: 업로드 완료 알림
 */
export async function completeUpload(fileId: number): Promise<void> {
  // TODO: 실제로는 Hospital Service를 통해 프록시로 호출
  await apiClient.post(`/api/v2/storage/${fileId}/complete`);
}

/**
 * 다운로드 URL 조회
 */
export async function getDownloadUrl(fileId: number): Promise<DownloadUrlResponse> {
  // TODO: 실제로는 Hospital Service를 통해 프록시로 호출
  const response = await apiClient.get<DownloadUrlResponse>(
    `/api/v2/storage/${fileId}/download-url`
  );
  return response.data;
}

/**
 * 파일 업로드 전체 플로우
 * 1. Presigned URL 요청
 * 2. S3에 직접 업로드
 * 3. 업로드 완료 알림
 * 
 * @param file - 업로드할 파일 (File 또는 Blob)
 * @param request - Presigned URL 요청 정보
 * @returns File ID
 */
export async function uploadFile(
  file: File | Blob,
  request: Omit<PresignedUploadRequest, 'filename' | 'contentType' | 'contentLength'>
): Promise<number> {
  // Blob을 File로 변환 (필요한 경우)
  const fileObj = file instanceof File 
    ? file 
    : new File([file], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });

  // Step 1: Presigned URL 요청
  const presignedRequest: PresignedUploadRequest = {
    ...request,
    filename: fileObj.name,
    contentType: fileObj.type || 'application/octet-stream',
    contentLength: fileObj.size,
  };

  const presignedResponse = await requestPresignedUpload(presignedRequest);

  // Step 2: S3에 직접 업로드
  const uploadResponse = await fetch(presignedResponse.uploadUrl, {
    method: presignedResponse.method,
    body: fileObj,
    headers: {
      'Content-Type': presignedResponse.contentType,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`파일 업로드 실패: ${uploadResponse.statusText}`);
  }

  // Step 3: 업로드 완료 알림
  await completeUpload(presignedResponse.fileId);

  return presignedResponse.fileId;
}

