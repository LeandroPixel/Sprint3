using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL.Util
{
	public class Format
	{
		public static string Data(DateTime dt)
		{
			return string.Format("{0:dd/MM/yyyy}", dt);
		}

		public static string Hora(DateTime dt)
		{
			return string.Format("{0:HH:mm}", dt);
		}

		/// <summary>
		/// Recebe um valor decimal com duas casas decimais coloca ponto como separador decimal. Exemplo: R$ 110,50 => 110.50
		/// </summary>
		/// <param name="val">Recebe o valor decimal.</param>
		/// <param name="cult">Recebe a cultura.</param>
		/// <returns>String com o valor inteiro.</returns>
		public static string Valor(decimal? val, CultureInfo cult = null)
		{
			if (cult != null)
				return string.Format(cult, "{0:0.00}", val);
			else
				return string.Format(new CultureInfo("pt-BR"), "{0:0.00}", val);

		}

		public static string Ano(DateTime dt)
		{
			return string.Format("{0:yyyy}", dt);
		}

		public static string Mes(DateTime dt)
		{
			return string.Format("{0:MM}", dt);
		}

		public static string Dia(DateTime dt)
		{
			return string.Format("{0:dd}", dt);
		}

		public static string DataLog(DateTime dt)
		{
			return string.Format("{0:dd.MM.yyyy}", dt);
		}

		/// <summary>
		/// Recebe um valor decimal com duas casas decimais coloca ponto como
		/// separador de decimal e virgula no separador de milhar. Exemplo: R$ 1110,50 => 1,110.50
		/// </summary>
		/// <param name="val">Recebe o valor decimal.</param>
		/// <param name="cult">Recebe a cultura.</param>
		/// <returns>String com o valor inteiro.</returns>

		public static string ValorMilharDecimal(decimal? val, CultureInfo cult = null)
		{
			if (cult != null)
				return string.Format(cult, "{0:0,000.00}", val);
			else
				return string.Format(new CultureInfo("pt-BR"), "{0:0,000.00}", val);
		}

		/// <summary>
		/// Recebe um valor decimal com duas casas decimais e multiplica por 100
		/// depois retornoa string do valor inteiro. Exemplo: R$ 110,50 => 11050
		/// </summary>
		/// <param name="val">Recebe o valor decimal.</param>
		/// <param name="cult">Recebe a cultura.</param>
		/// <returns>String com o valor inteiro.</returns>
		public static string ValorVezCem(decimal? val, CultureInfo cult = null)
		{
			if (cult != null)
				return string.Format(cult, "{0:0}", (Int64)(val * 100));
			else
				return string.Format(new CultureInfo("pt-BR"), "{0:0}", (Int64)(val * 100));

		}

		public static string GetSha256FromString(string strData)
		{
			var message = Encoding.ASCII.GetBytes(strData);
			SHA256Managed hashString = new SHA256Managed();
			string hex = "";

			var hashValue = hashString.ComputeHash(message);
			foreach (byte x in hashValue)
			{
				hex += String.Format("{0:x2}", x);
			}
			return hex;
		}

        public static string DateToISO8601(DateTime d) {
            //System.DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssK");
            //System.DateTime.Now.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssK");
            return d.ToString("yyyy-MM-ddTHH:mm:ssK");
        }

        public static string DateToDBFormat(DateTime d)
        {
            //System.DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ssK");
            //System.DateTime.Now.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssK");
            return d.ToString("yyyy-MM-dd HH:mm:ss");
        }
	}
}
