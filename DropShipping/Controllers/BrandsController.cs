using BAL.DTOs.BrandDTOs;
using BAL.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace PAL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandsController(IBrandService brandService):ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var Brands= await brandService.GetAllAsync();
            return Ok(Brands);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id) => Ok(await brandService.GetByIdAsync(id));


        [HttpPost]
        public async Task<IActionResult> Add([FromForm] BrandCreateDTO createDTO)
        {
            await brandService.AddAsync(createDTO);
           return Created();
        }

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
