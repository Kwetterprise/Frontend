using System;

namespace Kwetterprise.Frontend.Models
{
    public class UserResponse
    {
        public Guid Id { get; set; }

        public string Username { get; set; } = null!;

        public string Bio { get; set; } = null!;
    }

    public class UserWithTokenResponse : UserResponse
    {

        public string? Token { get; set; }
    }
}
