using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using System.Net;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using System.IO;
using Newtonsoft.Json;
using PH.Formatura.Web.Controllers.Base;
using PH.Formatura.DTO;
using PH.Formatura.BLL;
using PH.Core.ViewModels.Account;
using System.Configuration;
using System.Collections.Specialized;
using System.Web.Routing;

namespace PH.Formatura.Web.Controllers
{
	public class LoginController : BaseMVCController
	{
		//
		// GET: /Login/

		[AllowAnonymous]
		public ActionResult Index(string nomeBrand)
		{            
			User _User = null;
			DadosBrand DadosBrand = new DadosBrand();			

			if (GlobalVarsControl.HasSession())
			{
				_User = (User)GlobalVarsControl.GetVar("userInfo");

				if (_User == null)
				{
					string request_brand = (String.IsNullOrEmpty(Request.QueryString["brand"]) ? System.Web.HttpContext.Current.Application["BRAND_ID_DEFAULT"].ToString() : Request.QueryString["brand"].ToString());
					if (!String.IsNullOrEmpty(request_brand))
					{
						UserBLL bll = new UserBLL(context.db);
						RetornoDadosBrand DadosBrandDB = bll.RetornarDadosBrand(request_brand);

						if (DadosBrandDB != null)
						{
							DadosBrand.Url_Logo = DadosBrandDB.url_logo;
							DadosBrand.Name = DadosBrandDB.name;
						}
					}
				}
			}
			
			ViewBag.DadosBrand = DadosBrand;

			if (Request.Params["ErroLogin"] != null && !String.IsNullOrEmpty(Request.Params["ErroLogin"].ToString())){
				ViewBag.ErroLogin = Request.Params["ErroLogin"].ToString();
			}

			return View();
		}

		[AllowAnonymous]
		public JObject ValidarLogin(FormValidarLogin Dados)
		{
			RetornoValidarLogin Retorno = new RetornoValidarLogin();
			Retorno.Sucesso = false;
			Retorno.Mensagem = String.Empty;

			if (!String.IsNullOrEmpty(Dados.email) && !String.IsNullOrEmpty(Dados.senha))
			{
				UserBLL bll = new UserBLL(context.db);
				Retorno.Sucesso = bll.UsuarioValido(Dados.email, Dados.senha, Dados.brand_id);
			}

			Retorno.Mensagem = (Retorno.Sucesso ? "Usuário validado" : "Informações inválidas");
			Response.ContentType = "application/json";

			return JObject.FromObject(Retorno);
		}

		[AllowAnonymous]
		public ActionResult Logar(FormLogin Dados)
		{
			LoginModel Login = new LoginModel();
			Login.EncriptedPassword = false;
			Login.UserName = Dados.email;
			Login.Password = Dados.senha;
			Login.BrandID = Dados.brand_id;

			Uri uri = new Uri(System.Web.HttpContext.Current.Application["WEBAPI_AUTH_URL"].ToString());
			HttpWebRequest request = HttpWebRequest.CreateHttp(uri);
			request.Method = "POST";
			request.ContentType = "application/json";
			request.Headers.Add("AuthType", "token");
			request.Headers.Add("ReturnDetails", "false");

			Object json = JsonConvert.SerializeObject(Login);

			RetornoLogin Retorno = new RetornoLogin();
			Retorno.token = "";
			Retorno.sucesso = false;

			try
			{
				using (var streamWriter = new StreamWriter(request.GetRequestStream()))
				{
					streamWriter.Write(json);
					streamWriter.Flush();
					streamWriter.Close();
				}

				using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
				{
					if (response.StatusCode != HttpStatusCode.OK)
					{
						throw new Exception(response.StatusDescription);
					}

					if (response.ResponseUri.AbsolutePath.Contains("pagina-nao-encontrada")) { throw new Exception(response.ResponseUri.AbsoluteUri); }

					using (Stream dataStream = response.GetResponseStream() as Stream)
					{
						using (StreamReader reader = new StreamReader(dataStream))
						{
							json = (JObject)JsonConvert.DeserializeObject(reader.ReadToEnd());
						}
					}
				}

				var RetornoAuth = ((JObject)json).ToObject<dynamic>();
				Retorno.sucesso = RetornoAuth.Success;
				Retorno.token = RetornoAuth.Message;
			}
			catch (Exception e)
			{
				Retorno.sucesso = false;
                throw new Exception(e.Message);
				//object Erro_Requisicao = new { ErroLogin = e.Message, InnerException = (e.InnerException != null ? e.InnerException.Message : "") };
			}

			if (Retorno.sucesso)
			{
				UserBLL bll = new UserBLL(context.db);
				User _User = bll.Get(Retorno.token);

				if (_User != null)
				{
					string Host = Request.UserHostAddress != null ? !String.IsNullOrEmpty(Request.UserHostAddress) ? Request.UserHostAddress.ToString() : String.Empty : String.Empty;
					bll.GravarAcesso(_User.User_ID, DateTime.Now, Request.ServerVariables["local_addr"], Host);
				}
                UserCookie userCookie = new UserCookie()
                {
                    Brand = _User.Brand,
                    Brand_ID = _User.Brand_ID,
                    Email = _User.Email,
                    Name = _User.Name,
                    Nickname = _User.Nickname,
                    Senha = bll.getMD5Hash(Dados.senha),
                    Token = _User.Token,
                    url_logo = _User.url_logo,
                    User_ID = _User.User_ID
                };                
                bll.SetCookieUser(Newtonsoft.Json.JsonConvert.SerializeObject(userCookie));                  
				GlobalVarsControl.SetVar("userInfo", _User);
			}

			if (GlobalVarsControl.GetVar("userInfo") != null) {
				Dictionary<string, string> url_destino;
				url_destino = Session["url_destino"] != null ? (Dictionary<string, string>)Session["url_destino"] : null;
                NameValueCollection url_destino_queryString = (NameValueCollection)Session["url_destino_queryString"];

				if (url_destino != null && url_destino.Count > 0)
				{
                    if (url_destino_queryString != null && url_destino_queryString.Count > 0)
                    {
                        RouteValueDictionary routes = new RouteValueDictionary();
                        foreach (var item in url_destino_queryString.AllKeys)
	                        routes.Add(item,url_destino_queryString[item]);
                        return RedirectToAction(url_destino.FirstOrDefault().Value, url_destino.FirstOrDefault().Key, routes);                    
                    }else
                        return RedirectToAction(url_destino.FirstOrDefault().Value, url_destino.FirstOrDefault().Key);
				} else {
					return RedirectToAction("Index", "Painel");
				}
			}
			else
				return RedirectToAction("Index");

			//return JObject.FromObject(Retorno);
		}

