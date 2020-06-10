using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Frontend.Models
{
    public class RegisterRequest
    {
        public string Username { get; set; } = null!;

        public string Password { get; set; } = null!;
    }
}
