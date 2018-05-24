using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Bingosoft.AMap.Web.Authentication
{
    public class TokenValidator: ISecurityTokenValidator
    {
        bool ISecurityTokenValidator.CanValidateToken => true;

        int ISecurityTokenValidator.MaximumTokenSizeInBytes { get; set; }


        public ClaimsPrincipal ValidateToken(string securityToken, TokenValidationParameters validationParameters, out SecurityToken validatedToken)
        {
            validatedToken = null;
            //判断token是否正确
           

            //给Identity赋值
            var identity = new ClaimsIdentity(JwtBearerDefaults.AuthenticationScheme);
            identity.AddClaim(new Claim("name", "wyt"));
            identity.AddClaim(new Claim(ClaimsIdentity.DefaultRoleClaimType, "admin"));

            var principle = new ClaimsPrincipal(identity);
            return principle;
        }

        bool ISecurityTokenValidator.CanReadToken(string securityToken)
        {
            return true;
        }

        
       
    }
}
