using AutoMapper;
using BAL.DTOs;
using BAL.DTOs.ProductDTOs;
using BAL.Exceptions;
using BAL.Services.Interfaces;
using DAL.Models;
using DAL.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAL.Services
{
    public class ProductService(IMapper mapper,IUnitOfWork unitOfWork,IAttachmentService attachmentService) : IProductService
    {
        public async Task AddProduct(ProductCreateDTO product)
        {
            
            await unitOfWork.ProductRepository.AddAsync(mapper.Map<Product>(product));
            await unitOfWork.SaveChangesAsync();
            //attachmentService.Upload(product.Images);
           await AddProductImage(product.ProductImages);
            
        }
        private async Task AddProductImage(List<IFormFile> Images)
        {
            foreach (var item in Images)
            {
                await attachmentService.Upload(item, "Products");
            }
        }
        public async Task DeleteProduct(Guid id)
        {
            //await productRepository.DeleteAsync()
            var flag =await unitOfWork.ProductRepository.IsExisted(id);
            if (!flag) throw new ProductNotFoundException(id);
            await unitOfWork.ProductRepository.DeleteAsync(id); 
          await  unitOfWork.SaveChangesAsync();
        }

        public async Task<PaginatedResult<ProductDTO>> GetAllProducts(ProductParamaters paramaters)
        {
          var Products= await unitOfWork.ProductRepository.GetAll(paramaters);
          var Products2= mapper.Map<PaginatedResult<ProductDTO>>(Products);
            return Products2;
        }

        public async Task<ProductDetailsDTO> GetProductById(Guid id)
        {
            var product = await unitOfWork.ProductRepository.GetById(id);
            if(product == null)
            {
                throw new ProductNotFoundException(id);
            }
           return mapper.Map<ProductDetailsDTO>(product);
        }
        //TO-DO Update Images
        public async Task UpdateProduct(ProductUpdateDTO productDTO)
        {
            var product = await unitOfWork.ProductRepository.GetById(productDTO.Id);
            if (product == null)
            {
                throw new ProductNotFoundException(productDTO.Id);
            }
            mapper.Map(productDTO, product);

            unitOfWork.ProductRepository.UpdateAsync(product);
            await unitOfWork.SaveChangesAsync();
        }

        
    }
}
