using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Net;
using System.Net.Http;
using PH.Formatura.DTO;
using PH.Formatura.BLL;

namespace PH.Formatura.Web.Controllers.API
{
	public class ToolsController : BaseAPIController
	{
		[AllowAnonymous]
		public HttpResponseMessage ip()
		{            
			string Host = HttpContext.Current != null ? HttpContext.Current.Request.UserHostAddress != null ? !String.IsNullOrEmpty(HttpContext.Current.Request.UserHostAddress) ? HttpContext.Current.Request.UserHostAddress.ToString() : String.Empty : String.Empty : String.Empty;
			bool Sucesso = !String.IsNullOrEmpty(Host);
			return Request.CreateResponse(System.Net.HttpStatusCode.OK, new BaseAPI { Sucesso = Sucesso, Mensagem = Host });
		}

		[HttpGet]
		[AllowAnonymous]
        public HttpResponseMessage ping()
		{
			return Request.CreateResponse(System.Net.HttpStatusCode.OK);
		}
	}
}