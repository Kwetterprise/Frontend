using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Kwetterprise.Frontend.Common;
using Kwetterprise.Frontend.Data;
using Kwetterprise.Frontend.Data.Account;
using Kwetterprise.Frontend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using AccountClient = Kwetterprise.Frontend.Data.Account.Client;

namespace Kwetterprise.Frontend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly Externals externals;

        public AccountController(Externals externals)
        {
            this.externals = externals;
        }

        [AllowAnonymous]
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
            catch (Exception e)
            {
                return Option<UserWithTokenResponse>.FromError(e.Message);
            }

            return response.Select(x => new UserWithTokenResponse
            {
                Id = x.Id,
                Bio = x.Bio,
                Username = x.Username,
                Role = x.Role,
                Token = x.Token,
            });
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<Option<UserResponse>> GetById(Guid id)
        {
            using var client = new HttpClient();
            var accountClient = new AccountClient(externals.Account, client);

            Option<AccountDto> response;
            try
            {
                response = (await accountClient.AccountqueryAsync(id)).DeserializeOption();
            }
            catch (Exception e)
            {
                return Option<UserResponse>.FromError(e.Message);
            }

            return response.Select(x => new UserResponse
            {
                Id = x.Id,
                Bio = x.Bio,
                Username = x.Username,
                Role = x.Role,
            });
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<Option<PagedData<UserResponse>>> GetAll([FromQuery] int pageSize, [FromQuery] int pageNumber, [FromQuery] string? usernameFilter)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                JwtBearerDefaults.AuthenticationScheme,
                this.HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", ""));
            var accountClient = new AccountClient(externals.Account, client);

            PagedData<AccountDto> response;
            try
            {
                response = (await accountClient.AccountqueryAllAsync(usernameFilter, pageSize, pageNumber)).DeserializePagedData();
            }
            catch (Exception e)
            {
                return Option<PagedData<UserResponse>>.FromError(e.Message);
            }

            return response.Select(x => new UserResponse
            {
                Id = x.Id,
                Bio = x.Bio,
                Username = x.Username,
                Role = x.Role,
            });
        }

        [HttpDelete]
        public void Delete(Guid id)
        {
        }
    }
}
