using DAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.Property(o => o.OrderPrice)
                .HasColumnType("decimal(18,2)");

            builder.Property(o => o.OrderDiscount)
                .HasColumnType("decimal(18,2)");

            builder.Property(o => o.ShippedDate)
                .HasColumnType("date");
        }
    }
}

