using BAL.DTOs.OrderDTOs;
using BAL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace PAL.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController(IOrderService orderService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] OrderParameters parameters)
            => Ok(await orderService.GetAllOrdersAsync(parameters));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
            => Ok(await orderService.GetOrderByIdAsync(id));

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Add([FromBody] OrderCreateDTO createDto)
        {
            var order = await orderService.CreateOrderAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] OrderUpdateDTO updateDto)
        {
            await orderService.UpdateOrderAsync(updateDto);
            return Ok();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await orderService.DeleteOrderAsync(id);
            return NoContent();
        }
    }
}
