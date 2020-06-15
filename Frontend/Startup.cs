using Kwetterprise.Frontend.Models;
using Kwetterprise.ServiceDiscovery.Client;
using Kwetterprise.ServiceDiscovery.Client.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace Kwetterprise.Frontend
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
            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            RegisterDiscoveryClient(services, this.Configuration);

            RegisterExternals(services, this.Configuration);
            ConfigureAuthentication(services, this.Configuration);
        }

        private static void RegisterExternals(IServiceCollection services, IConfiguration configuration)
        {
            var serviceConfigurationSection = configuration.GetSection("Externals");

            var serviceConfiguration =
                new Externals(serviceConfigurationSection["Account"], serviceConfigurationSection["Tweet"]);

            services.AddSingleton(serviceConfiguration);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.AddServiceDiscoveryPingMiddleware();

            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }

        private static void RegisterDiscoveryClient(IServiceCollection services, IConfiguration configuration)
        {
            var serviceSection = configuration.GetSection("ServiceDiscovery");

            var serviceConfiguration = new ServiceConfiguration(serviceSection["ServiceName"], serviceSection["ServiceUrl"]);
            var apiGatewayConfiguration = new ServiceDiscoveryConfiguration(serviceSection["ServiceDiscoveryUrl"]);
            services.AddServiceDiscoveryClientWorker(serviceConfiguration, apiGatewayConfiguration);
        }

        private static void ConfigureAuthentication(IServiceCollection services, IConfiguration configuration)
        {
            var jwtSection = configuration.GetSection("Jwt");
            var jwtConfiguration = new JwtConfiguration(jwtSection["Issuer"], jwtSection["Key"]);
            services.AddSingleton(jwtConfiguration);

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = true;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(jwtConfiguration.Key),
                    ValidIssuer = jwtConfiguration.Issuer,
                    ValidAudience = jwtConfiguration.Issuer,
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                };
            });

            services.AddMvc();
        }
    }
}
