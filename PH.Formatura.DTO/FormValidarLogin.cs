using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace PH.Formatura.DTO
{
	public class FormValidarLogin
	{
		[Required(AllowEmptyStrings=false, ErrorMessage = "E-mail é obrigatório")]
		[Display(Name = "E-mail")]
		[EmailAddress(ErrorMessage = "E-mail com formato inválido")]
		public string email { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Senha é obrigatório")]
		[Display(Name = "Senha")]
		public string senha { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Brand_ID é obrigatório")]
		[Display(Name = "Brand_ID")]
		public int brand_id { get; set; }
	}
}
