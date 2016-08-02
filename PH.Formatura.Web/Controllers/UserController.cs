using Newtonsoft.Json.Linq;
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
	public class UserController : BaseMVCController
    {
        //
        // GET: /User/

        public ActionResult Index()
        {
            return RedirectToAction("Index", "Painel");
        }

		public JObject CadastrarUsuario(FormCadastrarUsuario Dados)
        {
			RetornoCadastrarUsuario Retorno = new RetornoCadastrarUsuario();
			Retorno.Sucesso = false;
			Retorno.Mensagem = String.Empty;

			if (Dados != null)
			{
				UserBLL bll = new UserBLL(context.db);
				Retorno = bll.CadastarUsuario(Dados, _User.User_ID, (int)_User.Brand_ID);
			}
			else
			{
				Retorno.Mensagem = "Dados incorretos";
			}

			Response.ContentType = "application/json";
			return JObject.FromObject(Retorno);
        }

		public ActionResult Logout()
		{
			Session.Clear();
            string cookieOffName= HttpContext.Application["Cookie.Offline.Name"].ToString();
            if (Request.Cookies[cookieOffName] != null)
                Response.Cookies[cookieOffName].Expires = DateTime.Now.AddDays(-1);  
			return RedirectToAction("Index","Home");
		}
    }
}
