using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
	public class RetornoUsuariosCadastrados
	{
		public string Empresa { get; set; }
		public string Usuario_Nome { get; set; }
		public string Usuario_Email { get; set; }
		public string Usuario_Telefone { get; set; }
		public string Usuario_Tipo { get; set; }
		public string Usuario_UltimoAcesso { get; set; }
	}
}
