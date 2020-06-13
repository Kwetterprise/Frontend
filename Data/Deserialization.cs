using System;
using System.Collections.Generic;
using System.Text;
using Kwetterprise.Frontend.Common;
using Kwetterprise.Frontend.Data.Account;

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
    }
}
