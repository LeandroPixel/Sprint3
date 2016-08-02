using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO.Production
{
    public class ProductionStatus
    {
        public string Code { get; set; }
        public string AlunoIDParceiro { get; set; }
        public string PITParceiro { get; set; }
        public int Status { get; set; }
        public DateTime? dtRecebido { get; set; }
        public DateTime? dtExpedicao { get; set; }
        public DateTime? dtEntregue { get; set; }
        public string Tracking { get; set; }
        public int? ProdutoIDPixel { get; set; }
        public string DescProduto { get; set; }
        public int? Qtd { get; set; }
        public DateTime? dtUltimaAtualizacao { get; set; }
        public string origem { get; set; }                
    }
}
