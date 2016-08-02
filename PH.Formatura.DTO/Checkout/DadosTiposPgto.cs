using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
    class DadosTiposPgto
    {
    }

    public class Itau
    {
        public string DadosEncriptShopLine { get; set; }
    }

    public class PgtoDebito
    {
        public Itau itau { get; set; }

        public PgtoDebito()
        {
            itau = new Itau();
        }
    }

    public class Boleto
    {
        public int BoletoID { get; set; }
        public DateTime? DtVencimento { get; set; }
    }
}
