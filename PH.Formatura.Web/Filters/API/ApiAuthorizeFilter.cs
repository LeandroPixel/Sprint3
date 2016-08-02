using PH.Formatura.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Net.Http;

namespace PH.Formatura.Web.Filters.API
{
	/// <summary>
	/// This filter overrides the default ASP.NET security schema and blocks all annonymous request to WebApi
	/// </summary>
	public class ApiAuthorizeFilter : System.Web.Http.AuthorizeAttribute
	{
		/// <summary>
		/// Executed when an autorization is requested.
		/// </summary>
		/// <param name="actionContext"></param>
		public override void OnAuthorization(System.Web.Http.Controllers.HttpActionContext actionContext)
		{
			bool skipAuthorization = actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Count > 0 || actionContext.ActionDescriptor.GetCustomAttributes<System.Web.Http.AllowAnonymousAttribute>().Count > 0;
			if (skipAuthorization)
				return;

			string Token = actionContext.Request.Headers.Contains("AuthToken") ? actionContext.Request.Headers.GetValues("AuthToken").FirstOrDefault() : "";

			if (string.IsNullOrEmpty(Token))
			{
				var queryString = actionContext.Request.GetQueryNameValuePairs().ToDictionary(x => x.Key.ToLower(), x => x.Value);
				Token = queryString.ContainsKey("authtoken") ? queryString["authtoken"] : "";
			}

			if (!string.IsNullOrEmpty(Token))
			{
				PH.Core.ViewModels.Common.User user;
									
				using (EntityContext context = new EntityContext())
				{
					user = new UserBLL(context.db).TokenAuth(Token, System.Web.Security.FormsAuthentication.Timeout);
				}

				if (user == null)
				{
					HandleUnauthorizedRequest(actionContext);
					return;
				}
				ConfigurateUserOnThread(user);
				//base.OnAuthorization(actionContext); // tive que comentar pois estava dando erro
				return;
			}
			

			
			HandleUnauthorizedRequest(actionContext);
		}

		private void ConfigurateUserOnThread(PH.Core.ViewModels.Common.User user)
		{
			if (user != null)
			{
				var identity = new System.Security.Principal.GenericIdentity(user.FullName, "Forms");
				var genericPrincipal = new System.Security.Principal.GenericPrincipal(identity, new string[0]);
				System.Threading.Thread.CurrentPrincipal = genericPrincipal;
				HttpContext.Current.User = user;
			}
		}

		/// <summary>
		/// This method overrides the default Unauthorized Request and Show 401 exception if is a Token Request
		/// </summary>
		protected override void HandleUnauthorizedRequest(System.Web.Http.Controllers.HttpActionContext actionContext)
		{
			if (actionContext.Request.Headers.Contains("AuthToken"))
			{
				string token = actionContext.Request.Headers.GetValues("AuthToken").FirstOrDefault();
				if (string.IsNullOrEmpty(token) || actionContext.Response != null)
					HttpContext.Current.Response.Write("Token not present");
				else
					HttpContext.Current.Response.Write("Invalid token");
			}
			else
				HttpContext.Current.Response.Write("Token not found");

			HttpContext.Current.Response.StatusDescription = System.Net.HttpStatusCode.Unauthorized.ToString();
			HttpContext.Current.Response.StatusCode = (int)System.Net.HttpStatusCode.Unauthorized;
			HttpContext.Current.Response.TrySkipIisCustomErrors = true;
			HttpContext.Current.Response.End();

			base.HandleUnauthorizedRequest(actionContext);
		}
	}
}