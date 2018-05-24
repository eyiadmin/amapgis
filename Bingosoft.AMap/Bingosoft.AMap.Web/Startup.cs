using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Bingosoft.AMap.Core.Authentication;
using Bingosoft.AMap.Web.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Bingosoft.AMap.Application.DrawAMap;
using Bingosoft.AMap.Core.OptionsConf;
using Bingosoft.AMap.Application.Group;

namespace Bingosoft.AMap.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddTransient<IDrawAMapService,DrawAMapService>();
            services.AddSingleton<IGroupService, GroupService>();
            //将appsettings.json中的JwtSettings部分文件读取到JwtSettings中，这是给其他地方用的
            services.Configure<JwtSettings>(Configuration.GetSection("JwtSettings"));
            services.Configure<DbConnectionString>(Configuration.GetSection("DbConnectionString"));


            //由于初始化的时候我们就需要用，所以使用Bind的方式读取配置
            //将配置绑定到JwtSettings实例中
            var jwtSettings = new JwtSettings();
            var dbConnectionString = new DbConnectionString();
            Configuration.Bind("JwtSettings", jwtSettings);
            Configuration.Bind("DbConnectionString", dbConnectionString);

            services.AddAuthentication(options =>
            {
                //认证middleware配置
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(o =>
            {
                //主要是jwt  token参数设置
                o.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    //Token颁发机构
                    ValidIssuer = jwtSettings.Issuer,
                    //颁发给谁
                    ValidAudience = jwtSettings.Audience,
                    //这里的key要进行加密，需要引用Microsoft.IdentityModel.Tokens
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
                    //ValidateIssuerSigningKey=true,
                    ////是否验证Token有效期，使用当前时间与Token的Claims中的NotBefore和Expires对比
                    ValidateLifetime = true,
                    ////允许的服务器时间偏移量
                    //ClockSkew=TimeSpan.Zero

                };
                //o.SecurityTokenValidators.Clear();//将SecurityTokenValidators清除掉，否则它会在里面拿验证
                //o.SecurityTokenValidators.Add(new TokenValidator());
                //o.Events = new JwtBearerEvents
                //{
                //    //重写OnMessageReceived
                //    OnMessageReceived = context => {
                //        var token = context.Request.Headers["bingosoft.token"];
                //        context.Token = token.FirstOrDefault();
                //        return Task.CompletedTask;
                //    }
                //};
            });

            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            //var audienceConfig = Configuration.GetSection("Audience");
            //var symmetricKeyAsBase64 = audienceConfig["Secret"];
            //var keyByteArray = Encoding.ASCII.GetBytes(symmetricKeyAsBase64);
            //var signingKey = new SymmetricSecurityKey(keyByteArray);
            //var SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
            //app.UseAuthentication(new TokenProviderOptions
            //{
            //    Audience = audienceConfig["Audience"],
            //    Issuer = audienceConfig["Issuer"],
            //    SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
            //});
            app.UseAuthentication();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
