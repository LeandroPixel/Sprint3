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
    
    public partial class GRD_Frete_Hist
    {
        public int id { get; set; }
        public int AlunoTurmaID { get; set; }
        public decimal Custo { get; set; }
        public decimal Valor { get; set; }
        public string FreteTipo { get; set; }
        public string SubTipoFrete { get; set; }
        public int Prazo { get; set; }
        public string ZipCode { get; set; }
        public int Peso { get; set; }
    
        public virtual GRD_Aluno_Turma GRD_Aluno_Turma { get; set; }
    }
}