namespace LOGIN_APP.DTOs
{
    public class RegisterResponse
    {
        public bool Success { get; set; }
        public IEnumerable<string>? Errors { get; set; }
    }
}
