using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Models;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace DAL.Repositories
{
    public class DropshipperRepository(DropShoppingDbContext dbContext) : IDropshipperRepository
    {
        public async Task<IEnumerable<Dropshipper>> GetAllDropshippersAsync()
        {
            return await dbContext.Dropshippers
               .AsNoTracking()
               .ToListAsync();
        }

        public async Task<Dropshipper> GetDropshipperByIdAsync(string userId)
        {
            return (await dbContext.Dropshippers
    .AsNoTracking()
    .FirstOrDefaultAsync(x => x.UserId == userId))!;
        }

       public async Task CreateDropshipperAsync(Dropshipper dropshipper)
        {
            await dbContext.Dropshippers.AddAsync(dropshipper);
        }

      public   Task UpdateDropshipperAsync(Dropshipper dropshipper)
        {
          dbContext.Dropshippers.Update(dropshipper);
            return Task.CompletedTask;
        }


    }
}
