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
    
    public partial class FB_UserToken
    {
        public int ID { get; set; }
        public int User { get; set; }
        public string Token { get; set; }
        public System.DateTime Expiration { get; set; }
        public System.DateTime Date_Auth { get; set; }
    }
}
