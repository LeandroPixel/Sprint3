using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
    public class ProjetosFinalizados
	{
		public int ID { get; set; }
		public string Album_Nome { get; set; }
		public string Data { get; set; }
		public string Album_Modelo { get; set; }
		public string Pedido_Status { get; set; }
		public string Pedido_Code { get; set; }
		public Nullable<int> Pedido_ID { get; set; }
		public string Texto_Lombada { get; set; }
		public Nullable<int> Qtd_fotos { get; set; }
	}
}
