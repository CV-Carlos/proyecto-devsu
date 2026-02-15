export interface ApiResponse<T> {
  message?: string;
  data?: T;
}

export interface ApiError {
  name: string;
  message: string;
  errors?: { [key: string]: string };
}

export interface DeleteResponse {
  message: string;
}

export interface VerificationResponse {
  exists: boolean;
}