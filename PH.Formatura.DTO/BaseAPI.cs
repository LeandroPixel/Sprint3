using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
	public class BaseAPI
	{
		public string Mensagem { get; set; }
		public bool Sucesso { get; set; }
        public dynamic Obj { get; set; }
	}
}
