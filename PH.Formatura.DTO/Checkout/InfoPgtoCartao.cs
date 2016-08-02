using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PH.CreditCard.DTO;
using System.Xml.Serialization;
using Newtonsoft.Json;

namespace PH.Formatura.DTO
{
    public class InfoPgtoCartao
    {
        public DadosCompra Compra { get; set; }
        public Cartao Cartao { get; set; }
        public string TransactionCode { get; set; }
        public VisaElectronResult VisaElectronResult { get; set; }
    }

    public class VisaElectronResult
    {
        public string IssuerUrl { get; set; }
        public string MD { get; set; }
        public int LogAdquirentID { get; set; }

        [JsonIgnore]
        [XmlIgnore]
        public string Code { get; set; }
        [JsonIgnore]
        [XmlIgnore]
        public string RefusalReason { get; set; }
        [JsonIgnore]
        [XmlIgnore]
        public string AuthCode { get; set; }

    }
}
