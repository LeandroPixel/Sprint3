using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PH.Formatura.Web.Controllers
{
    public class SupportController : Controller
    {
        //
        // GET: /Support/
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View();
        }
	}
}