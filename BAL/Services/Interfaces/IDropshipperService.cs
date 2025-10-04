using BAL.DTOs.DropshipperDTOs;

namespace BAL.Services.Interfaces
{
    public interface IDropshipperService
    {
        Task<IEnumerable<DropshipperDto>> GetAllDropshippersAsync();
        Task<DropshipperDto?> GetDropshipperByIdAsync(string userId);
        Task CreateDropshipperAsync(DropshipperDto dropshipperDto);
        Task<DropshipperDto?> UpdateDropshipperAsync(DropshipperDto dropshipperDto);
        Task DeleteDropshipperAsync(string userId);
    }
}
