using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using PH.Formatura.BLL;
using PH.Formatura.Log;
using PH.Formatura.Controllers;
using PH.Formatura.Web.Filters;
using PH.Formatura.Web.Filters.API;
using PH.Formatura.Log.Filters;

namespace PH.Formatura.Web
{
	public class MvcApplication : System.Web.HttpApplication
	{
		protected void Application_Start()
		{
			log4net.Config.XmlConfigurator.Configure(new System.IO.FileInfo(HttpContext.Current.Server.MapPath("~/Settings/Log4Net.config")));
			PH.Core.Cache.AutoLoader.Start();

			//Registrando rotas
			AreaRegistration.RegisterAllAreas();
			GlobalConfiguration.Configure(WebApiConfig.Register);
			RouteConfig.RegisterRoutes(RouteTable.Routes);

			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			GlobalFilters.Filters.Add(new AccessFilter());
			GlobalConfiguration.Configuration.Filters.Add(new ApiAuthorizeFilter());

			GlobalConfiguration.Configuration.Filters.Add(new ValidateModelAttribute());
			GlobalConfiguration.Configuration.Filters.Add(new CheckModelForNullAttribute());

            GlobalConfiguration.Configuration.Filters.Add(new WebApiErrorFilterAttribute());
            GlobalFilters.Filters.Add(new MVCFilterExecption());

			Application["Site_URL_HTTP"] = System.Configuration.ConfigurationManager.AppSettings["Site_URL_HTTP"];
			Application["Site_Nicephotos_URL_HTTP"] = System.Configuration.ConfigurationManager.AppSettings["Site_Nicephotos_URL_HTTP"];
			Application["KeyCripto"] = System.Configuration.ConfigurationManager.AppSettings["KeyCripto1"];
			Application["KeyPixel"] = System.Configuration.ConfigurationManager.AppSettings["KeyPixel"];
			Application["Site_Name"] = System.Configuration.ConfigurationManager.AppSettings["Site_Name"];
			Application["WEBAPI_AUTH_URL"] = System.Configuration.ConfigurationManager.AppSettings["WEBAPI_AUTH_URL"];
			Application["Modulo_Montagem_URL"] = System.Configuration.ConfigurationManager.AppSettings["Modulo_Montagem_URL"];
			Application["Modulo_Montagem_URL_DEFAULT"] = System.Configuration.ConfigurationManager.AppSettings["Modulo_Montagem_URL_DEFAULT"];
			Application["Modulo_Montagem_URL_CP7"] = System.Configuration.ConfigurationManager.AppSettings["Modulo_Montagem_URL_CP7"];
			Application["Modulo_Montagem_URL_NABECA"] = System.Configuration.ConfigurationManager.AppSettings["Modulo_Montagem_URL_NABECA"];
			Application["CARRINHO_URL"] = System.Configuration.ConfigurationManager.AppSettings["CARRINHO_URL"];
            Application["CARRINHO_URLCP7"] = System.Configuration.ConfigurationManager.AppSettings["CARRINHO_URLCP7"];
			Application["IMAGES_SERVER_URL_HTTP"] = System.Configuration.ConfigurationManager.AppSettings["IMAGES_SERVER_URL_HTTP"];
			Application["MIN_CSS"] = System.Configuration.ConfigurationManager.AppSettings["MIN_CSS"];
			Application["MIN_JS"] = System.Configuration.ConfigurationManager.AppSettings["MIN_JS"];
			Application["VERSAO_CSS"] = System.Configuration.ConfigurationManager.AppSettings["VERSAO_CSS"];
			Application["VERSAO_JS"] = System.Configuration.ConfigurationManager.AppSettings["VERSAO_JS"];
			Application["MIN_CSS_FRAMEWORK"] = System.Configuration.ConfigurationManager.AppSettings["MIN_CSS_FRAMEWORK"];
			Application["MIN_JS_FRAMEWORK"] = System.Configuration.ConfigurationManager.AppSettings["MIN_JS_FRAMEWORK"];
			Application["BRAND_ID_DEFAULT"] = System.Configuration.ConfigurationManager.AppSettings["BRAND_ID_DEFAULT"];
			Application["Email_Esqueci_Senha_Template_ID"] = System.Configuration.ConfigurationManager.AppSettings["Email_Esqueci_Senha_Template_ID"];
			Application["LOG_EMAIL_ESQUECI_SENHA"] = System.Configuration.ConfigurationManager.AppSettings["LOG_EMAIL_ESQUECI_SENHA"];
			Application["PATH_LOG_EMAIL_ESQUECI_SENHA"] = System.Configuration.ConfigurationManager.AppSettings["PATH_LOG_EMAIL_ESQUECI_SENHA"];
			Application["Hash_Esqueci_Senha_Tempo_Validade_Minutos"] = System.Configuration.ConfigurationManager.AppSettings["Hash_Esqueci_Senha_Tempo_Validade_Minutos"];
			Application["Hash_Esqueci_Senha_Tempo_Requisicao_Intevalo_Minimo_Minutos"] = System.Configuration.ConfigurationManager.AppSettings["Hash_Esqueci_Senha_Tempo_Requisicao_Intevalo_Minimo_Minutos"];
			Application["ALBUNS_UPLOAD_PATH_USERS"] = System.Configuration.ConfigurationManager.AppSettings["ALBUNS_UPLOAD_PATH_USERS"];
			Application["Modulo_Montagem_Config_Loader_Path"] = System.Configuration.ConfigurationManager.AppSettings["Modulo_Montagem_Config_Loader_Path"];
			Application["Modulo_Montagem_CSS_Loader_Path"] = System.Configuration.ConfigurationManager.AppSettings["Modulo_Montagem_CSS_Loader_Path"];
			Application["Modulo_Montagem_Path_SWF"] = System.Configuration.ConfigurationManager.AppSettings["Modulo_Montagem_Path_SWF"];
			Application["Modulo_Montagem_Express_Install"] = System.Configuration.ConfigurationManager.AppSettings["Modulo_Montagem_Express_Install"];

            Application["Site_Nicephotos_Img_Render"] = System.Configuration.ConfigurationManager.AppSettings["Site_Nicephotos_Img_Render"];

            Application["VERSAO_MANIFEST"] = System.Configuration.ConfigurationManager.AppSettings["VERSAO_MANIFEST"];

            Application["Cookie_User_Offline"] = "user_offline";
            Application["USE_MANIFEST"] = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["USE_MANIFEST"]);
            Application["Cookie.Offline.Name"] = System.Configuration.ConfigurationManager.AppSettings["Cookie.Offline.Name"];  
            
