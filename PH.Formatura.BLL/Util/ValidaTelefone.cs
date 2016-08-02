using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace PH.Formatura.BLL.Util
{
	public static class ValidaTelefone
	{
		public static bool IsValid(string telefone)
		{
			bool IsValid = true;
			int TamanhoMinimo = 10;

			if (string.IsNullOrEmpty(telefone)) return false;
			if (telefone.Length < TamanhoMinimo) return false;

			StringBuilder sb = new StringBuilder(telefone);

			int i = 0;
			while (i < sb.Length)
			{
				bool eDigito = char.IsDigit(sb[i]);
				if (!eDigito)
				{
					IsValid = false;
				}
				
				++i;
			}

			return IsValid;
		}
	}
}
