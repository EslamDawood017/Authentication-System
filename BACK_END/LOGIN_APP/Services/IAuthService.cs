using LOGIN_APP.DTOs;
using LOGIN_APP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LOGIN_APP.Repositories
{
    public interface IAuthService
    {
        Task<RegisterResponse> RegisterAsync(RegisterRequest request);
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<bool> ForgotPasswordAsync(string  mail);
        Task<VerifyOtpResponse> VerifyOtpAsync(string email, string otp);
        Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request);
        Task<AuthResponse> RefreshTokenAsync(string refreshToken);


    }
}
