using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace PH.Formatura.DTO
{
    public class CepInfo
    {
        public string CEP { get; set; }
        public decimal Peso { get; set; }
        [IgnoreDataMember]
        public int PrazoEntrega { get; set; }
        //[IgnoreDataMember]
        public int PrazoProducao { get; set; }
        public int PrazoFinal { get; set; }
        public decimal Preco { get; set; }
        public string Tipo { get; set; }
        [IgnoreDataMember]
        public bool UsarCartaComercial { get; set; }
        [IgnoreDataMember]
        public bool TemSimples { get; set; }
        [IgnoreDataMember]
        public bool TemExpresso { get; set; }
        public Dictionary<string, CepOpcoes> Opcoes { get; set; }
        public int IdPromo { get; set; }

        public enum TipoFrete
        {
            Expresso = 1,
            Simples = 2
        }
    }

    public class PrecoPrazoRet
    {
        public string CEP { get; set; }
        public string CodRet { get; set; }
        public string Custo { get; set; }
        public string Imposto { get; set; }
        public string Markup { get; set; }
        public string MsgRet { get; set; }
        public string Origem { get; set; }
        public string Peso { get; set; }
        public string Prazo { get; set; }
        public string Preco { get; set; }
        public string SubTipo { get; set; }
        public string TempoProcessamentoSegundos { get; set; }
        public string Tipo { get; set; }
        public int LogGravadoID { get; set; }
        public decimal PesoEnviado { get; set; }
    }

    public class CepOpcoes
    {
        public string Tipo { get; set; }
        public int Prazo { get; set; }
        public decimal Custo { get; set; }
        [JsonIgnore]
        [XmlIgnore]
        public decimal CustoSemMarkup { get; set; }
        public int Envelopes { get; set; }
        public string SubTipo { get; set; }
        [IgnoreDataMember]
        public string Msg { get; set; }
        [JsonIgnore]
        [XmlIgnore]
        public int LogGravadoID { get; set; }
        public bool Habilitado { get; set; }
        public decimal ValorOriginal { get; set; }

    }

    /// <summary>
    /// Lista de Promoções utilizadas ( Cupom, PlanoFoto, PlanoFotolivro )
    /// </summary>
    public class UsedPromo
    {
        public int IdPromo { get; set; }
        public TypedPromo TypePromo { get; set; }
        public string Cupom { get; set; }
    }

}
