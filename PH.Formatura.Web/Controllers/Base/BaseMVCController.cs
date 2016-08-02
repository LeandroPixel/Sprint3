using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using PH.Formatura.BLL;
using PH.Formatura.DTO;
using System.Reflection;

namespace PH.Formatura.Web.Controllers.Base
{
	public class BaseMVCController : System.Web.Mvc.Controller
	{
		private string _controller;
		public string ControllerName
		{
			get
			{
				return _controller;
			}
		}
		private string _action;
		public string ActionName
		{
			get
			{
				return _action;
			}
		}

		public User _User { get; set; }

		protected EntityContext context = new EntityContext();

		public readonly string keyCripto;

		public BaseMVCController()
		{
			var currentHTTP = System.Web.HttpContext.Current;
			_controller = currentHTTP.Request.RequestContext.RouteData.Values["controller"].ToString();
			_action = currentHTTP.Request.RequestContext.RouteData.Values["action"].ToString();
			keyCripto = currentHTTP.Application["KeyCripto"].ToString();
			_User = (User)GlobalVarsControl.GetVar("userInfo");
			ViewData["_User"] = _User;
		}
		
		public void Flush(ActionResult action)
		{
			action.ExecuteResult(ControllerContext);
			//resolvendo bug IE limite de caracteres para response.flush, favor não remover
			Response.Write("<!--");
			Response.Write(new string('*', 256));
			Response.Write("-->");
			Response.Flush();
		}

		protected override void Dispose(bool disposing)
		{
			if (context != null)
			{
				context.Dispose();
			}
			base.Dispose(disposing);
		}

		protected string[] GetActions()
		{
			Assembly asm = Assembly.GetExecutingAssembly();
			var metodos = asm.GetTypes()
							.Where(type => this.GetType().IsAssignableFrom(type)) //filter controllers
							.SelectMany(type => type.GetMethods())
							.Where(method => method.ReturnType == typeof(ActionResult) && method.IsPublic && !method.IsDefined(typeof(System.Web.Mvc.NonActionAttribute))).ToList();

			return metodos.Select(o => o.Name).ToArray();
		}

		private static List<Metodos> GetAllActions()
		{
			Assembly asm = Assembly.GetExecutingAssembly();
			var metodos = asm.GetTypes()
							.SelectMany(type => type.GetMethods())
							.Where(method => method.ReturnType == typeof(ActionResult) && method.IsPublic && !method.IsDefined(typeof(System.Web.Mvc.NonActionAttribute)) && method.GetParameters().Where(o => o.DefaultValue != null).Count() == 0).ToList();

			return metodos.Select(o => new Metodos() { Classe = o.DeclaringType.Name, Metodo = o.Name }).ToList();
		}
	}
}
