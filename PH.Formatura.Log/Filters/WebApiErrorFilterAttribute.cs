using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Filters;

namespace PH.Formatura.Log.Filters
{
    public class WebApiErrorFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {            
            ErrorControl control = new ErrorControl(ConfigurationManager.AppSettings["ConnError"].ToString());
            string localAddr = System.Web.HttpContext.Current.Request.ServerVariables["LOCAL_ADDR"];
            string PH_Aplicacao_ID = ConfigurationManager.AppSettings["PH_Aplicacao_ID"].ToString();

            //obter o usuário pelo header quando possivel
            string token = (from p in context.Request.Headers
                            where p.Key.Equals("AuthToken")
                            select p.Value.FirstOrDefault()).FirstOrDefault();

            int? userID = null;
            if (!string.IsNullOrEmpty(token))
                userID = control.GetUserID(token);

            StringBuilder erro_entity = new StringBuilder();
            if (context.Exception is System.Data.Entity.Validation.DbEntityValidationException)
            {
                var erro = (System.Data.Entity.Validation.DbEntityValidationException)context.Exception;
                erro_entity.Append(erro.Message);
                if (erro.EntityValidationErrors != null)
                {
                    foreach (var item in erro.EntityValidationErrors)
                    {
                        foreach (var except in item.ValidationErrors)
                            erro_entity.AppendFormat("Prop:{0} Erro:{1}", except.PropertyName, except.ErrorMessage);
                    }
                }

                if (context.Exception.Data != null)
                    context.Exception.Data.Add("erro_entity", erro_entity.ToString());

            }

            int? codErro = control.GetCodErro(context.Exception);

            int id = control.RegisterError(context.Exception, localAddr, true, context.Request.RequestUri.ToString(), userID, codErro, PH_Aplicacao_ID);

            string str;

            if (context.Exception is NotImplementedException)
                context.Response = new System.Net.Http.HttpResponseMessage(HttpStatusCode.NotImplemented);
            //else if (context.Exception is Trace.TraceException)
            //{
            //    Trace.TraceException traceEx = (Trace.TraceException)context.Exception;
            //    str = Newtonsoft.Json.JsonConvert.SerializeObject(
            //    new
            //    {
            //        Success = false,
            //        CodErro = "PX" + traceEx.cod_erro,
            //        ID = id,
            //        Message = context.Exception.Message
            //    }
            //    );
            //    context.Response = new System.Net.Http.HttpResponseMessage(HttpStatusCode.InternalServerError) { Content = new StringContent(str) };
            //    context.Response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            //}
            else
            {
                str = Newtonsoft.Json.JsonConvert.SerializeObject(
                new
                {
                    Success = false,
                    CodErro = id,
                    ID = id,
                    Message = context.Exception.Message
                });

                //Trace.TraceInfo t = new Trace.TraceInfo();
                //t.status = Trace.TraceStatus.ERRO;
                //t.user_id = userID.GetValueOrDefault(0);
                //t.metodo = "OnException";
                //t.classe = "WebApiErrorFilterAttribute";
                //t.addOcorrencia("Erro_generico", str, Trace.TraceCodigo.ph_cart_excessao_nao_tratada);

                context.Response = new System.Net.Http.HttpResponseMessage(HttpStatusCode.InternalServerError) { Content = new StringContent(str) };
                context.Response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            }
        }
    }
}
