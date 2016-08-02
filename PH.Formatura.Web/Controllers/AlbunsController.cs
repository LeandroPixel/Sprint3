using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PH.Formatura.Web.Controllers
{
    public class AlbunsController : BaseMVCController
    {
        //
		// GET: /Albuns/

		public ActionResult openbook()
		{
			return View();
		}

    }
}
