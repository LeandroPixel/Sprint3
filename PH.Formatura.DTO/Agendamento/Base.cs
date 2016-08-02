using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO.Agendamento
{
    public class Base
    {
        [Required]
        [ValidacaoDeNumeros]
        public int AlunoTurmaID { get; set; }
        [Required]
        [ValidacaoDeNumeros]
        public int VendedorID { get; set; }
    }
}
