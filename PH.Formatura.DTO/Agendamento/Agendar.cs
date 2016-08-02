using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO.Agendamento
{
    public class Agendar : Base
    {
        [Required]
        public DateTime Data { get; set; }

        public int Status { get; set; }
    }
}
