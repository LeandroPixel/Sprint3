using PH.Formatura.BLL;
using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PH.Formatura.Web.Controllers
{
	public class SupervisorController : BaseMVCController
    {
        //
        // GET: /Supervisor/AssociaAlunoVendedor/
		public ActionResult AssociaAlunoVendedor(){
            SupervisorBLL bll = new SupervisorBLL(context.db);           

            ViewBag.Vendedor = bll.GetVendedores().ToList();
			
			return View();
        }
	}
}