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
    
    public partial class GRD_Product_Config
    {
        public int ID { get; set; }
        public int ProductID { get; set; }
        public bool UsaPrecoPorFoto { get; set; }
        public int QtdMaxFoto { get; set; }
        public int QtdMinFoto { get; set; }
        public int CompanyID { get; set; }
        public decimal PercentualDescarte { get; set; }
        public bool ProdutoObrigatorio { get; set; }
        public bool ExibirCarrinho { get; set; }
        public bool ExibirListaProdutos { get; set; }
        public string Grupo { get; set; }
        public decimal WeightBase { get; set; }
        public decimal WeightByFoto { get; set; }
        public string ImgThumb { get; set; }
        public string ImgMain { get; set; }
    
        public virtual GRD_Company GRD_Company { get; set; }
        public virtual Products Products { get; set; }
    }
}
