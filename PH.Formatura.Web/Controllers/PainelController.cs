using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PH.Formatura.Web.Controllers.Base;
using PH.Formatura.BLL;
using PH.Formatura.DTO;
using Newtonsoft.Json.Linq;

namespace PH.Formatura.Web.Controllers
{
	public class PainelController : BaseMVCController
    {
        //
        // GET: /Painel/

        public ActionResult Index()
        {
			PainelBLL PainelBLL = new PainelBLL(context.db);
			ViewBag.Privilegio = PainelBLL.RetornarPrivilegioUsuario(_User.User_ID);

            return View();
        }

		public ActionResult MontarProjeto()
		{
			ProjetosBLL bll = new ProjetosBLL(context.db);
			List<MontarProjetoDadosProdutos> Dados = bll.RetornarProdutos((int)_User.Brand_ID);

			return View(Dados);
		}

		public ActionResult MontarProjetoModulo(FormMontarProjeto Dados)
		{
			string Url;
			Url = HttpUtility.UrlDecode(System.Web.HttpContext.Current.Application["Modulo_Montagem_URL_DEFAULT"].ToString());
			Url = Url.Replace("[PhotobookLineID]", Dados.PhotobookLineID.ToString());
			Url = Url.Replace("[product_id]", Dados.product_id.ToString());
			Url = Url.Replace("[DefaultNumPages]", Dados.DefaultNumPages.ToString());
			Url = Url.Replace("[shelfPhotobookID]", Dados.shelfPhotobookID.ToString());

			return Redirect(Url);
		}

		public ActionResult ProjetosEmAndamento()
		{
			ProjetosBLL bll = new ProjetosBLL(context.db);
			List<ProjetosEmAndamento> Dados = bll.RetornarProjetosEmAndamento(_User.User_ID);
			ViewBag.DadosProjetosEmAndamento = Dados;

			return View(Dados);
		}

		public ActionResult ProjetosFinalizados()
		{
			ProjetosBLL bll = new ProjetosBLL(context.db);
			List<ProjetosFinalizados> Dados = bll.RetornarProjetosFinalizados(_User.User_ID);
			ViewBag.DadosProjetosFinalizados = Dados;

			return View(Dados);
		}

		public ActionResult Extrato()
		{
			ProjetosBLL bll = new ProjetosBLL(context.db);
			List<ExtratoPedidoPagamento> Dados = bll.RetornarExtratoPedidoPagamento(_User.User_ID);
			ViewBag.DadosExtrato = Dados;
			return View(Dados);
		}

		public ActionResult CadastrarUsuario()
		{
			List<string> EmailsPermitidos = new List<string>();
			EmailsPermitidos.Add("zangraf@zangraf.com.br");

			if (EmailsPermitidos.Contains(_User.Email))
				return View();
			else
				return RedirectToAction("Index");
		}

		public ActionResult CadastrarTurma()
		{
			return View();
		}

		public ActionResult Cadastro()
		{
			PainelBLL bll = new PainelBLL(context.db);
			List<ListaEmpresasCadastroPJ> Dados = bll.RetornarEmpresasCadastroPJ(_User.Brand_ID);
			ViewBag.ListaEmpresasCadastroPJ = Dados;

			ViewBag.AuthToken = _User.Token;

			return View(Dados);
		}

		public ActionResult Alunos()
		{
			return View();
		}

		public ActionResult Carrinho()
		{
			string Url = HttpUtility.UrlDecode(System.Web.HttpContext.Current.Application["CARRINHO_URL"].ToString());
			string KeyCripto = System.Web.HttpContext.Current.Application["KeyCripto"].ToString();
			CriptografiaBLL bll = new CriptografiaBLL();
			string passAccess = bll.Encrypt(_User.User_ID.ToString(), KeyCripto);
			Url = Url.Replace("[passAccess]", passAccess);

			return Redirect(Url);
		}

		public ActionResult EditarProjeto(int book_id)
		{
			string Url = HttpUtility.UrlDecode(System.Web.HttpContext.Current.Application["Modulo_Montagem_URL"].ToString() + "?b=" + book_id.ToString());
			return Redirect(Url);
		}

		public JObject ExcluirProjeto(int book_id)
		{
			ProjetosBLL bll = new ProjetosBLL(context.db);

			bool Sucesso = bll.ExcluirProjeto(book_id, _User.User_ID);
			string Mensagem = (Sucesso ? "Projeto excluido com sucesso" : "Erro ao excluir projeto");

			RetornoExcluirProjeto Retorno = new RetornoExcluirProjeto { Sucesso = Sucesso, Mensagem = Mensagem };
			Response.ContentType = "application/json";

			return JObject.FromObject(Retorno);
		}

		[AllowAnonymous]
		[HttpPost]
		public JObject IsUserLogged()
		{
			bool userIsLogged = GlobalVarsControl.HasSession() && GlobalVarsControl.GetVar("userInfo") != null;
			Response.ContentType = "application/json";
			return JObject.FromObject(new { IsLogged = userIsLogged });
		}
    }
}
