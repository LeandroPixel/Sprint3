using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PH.Core.Encryption;

namespace PH.Formatura.BLL
{
	public class CriptografiaBLL
	{
		public string Decrypt(string mensagem, string keyCripto)
		{
			// Decriptografa o valor
			RC4 cript = new RC4(keyCripto);
			cript.Text = cript.HexStrToStr(mensagem);

			string result = cript.EnDeCrypt();
			return result;
		}
		public string Encrypt(string mensagem, string keyCripto)
		{
			// Encriptografa o valor
			RC4 cript = new RC4(keyCripto);
			string result = cript.Encript(mensagem);
			return result;
		}
	}
}