		[AllowAnonymous]
		[HttpPost]
		public JObject EsqueciMinhaSenha(FormEsqueciSenha Dados)
		{
			RetornoEsqueciSenha Retorno = new RetornoEsqueciSenha();
			Retorno.Sucesso = false;
			Retorno.Mensagem = "Informações inválidas";

			try
			{
				if (!String.IsNullOrEmpty(Dados.email) && Dados.brand_id != 0)
				{
					string Host = Request.UserHostAddress != null ? !String.IsNullOrEmpty(Request.UserHostAddress) ? Request.UserHostAddress.ToString() : String.Empty : String.Empty;
					UserBLL bll = new UserBLL(context.db);
					Retorno = bll.EsqueciMinhaSenha(Dados.email, Dados.brand_id, Host);
				}
			}
			catch (Exception e)
			{
				Retorno.Mensagem = "Erro: " + e.Message + (e.InnerException != null ? " InnerException: " + e.InnerException.ToString() : "");
			}
			
			Response.ContentType = "application/json";

			return JObject.FromObject(Retorno);
		}

		[AllowAnonymous]
		[HttpGet]
		public ActionResult EsqueciMinhaSenha(string hash)
		{
			DadosValidacaoHash DadosValidacaoHash = new DadosValidacaoHash();
			if (!String.IsNullOrEmpty(hash))
			{
				string Session_Hash = String.Empty;
				if (GlobalVarsControl.HasSession())
					if (Session["Validacao_Alteracao_Senha_Hash"] != null)
						Session_Hash = Session["Validacao_Alteracao_Senha_Hash"].ToString();

				UserBLL bll = new UserBLL(context.db);

				//SE O HASH PASSADO FOR DIFERENTE DO DA SESSÃO, VALIDAR O HASH PASSADO
				hash = hash != Session_Hash ? hash : Session_Hash;
				bool MarcarVerificacao = hash == Session_Hash ? String.IsNullOrEmpty(Session_Hash) : true;

				DadosValidacaoHash = bll.ValidarAlteracaoSenhaHash(hash, MarcarVerificacao);
				if (DadosValidacaoHash.Sucesso)
					Session["Validacao_Alteracao_Senha_Hash"] = DadosValidacaoHash.hash;
			}
			else
			{
				DadosValidacaoHash = null;
			}

			ViewBag.DadosValidacaoHash = DadosValidacaoHash;

			return View(DadosValidacaoHash);
		}

		[AllowAnonymous]
		[HttpPost]
		public JObject EsqueciMinhaSenhaAlteracao(string senha_nova, string senha_nova_confirmacao)
		{
			RetornoEsqueciMinhaSenhaAlteracao Retorno = new RetornoEsqueciMinhaSenhaAlteracao();
			Retorno.Sucesso = false;
			Retorno.Mensagem = String.Empty;

			if (String.IsNullOrEmpty(senha_nova) || String.IsNullOrEmpty(senha_nova_confirmacao)) //TODO: MAIS VALIDAÇÕES)
			{
				Retorno.Mensagem = "Informe as senhas, iguais e com 6 caracteres no mínimo";
			}
			else
			{
				string Session_Hash = String.Empty;
				if (GlobalVarsControl.HasSession())
					if (Session["Validacao_Alteracao_Senha_Hash"] != null)
						Session_Hash = Session["Validacao_Alteracao_Senha_Hash"].ToString();
				
				if (String.IsNullOrEmpty(Session_Hash))
				{
					Retorno.Mensagem = "Sessão expirada. Gere um novo link, tente novamente";
				}
				else
				{
					UserBLL bll = new UserBLL(context.db);
					RetoronoEsqueciMinhaSenhaAlterar Alteracao = bll.EsqueciMinhaSenhaAlterar(Session_Hash, senha_nova);
					Retorno.Sucesso = Alteracao.Sucesso;
					Retorno.Mensagem = Alteracao.Mensagem;

					if (Alteracao.Sucesso)
					{
						Session.Abandon();
					}
				}				
			}
			
			Response.ContentType = "application/json";

			return JObject.FromObject(Retorno);
		}
	}
}
