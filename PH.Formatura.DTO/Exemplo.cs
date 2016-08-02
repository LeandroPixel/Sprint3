using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace PH.Formatura.DTO
{
	public class Exemplo
	{
		[Required(AllowEmptyStrings=false, ErrorMessage="Necessário informar valor")]
		public string teste { get; set; }
	}
}
