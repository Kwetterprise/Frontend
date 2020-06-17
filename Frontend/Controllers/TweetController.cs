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
    using System.Linq;

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
            var tweetClient = new TweetClient(this.externals.Tweet, client);

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
            var tweetClient = new TweetClient(this.externals.Tweet, client);

            try
            {
                return (await tweetClient.TweetqueryGetfromuserAsync(id, from, ascending, count)).DeserializeOption();
            }
            catch (Exception e)
            {
                return Option<TimedData<TweetDto>>.FromError(e.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetAll")]
        public async Task<Option<TimedData<TweetDto>>> GetAll(Guid? from, bool ascending, int count)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                JwtBearerDefaults.AuthenticationScheme,
                this.HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", ""));
            var tweetClient = new TweetClient(this.externals.Tweet, client);

            try
            {
                return Option<TimedData<TweetDto>>.FromResult(
                    (await tweetClient.TweetqueryGetallAsync(from, ascending, count)).DeserializeTimedData());
            }
            catch (Exception e)
            {
                return Option<TimedData<TweetDto>>.FromError(e.Message);
            }
        }

        [HttpDelete]
        public async Task<Option> Delete([FromQuery] Guid id)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                JwtBearerDefaults.AuthenticationScheme,
                this.HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", ""));
            var tweetClient = new TweetClient(this.externals.Tweet, client);

            var jwtGuid = this.HttpContext.User.Claims.Single(x => x.Type == "Id").Value.Replace("\"", string.Empty);
            var actor = Guid.Parse(jwtGuid);

            try
            {
                var res = await tweetClient.TweetcommandDeleteAsync(
                    new DeleteTweetRequest
                    {
                        Actor = actor,
                        Tweet = id,
                    });

                if (res.HasFailed)
                {
                    return Option.FromError(res.Error);
                }
                return Option.Success;
            }
            catch (Exception e)
            {
                return Option<TimedData<TweetDto>>.FromError(e.Message);
            }
        }
    }
}
