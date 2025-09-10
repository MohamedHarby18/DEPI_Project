using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DAL
{
    public static class DataAccessLayerRegistrationService
    {
     public static IServiceCollection RegistrationService(this IServiceCollection Services, IConfiguration configuration)
        {

            Services.AddDbContext<DropShoppingDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

      

            return Services;
              
        }

    }
}
