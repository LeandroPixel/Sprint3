using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
	public class ExtratoPedidoPagamento
	{
		public int ID { get; set; }
		public string Descricao { get; set; }
		public decimal Valor { get; set; }
		public DateTime Data { get; set; }
	}
}
