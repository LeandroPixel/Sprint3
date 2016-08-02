using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO.Produtos
{
    public class Pacote
    {
        public int ID { get; set; }
        public string Nome { get; set; }
        public List<int> Products { get; set; }
    }
}
