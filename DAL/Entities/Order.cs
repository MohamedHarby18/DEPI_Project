using DAL.Models;

namespace DAL.Models
{
    public class Order : BaseEntity
    {
        public DateOnly? ShippedDate { get; set; }
        public decimal OrderPrice { get; set; }
        public OrderStatus OrderStatus { get; set; }
        public decimal OrderDiscount { get; set; }

        public string DropshipperId { get; set; }
        public User Dropshipper { get; set; }

        public ICollection<OrderItem> Items { get; set; }
    }
}


