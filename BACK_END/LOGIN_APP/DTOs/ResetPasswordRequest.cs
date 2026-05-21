namespace LOGIN_APP.DTOs
{
    public class ResetPasswordRequest
    {
        public string Email { get; set; } = null!;
        public string ResetToken { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
        public string ConfirmPassword { get; set; } = null!;
    }


}
