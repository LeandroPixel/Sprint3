using PH.Formatura.BLL;
using PH.Formatura.DTO;
using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PH.Formatura.Web.Controllers
{
    public class HomeController : BaseMVCController
    {
        //
        // GET: /Home/
		
		[AllowAnonymous]
        public ActionResult Index(string id)
        {
            
			Dictionary<string, string> QueryString = new Dictionary<string,string>();
			
			foreach (var item in Request.QueryString)
			{
				QueryString.Add(item.ToString(), Request.QueryString[item.ToString()]);
			};

			var x = Request.QueryString.ToString();
			var y = Request.QueryString;
			
			return RedirectToAction("Index", "Login");
        }

		[AllowAnonymous]
		[NonAction]
		public T GetFromQueryString<T>() where T : new()
		{
			var obj = new T();
			var properties = typeof(T).GetProperties();
			foreach (var property in properties)
			{
				object value = this.Parse(property.PropertyType, property.PropertyType.ToString());

				if (value == null)
					continue;

				property.SetValue(obj, value, null);
			}
			return obj;
		}

		[AllowAnonymous]
		[NonAction]
		public object Parse(Type dataType, string ValueToConvert)
		{
			System.ComponentModel.TypeConverter obj = System.ComponentModel.TypeDescriptor.GetConverter(dataType);
			object value = obj.ConvertFromString(null, System.Globalization.CultureInfo.InvariantCulture, ValueToConvert);
			return value;
		}

    }
}
