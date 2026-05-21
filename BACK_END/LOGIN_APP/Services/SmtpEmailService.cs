using LOGIN_APP.Models;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace LOGIN_APP.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public SmtpEmailService(IOptions<EmailSettings> options)
        {
            _settings = options.Value;
        }
        public async Task SendAsync(string to, string subject, string body)
        {
            var message = new MailMessage
            {
                From = new MailAddress(_settings.From),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };

            message.To.Add(to);

            using var client = new SmtpClient(_settings.SmtpServer, _settings.Port)
            {
                Credentials = new NetworkCredential(_settings.Username, _settings.Password),
                EnableSsl = true,
                UseDefaultCredentials= false,
                DeliveryMethod = SmtpDeliveryMethod.Network
            };


            await client.SendMailAsync(message);
        }
    }
}
