using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bingosoft.AMap.Core.Authentication
{
   public class TokenProviderOptions
    {
        /// <summary>
        /// 请求路径
        /// </summary>
        public string Path { get; set; } = "/Api/Token";

        public string Issuer { get; set; }

        public string Audience { get; set; }
        /// <summary>
        /// 过期时间
        /// </summary>
        public TimeSpan Expiration { get; set; } = TimeSpan.FromMinutes(5000);

        public SigningCredentials SigningCredentials { get; set; }
    }
}
