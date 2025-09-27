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
        private readonly Lazy<ICategoryRepository> _categoryRepository;
        public UnitOfWork(DropShoppingDbContext context, IProductRepository productRepository, ICategoryRepository categoryRepository)
        {
            _context = context;
            _productRepository = new Lazy<IProductRepository>(() => productRepository);
            _categoryRepository = new Lazy<ICategoryRepository>(() => categoryRepository);

        }
        public IProductRepository ProductRepository => _productRepository.Value;
        public ICategoryRepository CategoryRepository => _categoryRepository.Value;

        public async Task<int> SaveChangesAsync()
        {
          return  await _context.SaveChangesAsync();
        }
    }
}
