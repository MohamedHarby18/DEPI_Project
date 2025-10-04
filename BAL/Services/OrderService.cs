using AutoMapper;
using BAL.DTOs;
using BAL.DTOs.OrderDTOs;
using BAL.Exceptions;
using BAL.Services.Interfaces;
using DAL.Models;
using DAL.Repositories.Interfaces;
using System;
using System.Threading.Tasks;

namespace BAL.Services
{
    public class OrderService(IMapper mapper, IOrderRepository orderRepository) : IOrderService
    {
        public async Task<OrderDetailsDTO> CreateOrderAsync(OrderCreateDTO createDto)
        {
            var order = mapper.Map<Order>(createDto);

            await orderRepository.AddAsync(order);
            await orderRepository.SaveChangesAsync(); // make sure your repo has SaveChanges

            return mapper.Map<OrderDetailsDTO>(order);
        }

        public async Task<OrderDetailsDTO> GetOrderByIdAsync(Guid id)
        {
            var order = await orderRepository.GetById(id);
            if (order == null)
                throw new GeneralNotFoundException(id,"Order");

            return mapper.Map<OrderDetailsDTO>(order);
        }

        public async Task UpdateOrderAsync(OrderUpdateDTO updateDto)
        {
            var order = await orderRepository.GetById(updateDto.Id);
            if (order == null)
                throw new GeneralNotFoundException(updateDto.Id, "Order");

            mapper.Map(updateDto, order);
            orderRepository.UpdateAsync(order);

            await orderRepository.SaveChangesAsync();
        }

        public async Task DeleteOrderAsync(Guid id)
        {
            var exists = await orderRepository.IsExisted(id);
            if (!exists)
                throw new GeneralNotFoundException(id,"Order");

            await orderRepository.DeleteAsync(id);
            await orderRepository.SaveChangesAsync();
        }

        public async Task<PaginatedResult<OrderDetailsDTO>> GetAllOrdersAsync(OrderParameters parameters)
        {
            var orders = await orderRepository.GetAll(parameters);
            return mapper.Map<PaginatedResult<OrderDetailsDTO>>(orders);
        }
    }
}
