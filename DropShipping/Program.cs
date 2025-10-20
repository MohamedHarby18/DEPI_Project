
using BAL;
using DAL;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
//using AutoMapper.Extensions.Microsoft.DependencyInjection;

namespace DropShipping
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            //builder.Services.AddAutoMapper();
            builder.Services.AddControllers();
            DataAccessLayerRegistrationService.RegistrationService(builder.Services,builder.Configuration);
            BusineessLayerRegistrationServices.RegistrationService(builder.Services);
            builder.Services.AddIdentity<User, IdentityRole>()
                .AddEntityFrameworkStores<DropShoppingDbContext>()
                .AddDefaultTokenProviders();






            // 1?? Add CORS service
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:5500") // your frontend URLs
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    });
            });





            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
           
            app.UseHttpsRedirection();
            app.UseCors("AllowFrontend");

            app.UseAuthorization();
            app.UseAuthentication();
            app.UseStaticFiles();

            app.MapControllers();

            app.Run();
        }
    }
}
