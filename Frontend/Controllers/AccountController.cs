using System;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Kwetterprise.Frontend.Common;
using Kwetterprise.Frontend.Data;
using Kwetterprise.Frontend.Data.Account;
using Kwetterprise.Frontend.Models;
using Microsoft.AspNetCore.Mvc;

using AccountClient = Kwetterprise.Frontend.Data.Account.Client;

namespace Kwetterprise.Frontend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly Externals externals;

        public AccountController(Externals externals)
        {
            this.externals = externals;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<Option<UserWithTokenResponse>> Register(RegisterRequest request)
        {
            using var client = new HttpClient();
            var accountClient = new AccountClient(externals.Account, client);

            var createAccount = new CreateAccountRequest
            {
                Username = request.Username,
                EmailAddress = request.Email,
                Password = request.Password,
            };

            Option<AccountWithTokenDto> response;
            try
            {
                response = (await accountClient.AccountcommandCreateAsync(createAccount)).DeserializeOption();
            }
            catch
            {
                return Option<UserWithTokenResponse>.FromError("Could not connect to the account service.");
            }

            return response.Select(x => new UserWithTokenResponse
            {
                Id = x.Id,
                Bio = x.Bio,
                Username = x.Username,
                Token = x.Token,
            });
        }

        [HttpGet]
        [Route("GetById")]
        public async Task<Option<UserResponse>> GetById(Guid id)
        {
            using var client = new HttpClient();
            var accountClient = new AccountClient(externals.Account, client);

            Option<AccountDto> response;
            try
            {
                response = (await accountClient.AccountqueryAsync(id)).DeserializeOption();
            }
            catch
            {
                return Option<UserResponse>.FromError("Could not connect to the account service.");
            }

            return response.Select(x => new UserResponse
            {
                Id = x.Id,
                Bio = x.Bio,
                Username = x.Username,
            });
        }

        [HttpDelete]
        public void Delete(Guid id)
        {
        }
    }
}
