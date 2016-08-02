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
    
    public partial class GRD_Aluno_Turma
    {
        public GRD_Aluno_Turma()
        {
            this.GRD_Boleto = new HashSet<GRD_Boleto>();
            this.GRD_Cart_Product = new HashSet<GRD_Cart_Product>();
            this.GRD_Order_Product_Photos = new HashSet<GRD_Order_Product_Photos>();
            this.GRD_Order_Product = new HashSet<GRD_Order_Product>();
            this.GRD_Frete_Hist = new HashSet<GRD_Frete_Hist>();
        }
    
        public int ID { get; set; }
        public int AlunoID { get; set; }
        public int TurmaID { get; set; }
        public Nullable<int> VendedorID { get; set; }
        public string Nome { get; set; }
        public string CodigoAlunoTurma { get; set; }
        public string CodigoCP7 { get; set; }
        public string IDInternoCP7 { get; set; }
        public Nullable<int> ProductID { get; set; }
        public Nullable<int> QtdFotosAcervo { get; set; }
    
        public virtual GRD_Aluno GRD_Aluno { get; set; }
        public virtual GRD_Turma GRD_Turma { get; set; }
        public virtual ICollection<GRD_Boleto> GRD_Boleto { get; set; }
        public virtual ICollection<GRD_Cart_Product> GRD_Cart_Product { get; set; }
        public virtual ICollection<GRD_Order_Product_Photos> GRD_Order_Product_Photos { get; set; }
        public virtual ICollection<GRD_Order_Product> GRD_Order_Product { get; set; }
        public virtual Products Products { get; set; }
        public virtual ICollection<GRD_Frete_Hist> GRD_Frete_Hist { get; set; }
        public virtual GRD_Vendedor GRD_Vendedor { get; set; }
        public virtual GRD_Aluno_Pacote GRD_Aluno_Pacote { get; set; }
    }
}
