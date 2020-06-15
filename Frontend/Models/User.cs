using System;
using Kwetterprise.Frontend.Data.Account;

namespace Kwetterprise.Frontend.Models
{
    public class UserResponse
    {
        public Guid Id { get; set; }

        public string Username { get; set; } = null!;

        public string Bio { get; set; } = null!;

        public AccountRole Role { get; set; }
    }

    public class UserWithTokenResponse : UserResponse
    {
        public string? Token { get; set; }
    }
}
