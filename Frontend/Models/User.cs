using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Frontend.Models
{
    public class UserResponse
    {
        public Guid Id { get; set; }

        public string Username { get; set; } = null!;

        public string Bio { get; set; } = null;

        public string Token { get; set; } = null!;
    }

    public class RegisterResponse
    {
        public UserResponse? CreatedUser { get; set; }

        public string? Error { get; set; }
    }

    public class UserRequest
    {
        public Guid Id { get; set; }

        public string? Password { get; set; } = null!;

        public string Bio { get; set; } = null!;
    }
}
