using PH.Formatura.DTO;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PH.Formatura.Log.Filters
{
    public class MVCFilterExecption : HandleErrorAttribute
    {        
        public override void OnException(ExceptionContext context)
        {
            ErrorControl control = new ErrorControl(ConfigurationManager.AppSettings["ConnError"].ToString());
            string PH_Aplicacao_ID = ConfigurationManager.AppSettings["PH_Aplicacao_ID"].ToString();

            string localAddr = context.HttpContext.Request.ServerVariables["LOCAL_ADDR"];

            //TODO caso as informações não sejam mais armazenadas nas variáveis de sessão esse trecho deve ser alterado
            User u = (User)(context.HttpContext.Session != null ? context.HttpContext.Session["userInfo"] : null);

            int? userID = null;
            if (u != null)
                userID = u.User_ID;

            int? codErro = control.GetCodErro(context.Exception);

            int id = control.RegisterError(context.Exception, localAddr, false, context.HttpContext.Request.Url.ToString(), userID, codErro, PH_Aplicacao_ID);
            context.Exception.Data.Add("ID", id);
        }        
    }
}
