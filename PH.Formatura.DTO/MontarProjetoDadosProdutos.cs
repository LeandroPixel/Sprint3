using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
	public class MontarProjetoDadosProdutos
	{
		public int Brand_ID { get; set; }
		public int Product_ID { get; set; }
		public string Product_Type { get; set; }
		public string Descricao { get; set; }
		public Nullable<int> Size_ID { get; set; }
		public Nullable<int> Paginas_Default { get; set; }
		public Nullable<int> Paginas_Min { get; set; }
		public Nullable<int> Paginas_Max { get; set; }

		public Nullable<decimal> Paginas_Extra_Preco { get; set; }
		public decimal Preco { get; set; }
		public string Url { get; set; }

        public string cod_size { get; set; }
        public string des_size { get; set; }
        public string des_medidas { get; set; }
        public string fl_active { get; set; }
        public bool fl_promo_allowed { get; set; }
        public bool fl_offer_allowed { get; set; }
        public int photos_capacity { get; set; }
        public Nullable<bool> isPortifolio { get; set; }
        public int Scale_Mode_ID_Default { get; set; }
        public int order { get; set; }
        public Nullable<int> PhotobookLineID { get; set; }
        public Nullable<int> shelfPhotobookID { get; set; }
	}
}
