namespace LOGIN_APP.DTOs
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}
