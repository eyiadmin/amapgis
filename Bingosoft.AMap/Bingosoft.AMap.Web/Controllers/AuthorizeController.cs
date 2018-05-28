using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Bingosoft.AMap.Web.Authentication;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Bingosoft.AMap.Web.Model;
using Bingosoft.AMap.Common;
using Bingosoft.AMap.Core.Dto;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Bingosoft.AMap.Web.Controllers
{
    [Route("api/[controller]")]
    public class AuthorizeController : Controller
    {
        private JwtSettings _jwtSettings;

        public AuthorizeController(IOptions<JwtSettings> _jwtSettingsAccesser)
        {
            _jwtSettings = _jwtSettingsAccesser.Value;
        }

        [HttpPost]
        public IActionResult Token([FromBody]LoginViewModel viewModel)
        {
            if (ModelState.IsValid)//判断是否合法
            {
                if (string.IsNullOrEmpty(viewModel.User))//判断账号密码是否正确
                {
                    return BadRequest();
                }
                WebServiceRequest webServiceRequest = new WebServiceRequest();

                LoginInfoDto userDto = webServiceRequest.SSOLogin(viewModel.User, viewModel.Password);
                var claim = new Claim[]{
                    new Claim(ClaimTypes.Name,userDto.User.LoginName),
                    new Claim(ClaimTypes.Role,"admin"),
                    new Claim(ClaimTypesExt.GroupId,userDto.User.GroupID),
                    new Claim(ClaimTypesExt.LoginNo,userDto.User.LoginNo),
                    new Claim(ClaimTypesExt.MenuList,userDto.User.MenuList)
                };

                //对称秘钥
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
                //签名证书(秘钥，加密算法)
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                //生成token  [注意]需要nuget添加Microsoft.AspNetCore.Authentication.JwtBearer包，并引用System.IdentityModel.Tokens.Jwt命名空间
                var token = new JwtSecurityToken(_jwtSettings.Issuer, _jwtSettings.Audience, claim, DateTime.Now, DateTime.Now.AddMinutes(30), creds);

                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });

            }

            return BadRequest();
        }

        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        //// POST api/values
        //[HttpPost]
        //public void Post([FromBody]string value)
        //{
        //}

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
