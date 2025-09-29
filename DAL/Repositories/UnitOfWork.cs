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
        private readonly Lazy<IBrandRepository> _brandRepository;
        public UnitOfWork(DropShoppingDbContext context, IProductRepository productRepository, ICategoryRepository categoryRepository,IBrandRepository brandRepository)
        {
            _context = context;
            _productRepository = new Lazy<IProductRepository>(() => productRepository);
            _categoryRepository = new Lazy<ICategoryRepository>(() => categoryRepository);
            _brandRepository = new Lazy<IBrandRepository>(() => brandRepository);
        }
        public IProductRepository ProductRepository => _productRepository.Value;
        public ICategoryRepository CategoryRepository => _categoryRepository.Value;
        public IBrandRepository BrandRepository => _brandRepository.Value;

        public async Task<int> SaveChangesAsync()
        {
          return  await _context.SaveChangesAsync();
        }
    }
}
