using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Frontend.Models
{
    public class AuthenticateRequest
    {
        public string UserName { get; set; } = null!;

        public string Password { get; set; } = null!;
    }
}
