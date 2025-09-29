﻿using BAL.DTOs.ProductDTOs;
using BAL.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace PAL.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class ProductsController(IProductService productService):ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery]ProductParamaters paramaters) => Ok(await productService.GetAllProducts(paramaters));


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id) => Ok(await productService.GetProductById(id));


        [HttpPost]
        
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Add([FromForm]ProductCreateDTO createDTO)
        {
            await productService.AddProduct(createDTO);
            return Created();
        }

        [HttpPut]
        public async Task<IActionResult> Update(ProductUpdateDTO updateDTO)
        {
            await productService.UpdateProduct(updateDTO);
            return Ok();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await productService.DeleteProduct(id);
            return NoContent();
        }


    }
}
