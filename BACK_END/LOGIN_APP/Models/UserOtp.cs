using System.ComponentModel.DataAnnotations.Schema;

namespace LOGIN_APP.Models
{
    public class UserOtp
    {
        public int Id { get; set; }
        [ForeignKey("user")]
        public string UserId { get; set; } = null!;
        public string OtpHash { get; set; } = null!;
        public DateTime ExpiryTime { get; set; }
        public bool IsUsed { get; set; }
        public string Purpose { get; set; } = "ForgotPassword";

        public string? ResetTokenHash { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }


        public ApplicationUser user { get; set; }
    }

}
