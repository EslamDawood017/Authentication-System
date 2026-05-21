using Microsoft.AspNetCore.Identity;

namespace LOGIN_APP.Models
{
    public class ApplicationUser  : IdentityUser
    {
        public string? Zip5 { get; set; }
    }
}
