using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Kwetterprise.Frontend.Common;
using Kwetterprise.Frontend.Data;
using Kwetterprise.Frontend.Data.Tweet;
using Kwetterprise.Frontend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Option = Kwetterprise.Frontend.Common.Option;
using TweetClient = Kwetterprise.Frontend.Data.Tweet.Client;

namespace Kwetterprise.Frontend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TweetController : ControllerBase
    {
        private readonly Externals externals;

        public TweetController(Externals externals)
        {
            this.externals = externals;
        }

        [HttpPost]
        public async Task<Option<TweetDto>> Post(PostTweetRequest postTweetRequest)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                JwtBearerDefaults.AuthenticationScheme,
                this.HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", ""));
            var tweetClient = new TweetClient(externals.Tweet, client);

            try
            {
                return (await tweetClient.TweetcommandPostAsync(postTweetRequest)).DeserializeOption();
            }
            catch (Exception e)
            {
                return Option<TweetDto>.FromError(e.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetFromUser")]
        public async Task<Option<TimedData<TweetDto>>> GetFromUser(Guid id, Guid? from, bool ascending, int count)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                JwtBearerDefaults.AuthenticationScheme,
                this.HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", ""));
            var tweetClient = new TweetClient(externals.Tweet, client);

            try
            {
                return (await tweetClient.TweetqueryGetfromuserAsync(id, from, ascending, count)).DeserializeOption();
            }
            catch (Exception e)
            {
                return Option<TimedData<TweetDto>>.FromError(e.Message);
            }
        }
    }
}
