namespace BAL.DTOs.DropshipperDTOs
{
    public class DropshipperDto
    {
        public string UserId { get; set; }   // PK = User.Id

        // From User
        public string UserName { get; set; }
        public string ContactEmail { get; set; }
        public string PhoneNumber { get; set; }

        // From User.Address
        public string Street { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public bool IsActive { get; set; }
        public DateOnly CreatedAt { get; set; }
    }
}
