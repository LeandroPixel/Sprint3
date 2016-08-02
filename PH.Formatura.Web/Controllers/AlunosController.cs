using PH.Formatura.BLL;
using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PH.Formatura.Web.Controllers
{
    public class AlunosController : BaseMVCController
    {
        //
        // GET: /Aluno/
        public ActionResult Index()        
        {
            AlunoBLL bll = new AlunoBLL(context.db);           
            int[] statusRemovidos = new int[] { 1, 50, 5 };
            
            ViewBag.Status = bll.GetStatus().Where(o=> !statusRemovidos.Contains(o.ID)).ToList();
            return View();
        }
	}
}