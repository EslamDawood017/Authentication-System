using LOGIN_APP.Models;
using Microsoft.AspNetCore.Identity;

namespace LOGIN_APP.Repositories
{
    public interface IUserRepository
    {
        Task<ApplicationUser?> GetByUsernameAsync(string username);
        Task<ApplicationUser?> GetByEmailAsync(string email);
        Task<IdentityResult> CreateUserAsync(ApplicationUser user, string password);
        Task<bool> CheckPasswordAsync(ApplicationUser user, string password);
        Task<string?> GeneratePasswordResetTokenAsync(ApplicationUser user);
    }
}
