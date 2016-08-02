using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
    public class ParamSelecaoFotos 
	{
        
        public int AlbumID { get; set; }
        public int ProductID { get; set; }
        public int QtdMaxFoto { get; set; }
        public string urlRetorno { get; set; }
        public int AlunoTurmaID { get; set; }
        public int QtdMinFoto { get; set; }
        public decimal PercentDiscard { get; set; }
        public bool isFirstAcess { get; set; }    
	}
}
