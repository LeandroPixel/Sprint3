using PH.Formatura.DTO.Offline;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO.Aluno
{    
    public class AlunoGet 
    {
        [Required]
        [ValidacaoDeNumeros]
        public int AlunoID { get; set; }
        [Required]
        [ValidacaoDeNumeros]
        public int TurmaID { get; set; }
        [Required]
        [ValidacaoDeNumeros]
        public int VendedorID { get; set; }
        [Required]
        [ValidacaoDeNumeros]
        public int AlunoTurmaID { get; set; }
        [Required]
        [ValidacaoDeNumeros]
        public int AlbumID { get; set; }        
    }
}
