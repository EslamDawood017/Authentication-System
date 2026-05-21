export interface LoginResponse {
  success: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  errors: string[] | null;
}