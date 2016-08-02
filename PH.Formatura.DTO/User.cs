using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
	public class User
	{
		public int User_ID { get; set; }
		public string Email { get; set; }
		public int? Brand_ID { get; set; }
		public string Brand { get; set; }
		public string Nickname { get; set; }
		public string Name { get; set; }
		public string Token { get; set; }
		public string url_logo { get; set; }
	}

    public class UserCookie : User
    {    
        public string Senha { get; set; }    
    }
}
