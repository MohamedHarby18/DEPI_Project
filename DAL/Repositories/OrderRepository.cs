using BAL.DTOs;
using BAL.DTOs.OrderDTOs;
using BAL.DTOs.OrderDTOs;
using DAL.Models;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class OrderRepository(DropShoppingDbContext dbContext) : IOrderRepository
    {
        public async Task AddAsync(Order order)
        {

            await dbContext.Orders.AddAsync(order);
        }

        public void UpdateAsync(Order order)
        {
            dbContext.Orders.Update(order);
        }

        public async Task DeleteAsync(Guid id)
        {
            var order = await dbContext.Orders.FirstOrDefaultAsync(o => o.Id == id);
            if (order is not null)
            {
                order.IsDeleted = true;
            }
        }

        public async Task<Order> GetById(Guid id)
        {
            return await dbContext.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .Include(o => o.Dropshipper)
                .AsNoTracking()
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<bool> IsExisted(Guid id)
        {
            return await dbContext.Orders.AnyAsync(o => o.Id == id);
        }

        public async Task SaveChangesAsync()
        {
            await dbContext.SaveChangesAsync();
        }
        public async Task<PaginatedResult<Order>> GetAll(OrderParameters parameters)
        {
            var query = dbContext.Orders
                .Where(o => !o.IsDeleted)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                .Include(o => o.Dropshipper)
                .AsNoTracking();

            // filtering by status
            if (!string.IsNullOrEmpty(parameters.Status) &&
                Enum.TryParse<OrderStatus>(parameters.Status, out var status))
            {
                query = query.Where(o => o.OrderStatus == status);
            }

            // filtering by FromDate / ToDate
            if (parameters.FromDate.HasValue)
                query = query.Where(o => o.CreatedAt >= parameters.FromDate.Value.ToDateTime(TimeOnly.MinValue));

            if (parameters.ToDate.HasValue)
                query = query.Where(o => o.CreatedAt <= parameters.ToDate.Value.ToDateTime(TimeOnly.MaxValue));

            // count before pagination
            var totalCount = await query.CountAsync();

            // apply pagination
            var result = await query
                .Skip((parameters.PageIndex - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToListAsync();

            return new PaginatedResult<Order>
            {
                PageIndex = parameters.PageIndex,
                PageSize = parameters.PageSize,
                TotalCount = totalCount,
                Result = result
            };
        }
    }
}
