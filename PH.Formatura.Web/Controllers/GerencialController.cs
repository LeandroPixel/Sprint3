using PH.Formatura.BLL;
using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PH.Formatura.Web.Controllers
{
	public class GerencialController : BaseMVCController
	{
		//
		// GET: /Gerencial/
		public ActionResult Index()
		{
			return View();
		}

		//
		// GET: /Gerencial/Pedidos
		public ActionResult Pedidos()
		{
			return View();
		}

		//
		// GET: /Gerencial/Fotos
		public ActionResult FotosPedidos()
		{
			return View();
		}

		//
		// GET: /Gerencial/FaturamentoDiario
		public ActionResult FaturamentoDiario()
		{
			return View();
		}

		//
		// GET: /Gerencial/FaturamentoMensal
		public ActionResult FaturamentoMensal()
		{
			return View();
		}

		

		//
		// GET: /Gerencial/IntegracaoCP7Vendas
		public ActionResult IntegracaoCP7Vendas()
		{
			return View();
		}

		//
		// GET: /Gerencial/IntegracaoCP7VendasItens
		public ActionResult IntegracaoCP7VendasItens()
		{
			return View();
		}

		//
		// GET: /Gerencial/IntegracaoCP7VendasParcela
		public ActionResult IntegracaoCP7VendasParcela()
		{
			return View();
		}

        public ActionResult DetalhesPedido(int OrderID) {
            GerencialBLL GerencialBLL = new GerencialBLL(context.db);
            var FotosPedido = GerencialBLL.ListFotosPedido(OrderID);

            var VendasPedido = GerencialBLL.ListIntegracaoCP7VendasPedido(OrderID);

            var ParcelasPedido = GerencialBLL.ListIntegracaoCP7VendasParcelaPedido(OrderID);

            var ItensPedido = GerencialBLL.ListIntegracaoCP7VendasItensPedido(OrderID);

            ViewBag.FotosPedido = FotosPedido;
            ViewBag.VendasPedido = VendasPedido;
            ViewBag.ParcelasPedido = ParcelasPedido;
            ViewBag.ItensPedido = ItensPedido;

            return View();
        }
	}
}