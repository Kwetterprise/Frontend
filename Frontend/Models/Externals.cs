namespace Kwetterprise.Frontend.Models
{
    public class Externals
    {
        public Externals(string account, string tweet)
        {
            Account = account;
            Tweet = tweet;
        }

        public string Account { get; }

        public string Tweet { get; }
    }
}
