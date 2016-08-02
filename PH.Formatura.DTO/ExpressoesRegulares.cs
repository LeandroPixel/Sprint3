using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
	public class ValidacaoDeEmail : RegularExpressionAttribute
	{
		public ValidacaoDeEmail()
			: base(@"^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-zA-Z0-9]{1}[a-zA-Z0-9\-]{0,62}[a-zA-Z0-9]{1})|[a-zA-Z])\.)+[a-zA-Z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$")
		{
		}
	}

	public class ValidacaoDeCpf_CNPJ : RegularExpressionAttribute
	{
		public ValidacaoDeCpf_CNPJ()
			: base(@"([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})")
		{
		}
	}

	public class ValidacaoDeCEP : RegularExpressionAttribute
	{
		public ValidacaoDeCEP()
			: base(@"[0-9]{8}")
		{
		}
	}

	public class ValidacaoDeTelefone : RegularExpressionAttribute
	{
		public ValidacaoDeTelefone()
			: base(@"[0-9]{10,11}")
		{
		}
	}

	public class ValidacaoDeEstadosBR : RegularExpressionAttribute
	{
		public ValidacaoDeEstadosBR()
			: base(@"(?i)(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)")
		{
		}
	}

	public class ValidacaoDeSexo : RegularExpressionAttribute
	{
		public ValidacaoDeSexo()
			: base(@"(?i)(MASCULINO|FEMININO)")
		{
		}
	}

	public class ValidacaoDeFacebook : RegularExpressionAttribute
	{
		public ValidacaoDeFacebook()
			: base(@"(?i)(\b(http|https):\/\/(|[a-zA-Z]{1,3}.)facebook.com\/[a-zA-Z(.)|\-\_]{1,50})")
		{
		}
	}

	public class ValidacaoDeSite : RegularExpressionAttribute
	{
		public ValidacaoDeSite()
			: base(@"(?i)(/(((http|ftp|https):\/{2})+(([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?)?))\b/imuS)")
		{
		}
	}

	public class ValidacaoDeNumeros : RegularExpressionAttribute
	{
		public ValidacaoDeNumeros()
			: base(@"([0-9]+)")
		{
		}
	}
}