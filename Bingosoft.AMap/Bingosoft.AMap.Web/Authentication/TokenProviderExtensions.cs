using Bingosoft.AMap.Web.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bingosoft.AMap.Core.Authentication
{
    public static class TokenProviderExtensions
    {
        public static IApplicationBuilder UseAuthentication(this IApplicationBuilder app, TokenProviderOptions options)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }
            return app.UseMiddleware<TokenProviderMiddleware>(Options.Create(options));
        }
    }
}
