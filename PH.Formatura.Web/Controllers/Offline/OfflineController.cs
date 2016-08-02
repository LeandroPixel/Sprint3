using PH.Formatura.BLL;
using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PH.Formatura.Web.Controllers.Offline
{
    public class OfflineController : BaseMVCController
    {
        [AllowAnonymous]
        public ActionResult Alunos()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult Produtos()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult ValidacaoFotos()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult Painel()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult PedidosPendentes()
        {
            OrderBLL bll = new OrderBLL(context.db);

            ViewBag.TipoPgto = bll.GetTipoPgto().ToList();
            return View();
        }
	}
}