//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PH.Formatura.DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class v_GRD_TabelaPreco
    {
        public int TurmaPrecoID { get; set; }
        public int TurmaID { get; set; }
        public int ProductID { get; set; }
        public int Parcela { get; set; }
        public decimal Preco { get; set; }
        public decimal PrecoFoto { get; set; }
        public int TurmaPrecoHistID { get; set; }
        public Nullable<int> MaxParcela { get; set; }
        public string DescricaoPrecoHist { get; set; }
        public bool UsaPrecoPorFoto { get; set; }
        public int QtdMaxFoto { get; set; }
        public int QtdMinFoto { get; set; }
        public int CompanyID { get; set; }
        public string CompanyName { get; set; }
        public int BrandID { get; set; }
        public string NomeTurma { get; set; }
        public string CodigoTurma { get; set; }
        public string PIT { get; set; }
        public string NomeProduto { get; set; }
    }
}