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
    
    public partial class GRD_Address
    {
        public GRD_Address()
        {
            this.GRD_PessoaFisica = new HashSet<GRD_PessoaFisica>();
            this.GRD_PessoaJuridica = new HashSet<GRD_PessoaJuridica>();
        }
    
        public int id { get; set; }
        public string Title { get; set; }
        public string AddressLine { get; set; }
        public string AddressNumber { get; set; }
        public string AddressComplement { get; set; }
        public string Neighbourhood { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string ZipCode { get; set; }
    
        public virtual ICollection<GRD_PessoaFisica> GRD_PessoaFisica { get; set; }
        public virtual ICollection<GRD_PessoaJuridica> GRD_PessoaJuridica { get; set; }
    }
}
