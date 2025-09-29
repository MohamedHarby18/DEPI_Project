using BAL.Services;
using BAL.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using AutoMapper;
//using AutoMapper.Extensions.Microsoft.DependencyInjection;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using BAL.Services.Mapping;

namespace BAL
{
    public static class BusineessLayerRegistrationServices
    {
        public static IServiceCollection RegistrationService(this IServiceCollection Services)
        {
            Services.AddScoped<IBrandService, BrandService>();
            Services.AddScoped<IProductService, ProductService>();
            Services.AddScoped<IAttachmentService, AttachmentService>();
            Services.AddScoped<ICategoryService, CategoryService>();

            Services.AddAutoMapper(typeof(MappingProfile).Assembly);

            return Services;
        }

    }
}
