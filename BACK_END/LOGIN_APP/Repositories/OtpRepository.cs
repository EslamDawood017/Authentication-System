using LOGIN_APP.Data;
using LOGIN_APP.Models;
using Microsoft.EntityFrameworkCore;

namespace LOGIN_APP.Repositories
{
    public class OtpRepository : IOtpRepository
    {
        private readonly ApplicationDbContext _context;

        public OtpRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(UserOtp otp)
        {
            await _context.UserOtps.AddAsync(otp);
        }

        public async Task<UserOtp?> GetValidOtpAsync(string userId, string otpHash)
        {
            return await _context.UserOtps
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.OtpHash == otpHash &&
                !x.IsUsed &&
                x.ExpiryTime > DateTime.UtcNow);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
