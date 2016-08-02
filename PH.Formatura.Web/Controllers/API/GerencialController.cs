using Newtonsoft.Json.Linq;
using PH.Formatura.BLL;
using PH.Formatura.DTO;
using PH.Formatura.Web.Controllers.Base;
using System.Net.Http;
using System.Web.Http;

namespace PH.Formatura.Web.Controllers.API
{
	public class GerencialController : BaseAPIController
	{

		[HttpGet]
		public JArray ListPedidos()
		{
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);
			GerencialBLL GerencialBLL = new GerencialBLL(context.db);
			return GerencialBLL.ListPedidos(_User.Brand_ID.Value);
		}

		[HttpGet]
		public JArray ListFotosPedidos()
		{
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);
			GerencialBLL GerencialBLL = new GerencialBLL(context.db);
			return GerencialBLL.ListFotosPedidos(_User.Brand_ID.Value);
		}

		[HttpGet]
		public JArray ListFaturamentoDiario()
		{
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);
			GerencialBLL GerencialBLL = new GerencialBLL(context.db);
			return GerencialBLL.ListFaturamentoDiario(_User.Brand_ID.Value);
		}

		[HttpGet]
		public JArray ListFaturamentoMensal()
		{
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);
			GerencialBLL GerencialBLL = new GerencialBLL(context.db);
			return GerencialBLL.ListFaturamentoMensal(_User.Brand_ID.Value);
		}

		[HttpGet]
		public JArray ListIntegracaoCP7Vendas()
		{
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);
			GerencialBLL GerencialBLL = new GerencialBLL(context.db);
			return GerencialBLL.ListIntegracaoCP7Vendas(_User.Brand_ID.Value);
		}

		[HttpGet]
		public JArray ListIntegracaoCP7VendasItens()
		{
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);
			GerencialBLL GerencialBLL = new GerencialBLL(context.db);
			return GerencialBLL.ListIntegracaoCP7VendasItens(_User.Brand_ID.Value);
		}

		[HttpGet]
		public JArray ListIntegracaoCP7VendasParcela()
		{
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);
			GerencialBLL GerencialBLL = new GerencialBLL(context.db);
			return GerencialBLL.ListIntegracaoCP7VendasParcela(_User.Brand_ID.Value);
		}
	}
}