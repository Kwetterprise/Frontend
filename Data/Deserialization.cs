using System.Linq;
using Kwetterprise.Frontend.Common;
using Kwetterprise.Frontend.Data.Account;
using Kwetterprise.Frontend.Data.Tweet;
using AccountDto = Kwetterprise.Frontend.Data.Account.AccountDto;

namespace Kwetterprise.Frontend.Data
{
    public static class Deserialization
    {
        public static Option<AccountWithTokenDto> DeserializeOption(this AccountWithTokenDtoOption source)
        {
            return source.HasFailed ? Option<AccountWithTokenDto>.FromError(source.Error) : Option<AccountWithTokenDto>.FromResult(source.Value);
        }

        public static Option<AccountDto> DeserializeOption(this AccountDtoOption source)
        {
            return source.HasFailed ? Option<AccountDto>.FromError(source.Error) : Option<AccountDto>.FromResult(source.Value);
        }

        public static PagedData<AccountDto> DeserializePagedData(this AccountDtoPagedData source)
        {
            return new PagedData<AccountDto>(source.PageSize, source.PageNumber, source.TotalCount, source.Data.ToList());
        }

        public static Option<TweetDto> DeserializeOption(this TweetDtoOption source)
        {
            return source.HasFailed ? Option<TweetDto>.FromError(source.Error) : Option<TweetDto>.FromResult(source.Value);
        }

        public static Option<TimedData<TweetDto>> DeserializeOption(this TweetDtoTimedDataOption source)
        {
            return source.HasFailed ? Option<TimedData<TweetDto>>.FromError(source.Error) : Option<TimedData<TweetDto>>.FromResult(source.Value.DeserializeTimedData());
        }

        public static TimedData<TweetDto> DeserializeTimedData(this TweetDtoTimedData source)
        {
            return new TimedData<TweetDto>(source.Data.ToList(), source.Ascending, source.Next);
        }
    }
}
