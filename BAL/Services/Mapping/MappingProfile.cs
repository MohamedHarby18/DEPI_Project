using AutoMapper;
using AutoMapper.Execution;
using AutoMapper.Internal;
using BAL.DTOs;
using BAL.DTOs.BrandDTOs;
using BAL.DTOs.CategoryDTOs;
using BAL.DTOs.OrderDTOs;
using BAL.DTOs.ProductDTOs;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace BAL.Services.Mapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {

            //Product Mapping
            CreateMap(typeof(PaginatedResult<Product>), typeof(PaginatedResult<ProductDTO>));

            
            CreateMap<ProductCreateDTO,Product>().ReverseMap();
            CreateMap<Product,ProductUpdateDTO>().ReverseMap();
            CreateMap<Product,ProductDetailsDTO>().ForMember(dest => dest.Images, opt => opt.MapFrom<ProductImagesUrlResolver>()).ForMember(dest => dest.CategoryName, opt => opt.MapFrom(x => x.Category.Name))
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(x => x.Brand.Name));
            CreateMap<Product, ProductDTO>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom<ProductImagesUrlResolver2>());
            
            //Category Mapping
            CreateMap<CategoryCreateDTO, Category>();
            CreateMap<CategoryUpdateDTO, Category>();
            CreateMap<Category, CategoryDTO>();
            CreateMap<Category, CategoryDetailsDTO>();

            //Brand Mapping
            CreateMap<BrandCreateDTO, Brand>();
            CreateMap<BrandUpdateDTO, Brand>();
            CreateMap<Brand, BrandDTO>();

            //Order Mapping
            CreateMap<OrderDetailsDTO, Order>();
            CreateMap<OrderDTO, Order>();
            CreateMap<OrderUpdateDTO, Order>();
            CreateMap<OrderUpdateDTO, Order>();
        } 

        
    }

}
