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
    public class AccountController : ControllerBase
    {
        [HttpPost]
        [Route("Register")]
        public RegisterResponse Register(RegisterRequest request)
        {
            if (request.Username == "test")
            {
                return new RegisterResponse
                {
                    Error = "Username is already taken.",
                };
            }

            return new RegisterResponse
            {
                CreatedUser =  new UserResponse
                {
                    Id = Guid.NewGuid(),
                    Username = request.Username,
                    Bio = string.Empty,
                    Token = "ABC",
                }
            };
        }

        [HttpDelete]
        public void Delete(Guid guid)
        {
        }
    }
}
