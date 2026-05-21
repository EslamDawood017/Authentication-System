using LOGIN_APP.Models;

namespace LOGIN_APP.Repositories
{
    public interface IOtpRepository
    {
        Task AddAsync(UserOtp otp);
        Task<UserOtp?> GetValidOtpAsync(string userId, string otpHash);
        Task SaveChangesAsync();
    }
}
