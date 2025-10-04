using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using BAL.DTOs.DropshipperDTOs;
using BAL.Services.Interfaces;
using DAL.Models;
using DAL.Repositories.Interfaces;

namespace BAL.Services
{
    public class DropshipperService(IDropshipperRepository dropshipperRepository,IMapper mapper) : IDropshipperService
    {

        public async Task CreateDropshipperAsync(DropshipperDto dropshipperDto)
        {
            var mapped=mapper.Map<Dropshipper>(dropshipperDto);
            await dropshipperRepository.CreateDropshipperAsync(mapped);

        }

        public async Task DeleteDropshipperAsync(string userId)
        {
            await dropshipperRepository.DeleteDropshipperAsync(userId);
        }

        public Task<IEnumerable<DropshipperDto>> GetAllDropshippersAsync()
        {
            throw new NotImplementedException();
        }

        public Task<DropshipperDto?> GetDropshipperByIdAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<DropshipperDto?> UpdateDropshipperAsync(DropshipperDto dropshipperDto)
        {
            throw new NotImplementedException();
        }
    }
}
