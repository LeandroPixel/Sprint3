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
    
    public partial class GRD_AlunoTurma_Photos
    {
        public int ID { get; set; }
        public int AlunoTurmaID { get; set; }
        public int AlbumID { get; set; }
        public int PhotoID { get; set; }
        public int itemOrder { get; set; }
        public int PageType { get; set; }
    
        public virtual albums albums { get; set; }
        public virtual Photos Photos { get; set; }
    }
}
