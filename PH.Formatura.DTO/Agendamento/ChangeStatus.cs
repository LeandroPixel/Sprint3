using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO.Agendamento
{
    public class ChangeStatus : Base
    {
        [Required]
        public int statusID { get; set; }
    }
}
