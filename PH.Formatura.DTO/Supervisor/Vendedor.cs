using System.ComponentModel.DataAnnotations;

namespace PH.Formatura.DTO.Supervisor
{
    public class Vendedor
    {
        public int? ID { get; set; }
        public string Descricao { get; set; }
    }

	public class ChangeVendedor
	{
		public int? vendedorID { get; set; }

		[Required]
		public int alunoTurmaID { get; set; }
	}
}