using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PH.Formatura.BLL;
using PH.Formatura.DTO;
using System.Collections.Specialized;

namespace PH.Formatura.Web.Filters
{
	public class AccessFilter : ActionFilterAttribute
	{
		public override void OnActionExecuting(ActionExecutingContext filterContext)
		{
			User _User = null;
			if (GlobalVarsControl.HasSession())
				_User = (User)GlobalVarsControl.GetVar("userInfo");

			string[] controllersAuthOff = new string[] { "login", "home" };

			var requestContext = filterContext.RequestContext;// System.Web.HttpContext.Current;            
			if (requestContext == null)
				throw new Exception("filterContext.RequestContext == null");

			var currentHTTP = requestContext.HttpContext;
			if (currentHTTP == null)
				throw new Exception("requestContext.HttpContext == null");

			var _controller = requestContext.RouteData.Values.ContainsKey("controller") ? requestContext.RouteData.Values["controller"] : null;
			if (_controller == null)
				throw new Exception("RouteData.Values.controller == null");

			var url = currentHTTP.Request.Url;
			if (url == null)
				throw new Exception("currentHTTP.Request.Url == null");

			string control = _controller.ToString().ToLower();

			bool skipAuthorization = filterContext.ActionDescriptor.GetCustomAttributes(typeof(AllowAnonymousAttribute), true).Count() > 0;

			if (controllersAuthOff.Contains(control) && _User != null){
				filterContext.Result = new RedirectResult("~/Painel/");
				return;
			}
			else if (skipAuthorization)
			{
				base.OnActionExecuting(filterContext);
				return;
			}

			if (_controller != null && !url.GetLeftPart(UriPartial.Path).ToLower().Contains("/api/"))
			{				
				string _action = requestContext.RouteData.Values.ContainsKey("action") ? requestContext.RouteData.Values["action"].ToString().ToLower() : "";
                
				Dictionary<string, string> url_destino = new Dictionary<string, string>();
				url_destino.Add(control, _action);
				HttpContext.Current.Session["url_destino"] = url_destino;
                HttpContext.Current.Session["url_destino_queryString"] = (NameValueCollection)requestContext.HttpContext.Request.QueryString;
								
				if (_User == null)
				{
					filterContext.Result = new RedirectResult("~/Login/");
					return;
				}				
			}

			base.OnActionExecuting(filterContext);
		}
	}
}