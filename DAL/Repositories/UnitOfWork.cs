using DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DropShoppingDbContext _context;
        private readonly Lazy<IProductRepository> _productRepository;
        public UnitOfWork(DropShoppingDbContext context, IProductRepository productRepository)
        {
            _context = context;
            _productRepository = new Lazy<IProductRepository>(() => productRepository);
        }
        public IProductRepository ProductRepository => _productRepository.Value;

        public async Task<int> SaveChangesAsync()
        {
          return  await _context.SaveChangesAsync();
        }
    }
}
