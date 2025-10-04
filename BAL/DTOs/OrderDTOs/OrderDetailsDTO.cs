﻿using BAL.DTOs.OrderItemDTOs;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAL.DTOs.OrderDTOs
{
    public class OrderDetailsDTO
    {
        public Guid Id { get; set; }
        public DateOnly? ShippedDate { get; set; }
        public decimal OrderPrice { get; set; }
        public decimal OrderDiscount { get; set; }
        public OrderStatus OrderStatus { get; set; }

        public string DropshipperId { get; set; }
        public string DropshipperName { get; set; }

        // All items inside the order
        public List<OrderItemsDetailsDTO> Items { get; set; } = new();
    }
}
