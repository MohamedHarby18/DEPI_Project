using AutoMapper;
using AutoMapper.Execution;
using AutoMapper.Internal;
using BAL.DTOs;
using BAL.DTOs.BrandDTOs;
using BAL.DTOs.CategoryDTOs;
using BAL.DTOs.OrderDTOs;
using BAL.DTOs.DropshipperDTOs;
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
               .ForMember(dest=>dest.CategoryName,opt=>opt.MapFrom(x=>x.Category.Name))
               .ForMember(dest=>dest.BrandName,opt=>opt.MapFrom(x=>x.Brand.Name))
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

            // Dropshipper Mapping
            CreateMap<Dropshipper, DropshipperDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.User.Address))
                .ForMember(dest => dest.Password, opt => opt.Ignore()) // ❌ we never map password back
                .ReverseMap()
                .ForMember(dest => dest.User, opt => opt.Ignore()) // handled manually
                .ForMember(dest => dest.UserId, opt => opt.Ignore());

            CreateMap<Dropshipper, DropshipperDetails>()
.ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.User.Id))
.ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
.ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
.ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
.ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.User.Address))
.ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.User.IsActive))
.ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.User.CreatedAt))
.ReverseMap();




        }



    }

}
