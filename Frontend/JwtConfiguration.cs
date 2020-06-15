using System.Text;

namespace Kwetterprise.Frontend
{
    public class JwtConfiguration
    {
        public JwtConfiguration(string issuer, string key)
        {
            this.Issuer = issuer;
            this.Key = Encoding.UTF8.GetBytes(key);
        }

        public string Issuer { get; }

        public byte[] Key { get; }
    }
}