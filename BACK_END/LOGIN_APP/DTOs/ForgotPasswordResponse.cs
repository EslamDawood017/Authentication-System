namespace LOGIN_APP.DTOs
{
    public class ForgotPasswordResponse
    {
        public bool Success { get; set; }
        public string? ResetToken { get; set; } // for now (dev only)
        public IEnumerable<string>? Errors { get; set; }
    }
}
