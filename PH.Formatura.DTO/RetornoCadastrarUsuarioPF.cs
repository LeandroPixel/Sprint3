using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
	public class RetornoCadastrarUsuarioPF
	{
		public bool Sucesso { get; set; }
		public string Mensagem { get; set; }
		public Nullable<int> User_ID { get; set; }
		public Nullable<int> CompanyID { get; set; }
		public Nullable<int> PessoaFisicaID { get; set; }
	}
}
