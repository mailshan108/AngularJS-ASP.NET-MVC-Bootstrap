using BSFinancial.Data;
using BSFinancial.Providers;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Data.Entity;
using System.Web.Http;

[assembly: OwinStartupAttribute(typeof(BSFinancial.Startup))]
namespace BSFinancial
{
    public partial class Startup
    {
        public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; }

        public void Configuration(IAppBuilder app)
        {
            //HttpConfiguration config = new HttpConfiguration();

            ConfigureOAuth(app);

            //WebApiConfig.Register(config);
//             app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
//             app.UseWebApi(config);
            //Database.SetInitializer(new MigrateDatabaseToLatestVersion<BSFinancialContext, BSFinancialMigrationsConfiguration>());
            
            //ConfigureAuth(app);
        }

        public void ConfigureOAuth(IAppBuilder app)
        {
            //use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(Microsoft.AspNet.Identity.DefaultAuthenticationTypes.ExternalCookie);
            OAuthBearerOptions = new OAuthBearerAuthenticationOptions();

            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {

                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(30),
                Provider = new SimpleAuthorizationServerProvider(),
                RefreshTokenProvider = new SimpleRefreshTokenProvider()
            };

            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(OAuthBearerOptions);
        }

    }
}
