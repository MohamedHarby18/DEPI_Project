﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAL.DTOs.OrderItemDTOs
{
    public class OrderItemCreateDTO
    {  
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
