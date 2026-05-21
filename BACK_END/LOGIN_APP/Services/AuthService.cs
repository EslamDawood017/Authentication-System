using LOGIN_APP.Data;
using LOGIN_APP.DTOs;
using LOGIN_APP.Models;
using LOGIN_APP.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace LOGIN_APP.Repositories
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userRepository;

        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IOtpRepository _otpRepository;
        private readonly ApplicationDbContext _context;


        public AuthService(UserManager<ApplicationUser> userRepository, IConfiguration configuration,
            IEmailService emailService,
            IOtpRepository otpRepository,
            ApplicationDbContext context)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _emailService = emailService;
            _otpRepository = otpRepository;
            _context = context;
        }
        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Check if username or email already exists
                if (await _userRepository.FindByNameAsync(request.Username) != null)
                {
                    return new RegisterResponse { Success = false, Errors = new[] { "Username already exists" } };
                }

                if (await _userRepository.FindByEmailAsync(request.Email) != null)
                {
                    return new RegisterResponse { Success = false, Errors = new[] { "Email already exists" } };
                }

                var user = new ApplicationUser
                {
                    UserName = request.Username,
                    Email = request.Email
                };

                var result = await _userRepository.CreateAsync(user, request.Password);

                if (result.Succeeded)
                {
                    return new RegisterResponse { Success = true };
                }

                return new RegisterResponse
                {
                    Success = false,
                    Errors = result.Errors.Select(e => e.Description)
                };
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.FindByNameAsync(request.Username);
            if (user == null)
                return new LoginResponse { Success = false, Errors = new[] { "Invalid username or password" } };

            if (!await _userRepository.CheckPasswordAsync(user, request.Password))
                return new LoginResponse { Success = false, Errors = new[] { "Invalid username or password" } };

            // Generate JWT
            var accessToken = GenerateJwtToken(user);

            var refreshToken = new RefreshToken
            {
                ExpiresAt = DateTime.Now.AddDays(7),
                IsRevoked = false,
                Token = GenerateRefreshToken(),
                UserId = user.Id,
            };

            _context.RefreshTokens.Add(refreshToken);
            _context.SaveChanges();


            return new LoginResponse
            {
                Success = true,
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token
            };

        }
        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var user = await _userRepository.FindByEmailAsync(email);

            // Security: do not reveal user existence
            if (user == null)
                return true;

            var otp = Helper.GenerateOtp();
            var otpHash = BCrypt.Net.BCrypt.HashPassword(otp);


            var userOtp = new UserOtp
            {
                UserId = user.Id,
                OtpHash = otpHash,
                ExpiryTime = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false
            };

            await _otpRepository.AddAsync(userOtp);
            await _otpRepository.SaveChangesAsync();


            await _emailService.SendAsync(
                email,
                "Password Reset Code",
                $"Your OTP code is : " +
                $"{otp}" +
                $" It expires in 5 minutes."
            );

            return true;
        }
        public async Task<VerifyOtpResponse?> VerifyOtpAsync(string email, string otp)
        {
            var user = await _userRepository.FindByEmailAsync(email);

            if (user == null) return null;

            var otps = _context.UserOtps
                .Where(x => x.UserId == user.Id && !x.IsUsed)
                .ToList();

            var validOtp = otps.FirstOrDefault(x =>
                BCrypt.Net.BCrypt.Verify(otp, x.OtpHash) &&
                x.ExpiryTime > DateTime.UtcNow);

            if (validOtp == null)
                return null;

            // Generate reset token
            var resetToken = Convert.ToBase64String(
                RandomNumberGenerator.GetBytes(32));

            validOtp.ResetTokenHash = BCrypt.Net.BCrypt.HashPassword(resetToken);
            validOtp.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(10);

            await _context.SaveChangesAsync();

            return new VerifyOtpResponse
            {
                ResetToken = resetToken
            };
        }
        public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmPassword)
                return new ResetPasswordResponse { error = "Password not matched", success = false };

            var user = await _userRepository.FindByEmailAsync(request.Email);

            if (user == null)
                return new ResetPasswordResponse { error = "this email is not exist", success = false };

            var otpRecord = _context.UserOtps
                .Where(x =>
                    x.UserId == user.Id &&
                    !x.IsUsed &&
                    x.ResetTokenExpiry > DateTime.UtcNow)
                .OrderByDescending(x => x.ExpiryTime)
                .FirstOrDefault();

            if (otpRecord == null ||
                !BCrypt.Net.BCrypt.Verify(
                    request.ResetToken,
                    otpRecord.ResetTokenHash))
                return new ResetPasswordResponse { error = "invalid OTP", success = false };

            var identityResetToken =
                await _userRepository.GeneratePasswordResetTokenAsync(user);

            var result = await _userRepository.ResetPasswordAsync(
                user,
                identityResetToken,
                request.NewPassword);

            if (!result.Succeeded)
                return new ResetPasswordResponse { error = result.Errors.ToList()[0].Description, success = false }; ;

            otpRecord.IsUsed = true;
            await _context.SaveChangesAsync();

            return new ResetPasswordResponse { error = "password changed successfuly", success = true }; ;
        }
        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }
        public async Task<AuthResponse?> RefreshTokenAsync(string refreshToken)
        {
            var storedToken = await _context.RefreshTokens
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Token == refreshToken);

            if (storedToken == null ||
                storedToken.IsRevoked ||
                storedToken.ExpiresAt < DateTime.UtcNow)
            {
                return null;
            }

            var user = storedToken.User;

            // Revoke old token
            storedToken.IsRevoked = true;

            // Create new refresh token
            var newRefreshToken = new RefreshToken
            {
                Token = GenerateRefreshToken(),
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };

            _context.RefreshTokens.Add(newRefreshToken);
            await _context.SaveChangesAsync();

            var newJwt = GenerateJwtToken(user);

            return new AuthResponse
            {
                AccessToken = newJwt,
                refreshToken = newRefreshToken.Token
            };
        }
        public string GenerateJwtToken(ApplicationUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:ExpiryMinutes"])),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var accessToken = tokenHandler.WriteToken(token);

            return accessToken;
        }

    }


}
