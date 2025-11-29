using BAL.DTOs.BrandDTOs;
using BAL.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace PAL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BrandsController : ControllerBase
    {
        private readonly IBrandService brandService;

        public BrandsController(IBrandService brandService)
        {
            this.brandService = brandService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var Brands = await brandService.GetAllAsync();
            return Ok(Brands);
        }
        // Accept new brand as multipart/form-data (file uploads) or as JSON in a single route
        [HttpPost]
        public async Task<IActionResult> Add()
        {
            // If request is form-data (multipart/form-data), read from form
            if (Request.HasFormContentType)
            {
                var form = await Request.ReadFormAsync();
                var name = form["Name"].ToString();
                var createDTO = new BrandCreateDTO { Name = name };
                await brandService.AddAsync(createDTO);
                return Created(string.Empty, null);
            }

            // Otherwise assume JSON body
            using var reader = new System.IO.StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();
            if (string.IsNullOrWhiteSpace(body)) return BadRequest("Empty request body");
            var dto = System.Text.Json.JsonSerializer.Deserialize<BrandCreateDTO>(body, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (dto == null) return BadRequest("Invalid body");

            await brandService.AddAsync(dto);
            return Created(string.Empty, null);
        }

        // removed duplicate Add([FromForm]) - single Add() handles both JSON and multipart/form-data

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await brandService.DeleteAsync(id);
            return NoContent();
        }


        [HttpPut]
        public async Task<IActionResult> Update([FromForm] BrandUpdateDTO updateDTO)
        {
            await brandService.UpdateAsync(updateDTO);
            return Ok();
        }
    }
}
