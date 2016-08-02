using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
//using System.Web.Mvc;

namespace PH.Formatura.DTO
{
    public class OrderPayment
    {
        [Required]
        public int PaymentType { get; set; }
        
        [Required]
        public decimal Valor { get; set; }

        public string TransactionCode { get; set; }

        public int PaymentGroup { get; set; }
    }
}
