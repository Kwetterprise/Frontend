using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : ControllerBase
    {
        [HttpPost]
        [Route("Authenticate")]
        public UserResponse? Authenticate(AuthenticateRequest request)
        {
            if (request.UserName != request.Password)
            {
                return null;
            }

            return new UserResponse
            {
                Id = Guid.NewGuid(),
                Token = "ABCDEF=",
                Username = request.UserName,
                Bio = "I like to post tweets.",
            };
        }
    }
}
