using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PH.Formatura.Controllers
{
	public class ErrorController : System.Web.Mvc.Controller
	{
		//
		// GET: /Error/
		[AllowAnonymous]
		public ActionResult Index()
		{
			try
			{
				//Exception exc = (Exception)Session["exception"];
				//Exception exc = Server.GetLastError();                
				Exception exc = HttpContext.Error;

				if (exc.InnerException != null)
				{
					exc = exc.InnerException;
				}

				ViewBag.Message = exc.Message;
				ViewBag.StackTrace = exc.StackTrace;

				if (exc.Data["ID"] != null)
					ViewBag.CodErro = exc.Data["ID"].ToString();
				else
					ViewBag.CodErro = "PX ERRO NÃO TRATADO";// + (int)TraceCodigo.ph_cart_excessao_nao_tratada; //Erro nao definido

				//if (exc is ITraceCustomException)
				//	ViewBag.CodErro = "PX" + (exc as ITraceCustomException).cod_erro;

				exc = null;
				Server.ClearError();

			}
			catch (Exception)
			{
				//para não dar erro na hora de exibir o erro
			}
			return View();
		}
	}
}