			using (EntityContext context = new EntityContext())
			{
				InitAppBLL initBLL = null;
				try
				{
					initBLL = new InitAppBLL(context.db, Application["File_Tags_Conversion"].ToString());
				}
				catch
				{
					//Em caso de erro (ex: banco de dados offline) a aplicação deve ser iniciada, ou seja, não pode cair no método application_error
					//nesse momento ainda não existe um request associado e portando outros erros irão ocorrer.
					//Dessa forma a aplicação é iniciada e se o erro persistir o mesmo será devidamente logado.
					initBLL = null;
				}
			}
		}

		protected void Session_Start()
		{
			Session.Timeout = 60;
		}

		void Application_Error(object sender, EventArgs e)
		{
			//http://msdn.microsoft.com/en-us/library/vstudio/24395wz3(v=vs.100).aspx
			// Code that runs when an unhandled error occurs

			// Get the exception object.
			Exception exc = Server.GetLastError();

			// Handle HTTP errors
			if (exc != null && exc.GetType() == typeof(HttpException))
			{
				// The Complete Error Handling Example generates
				// some errors using URLs with "NoCatch" in them;
				// ignore these here to simulate what would happen
				// if a global.asax handler were not implemented.
				if (exc.Message.Contains("NoCatch") || exc.Message.Contains("maxUrlLength"))
					return;

				//Redirect HTTP errors to HttpError page                
				//Server.Transfer("/Error");
			}

			string url = System.Web.HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path).ToLower();
			if (!url.Contains("/api/"))
			{
				var routeData = new RouteData();
				routeData.Values["controller"] = "Error";
				routeData.Values["action"] = "Index";
				//Response.StatusCode = 500;//Todo considerar colocar 200 por conta do IE
				IController controller = new ErrorController();
				var rc = new RequestContext(new HttpContextWrapper(Context), routeData);
				controller.Execute(rc);
			}
			else
			{
				throw exc;
			}
		}
	}
}