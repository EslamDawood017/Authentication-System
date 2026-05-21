using System.Security.Cryptography;

namespace LOGIN_APP
{
    public class Helper
    {
        public static string GenerateOtp()
        {
            return RandomNumberGenerator
                .GetInt32(100000, 999999)
                .ToString();
        }
    }
}
