using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PH.Formatura.Web.Controllers.Base;
using PH.Formatura.DTO;
using PH.Formatura.BLL;

namespace PH.Formatura.Web.Controllers.API
{
    public class PainelController : BaseAPIController
	{
		public HttpResponseMessage CadastrarUsuarioPJc(FormCadastroUsuarioPessoaJuridicaCompleto Form)
		{
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);

			PainelBLL PainelBll = new PainelBLL(context.db);
			RetornoCadastrarUsuarioPJ Retorno = PainelBll.CadastrarUsuarioPJc(Form, _User);

			return Request.CreateResponse(System.Net.HttpStatusCode.OK, new BaseAPI { Sucesso = Retorno.Sucesso, Mensagem = Retorno.Mensagem });
		}

		public HttpResponseMessage CadastrarUsuarioPJu(FormCadastroUsuarioPessoaJuridicaUsuario Form)
		{
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);

			PainelBLL PainelBll = new PainelBLL(context.db);
			RetornoCadastrarUsuarioPJ Retorno = PainelBll.CadastrarUsuarioPJu(Form, _User);

			return Request.CreateResponse(System.Net.HttpStatusCode.OK, new BaseAPI { Sucesso = Retorno.Sucesso, Mensagem = Retorno.Mensagem });
		}

		public HttpResponseMessage CadastrarUsuarioPF(FormCadastroUsuarioPessoaFisica Form)
		{
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);

			PainelBLL PainelBll = new PainelBLL(context.db);
			RetornoCadastrarUsuarioPF Retorno = PainelBll.CadastrarUsuarioPF(Form, _User);

			return Request.CreateResponse(System.Net.HttpStatusCode.OK, new BaseAPI { Sucesso = Retorno.Sucesso, Mensagem = Retorno.Mensagem });
		}

		[HttpGet]
		public List<RetornoUsuariosCadastrados> UsuariosCadastrados()
		{
			List<RetornoUsuariosCadastrados> Retorno = new List<RetornoUsuariosCadastrados>();
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);

			PainelBLL PainelBll = new PainelBLL(context.db);
			Retorno = PainelBll.RetornarUsuariosCadastrados(_User.Brand_ID);

			return Retorno;
		}
    }
}
