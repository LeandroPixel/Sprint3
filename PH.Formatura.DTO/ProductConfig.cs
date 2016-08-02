using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
    public class ProductConfig
    {
        public int ID               {get; set;}
        public int ProductID        {get; set;}
        public bool UsaPrecoPorFoto  {get; set;}
        public int QtdMaxFoto { get; set; }
    }

    public class TurmaPrecoProduct
    {
        public int ID { get; set; }
        public int TurmaID { get; set; }
        public int ProductID { get; set; }
        public int Parcela { get; set; }
        public decimal Preco { get; set; }
        public int PrecoFoto { get; set; }
        public string TurmaPrecoHistID { get; set; }
    
    }
}
