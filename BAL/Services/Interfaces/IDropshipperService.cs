using BAL.DTOs.DropshipperDTOs;

namespace BAL.Services.Interfaces
{
    public interface IDropshipperService
    {
        Task<IEnumerable<DropshipperDto>> GetAllDropshippersAsync();
        Task<DropshipperDto?> GetDropshipperByIdAsync(string userId);
        Task<DropshipperDto> CreateDropshipperAsync(DropshipperDto dropshipperDto);
        Task<DropshipperDto?> UpdateDropshipperAsync(string userId, DropshipperDto dropshipperDto);
        Task<bool> DeleteDropshipperAsync(string userId);
    }
}
