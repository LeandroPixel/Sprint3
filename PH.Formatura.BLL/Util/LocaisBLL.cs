using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL.Util
{
	public class LocaisBLL
	{
		public Dictionary<string, string> GetEstados()
		{
			Dictionary<string, string> Estados = new Dictionary<string, string>();
			Estados.Add("AC", "Acre");
			Estados.Add("AL", "Alagoas");
			Estados.Add("AP", "Amapá");
			Estados.Add("AM", "Amazonas");
			Estados.Add("BA", "Bahia");
			Estados.Add("CE", "Ceará");
			Estados.Add("DF", "Distrito Federal");
			Estados.Add("ES", "Espírito Santo");
			Estados.Add("GO", "Goiás");
			Estados.Add("MA", "Maranhão");
			Estados.Add("MT", "Mato Grosso");
			Estados.Add("MS", "Mato Grosso do Sul");
			Estados.Add("MG", "Minas Gerais");
			Estados.Add("PA", "Pará");
			Estados.Add("PB", "Paraíba");
			Estados.Add("PR", "Paraná");
			Estados.Add("PE", "Pernambuco");
			Estados.Add("PI", "Piauí");
			Estados.Add("RJ", "Rio de Janeiro");
			Estados.Add("RN", "Rio Grande do Norte");
			Estados.Add("RS", "Rio Grande do Sul");
			Estados.Add("RO", "Rondônia");
			Estados.Add("RR", "Roraima");
			Estados.Add("SC", "Santa Catarina");
			Estados.Add("SP", "São Paulo");
			Estados.Add("SE", "Sergipe");
			Estados.Add("TO", "Tocantins");

			return Estados;
		}
	}
}