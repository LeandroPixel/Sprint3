using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using PH.Formatura.BLL;
using	PH.Formatura.Web.Filters.API;

namespace PH.Formatura.Web.Controllers.Base
{
	public class BaseAPIController : ApiController
	{
		protected EntityContext context = new EntityContext();

		public BaseAPIController()
		{

		}

		protected override void Dispose(bool disposing)
		{
			if (context != null)
			{
				context.Dispose();
			}
			base.Dispose(disposing);
		}

		public HttpResponseMessage TrataArgumentException(ArgumentException a)
		{
			string paramName = a.ParamName != null ? a.ParamName : "1";
			ModelState.AddModelError(paramName, a.Message);
			return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
		}

		protected static new PH.Core.ViewModels.Common.User User
		{
			get { return HttpContext.Current.User as PH.Core.ViewModels.Common.User; }
		}
	}
}