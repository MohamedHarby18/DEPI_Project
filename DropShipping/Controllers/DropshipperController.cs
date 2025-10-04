using BAL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using BAL.DTOs.DropshipperDTOs;

namespace PAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DropshipperController : ControllerBase
    {
        private readonly IDropshipperService _dropshipperService;

        public DropshipperController(IDropshipperService dropshipperService)
        {
            _dropshipperService = dropshipperService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDropshippers()
        {
            var dropshippers = await _dropshipperService.GetAllDropshippersAsync();
            return Ok(dropshippers);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetDropshipperById(string userId)
        {
            var dropshipper = await _dropshipperService.GetDropshipperByIdAsync(userId);
            if (dropshipper == null)
                return NotFound();

            return Ok(dropshipper);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDropshipper([FromBody] DropshipperDto dropshipperDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdDropshipper = await _dropshipperService.CreateDropshipperAsync(dropshipperDto);
            return CreatedAtAction(nameof(GetDropshipperById),
                new { userId = createdDropshipper.UserId }, createdDropshipper);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateDropshipper(string userId, [FromBody] DropshipperDto dropshipperDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedDropshipper = await _dropshipperService.UpdateDropshipperAsync(userId, dropshipperDto);
            if (updatedDropshipper == null)
                return NotFound();

            return Ok(updatedDropshipper);
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteDropshipper(string userId)
        {
            var result = await _dropshipperService.DeleteDropshipperAsync(userId);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
