namespace LOGIN_APP.Services
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string body);
    }
}
