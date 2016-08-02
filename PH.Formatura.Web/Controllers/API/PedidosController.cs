using Newtonsoft.Json.Linq;
using PH.Formatura.BLL;
using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PH.Formatura.DTO;

namespace PH.Formatura.Web.Controllers.API
{
    public class PedidosController : BaseAPIController
    {
        [HttpGet]
        public JArray Realizados()
        {
            UserBLL UserBll = new UserBLL(context.db);
            User _User = UserBll.Get(User.Token);
            OrderBLL bll = new OrderBLL(context.db);
            return bll.GetPedidosRealizados(_User.User_ID);
        }
    }
}
