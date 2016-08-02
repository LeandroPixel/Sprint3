using PH.Formatura.DTO;
using PH.Formatura.BLL;
using PH.Formatura.BLL.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PH.Formatura.Web.Controllers
{
    public class CheckoutController : Base.BaseMVCController
    {
        //
        // GET: /Checkout/
        [AllowAnonymous]
        public ActionResult Index()
        {
            
			LocaisBLL LocaisBLL = new LocaisBLL();

			ViewData["Estados"] = LocaisBLL.GetEstados();

            
            return View();
        }

		[AllowAnonymous]
        public ActionResult Confirm()
        {
            return View();
        }
	}
}