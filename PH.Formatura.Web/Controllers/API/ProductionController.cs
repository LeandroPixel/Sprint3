using Newtonsoft.Json.Linq;
using PH.Formatura.BLL;
using PH.Formatura.DTO.Production;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;

namespace PH.Formatura.Web.Controllers.API
{
    public class ProductionController : Base.BaseAPIController
    {
        [HttpGet]
        public HttpResponseMessage Status(DateTime dtUltimaAtualizacao)
        {
            //if (string.IsNullOrEmpty(dtUltimaAtualizacao))            
            //    return TrataArgumentException(new ArgumentException("dtUltimaAtualizacao não pode ser vazio ou nulo","dtUltimaAtualizacao"));
            //
            //DateTime dataInicial;
            //bool ok = DateTime.TryParse(dtUltimaAtualizacao, null, System.Globalization.DateTimeStyles.RoundtripKind, out dataInicial);
            //if (ok == false)
            //    return TrataArgumentException(new ArgumentException("dtUltimaAtualizacao [" + dtUltimaAtualizacao + "] inválido para o padrão ISO_8601", "dtUltimaAtualizacao"));            
            
            ProductionBLL bll = new ProductionBLL(context.db);            
            JArray produtos = bll.GetStatus(User.Brand_id, dtUltimaAtualizacao);

            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, produtos);
        }
    }
}
