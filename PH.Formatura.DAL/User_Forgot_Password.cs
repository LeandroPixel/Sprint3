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
    
    public partial class User_Forgot_Password
    {
        public int ID { get; set; }
        public string Email { get; set; }
        public int User_ID { get; set; }
        public string Hash { get; set; }
        public Nullable<System.DateTime> Dt_Verificacao_Hash { get; set; }
        public Nullable<System.DateTime> Dt_Alteracao_Senha { get; set; }
        public bool Fl_Ativo { get; set; }
        public System.DateTime Dt_Inclusao { get; set; }
        public string Host { get; set; }
    
        public virtual Users Users { get; set; }
    }
}
