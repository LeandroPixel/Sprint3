using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace PH.Formatura.BLL
{
	public class GlobalVarsControl
	{
		public static void SetVar(string nameVar, object o)
		{
			HttpContext.Current.Session[nameVar] = o;
		}

		public static object GetVar(string nameVar)
		{
			return HttpContext.Current.Session[nameVar];
		}

		public static bool HasSession()
		{
			return HttpContext.Current.Session != null;
		}
	}
}
