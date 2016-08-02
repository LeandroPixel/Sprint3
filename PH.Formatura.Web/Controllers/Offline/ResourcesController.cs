using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PH.Formatura.Web.Controllers.Offline
{
    public class ResourcesController : BaseMVCController
    {
        [AllowAnonymous]
        public ActionResult Manifest() {
            string versaoCSS = System.Web.HttpContext.Current.Application["VERSAO_CSS"].ToString();
            string versaoJS = System.Web.HttpContext.Current.Application["VERSAO_JS"].ToString();
            string versaoManifest = System.Web.HttpContext.Current.Application["VERSAO_MANIFEST"].ToString();
            bool minjs = System.Web.HttpContext.Current.Application["MIN_JS"].ToString() == "1" ? true : false;
            bool mincss = System.Web.HttpContext.Current.Application["MIN_CSS"].ToString() == "1" ? true : false;
            bool minjsFW = System.Web.HttpContext.Current.Application["MIN_JS_FRAMEWORK"].ToString() == "1" ? true : false;
            bool mincssFW = System.Web.HttpContext.Current.Application["MIN_CSS_FRAMEWORK"].ToString() == "1" ? true : false;
            bool useManifest = Convert.ToBoolean(System.Web.HttpContext.Current.Application["USE_MANIFEST"]);
            string imgServer = System.Web.HttpContext.Current.Application["IMAGES_SERVER_URL_HTTP"].ToString();

            string AppPath = @System.Web.HttpContext.Current.Request.ApplicationPath;
            AppPath = ((AppPath.Substring(0, 1) == "/" ? AppPath : "/" + AppPath).Length == 1 ? "" : (AppPath.Substring(0, 1) == "/" ? AppPath : "/" + AppPath));

            var pages = new List<string>();
            pages.Add(AppPath + "/");
            pages.Add(Url.Action("Alunos", "Offline"));
            pages.Add(Url.Action("Produtos", "Offline"));
            pages.Add(Url.Action("Index", "Checkout"));
            pages.Add(Url.Action("ValidacaoFotos", "Offline"));
            pages.Add(Url.Action("Painel", "Offline"));
            pages.Add(Url.Action("Confirm", "Checkout"));
            pages.Add(Url.Action("PedidosPendentes", "Offline"));
            pages.Add(Url.Action("Index", "Support"));

            var cacheResources = new List<string>();                                    
            List<string> fonts = GetRelativePathsToRoot("~/Content/css/fonts/").ToList();
            List<string> framework = GetRelativePathsToRoot("~/Content/css/framework/").ToList();
            List<string> fontes = GetRelativePathsToRoot("~/Content/fontes/").ToList();
            List<string> images = GetRelativePathsToRoot("~/Content/images/").ToList();
            images.RemoveAll(o => o.ToLower().Contains(".db"));
            List<string> frameworkJS = GetRelativePathsToRoot("~/Content/js/framework/").ToList();
            if (minjsFW)
                frameworkJS.RemoveAll(o => !o.ToString().ToLower().Contains(".min.js"));
            else
                frameworkJS.RemoveAll(o => o.ToString().ToLower().Contains(".min.js"));
            //for (int i = 0; i < frameworkJS.Count; i++)
            //    frameworkJS[i] = frameworkJS[i].Replace(".js", ".js?v=" + versaoJS);

            if (mincssFW)
                framework.RemoveAll(o => !o.ToString().ToLower().Contains(".min.css"));
            else
                framework.RemoveAll(o => o.ToString().ToLower().Contains(".min.css"));
            //for (int i = 0; i < framework.Count; i++)
            //    framework[i] = framework[i].Replace(".css", ".css?v=" + versaoCSS);      
            
            cacheResources.AddRange(pages);
            cacheResources.AddRange(fonts);
            cacheResources.AddRange(framework);
            cacheResources.AddRange(fontes);
            cacheResources.AddRange(images);   
            cacheResources.AddRange(frameworkJS);

			

            cacheResources.Add(AppPath + "/Content/js/framework/md5" + (minjs ? ".min" : "") + ".js");
            cacheResources.Add(AppPath + "/Content/bootstrap-table-master/src/bootstrap-table" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            cacheResources.Add(AppPath + "/Content/bootstrap-table-master/src/locale/bootstrap-table-pt-BR" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            cacheResources.Add(AppPath + "/Content/js/framework/swiper" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
			cacheResources.Add(AppPath + "/Content/js/framework/isotope.pkgd" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            
            cacheResources.Add(AppPath + "/Content/js/DbControl" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
			cacheResources.Add(AppPath + "/Content/js/offline" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
			cacheResources.Add(AppPath + "/Content/js/util" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            cacheResources.Add(AppPath + "/Content/js/geral" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            cacheResources.Add(AppPath + "/Content/js/login" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
			cacheResources.Add(AppPath + "/Content/js/login-offline" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
			cacheResources.Add(AppPath + "/Content/js/painel" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
			cacheResources.Add(AppPath + "/Content/js/painel-offline" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            cacheResources.Add(AppPath + "/Content/js/aluno-offline" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            cacheResources.Add(AppPath + "/Content/js/produtos-offline" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            cacheResources.Add(AppPath + "/Content/js/checkout" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            cacheResources.Add(AppPath + "/Content/js/agendamento-validacao-fotos-offline" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            cacheResources.Add(AppPath + "/Content/js/checkout_classes" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            cacheResources.Add(AppPath + "/Content/js/pedidos-pendentes" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
			cacheResources.Add(AppPath + "/Content/js/checkout_confirm" + (minjs ? ".min" : "") + ".js?v=" + versaoJS);
            
            cacheResources.Add(AppPath + "/Content/bootstrap-table-master/src/bootstrap-table" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
            
            cacheResources.Add(AppPath + "/Content/css/framework/swiper" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
            
            cacheResources.Add(AppPath + "/Content/css/geral" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
            cacheResources.Add(AppPath + "/Content/css/login" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
            cacheResources.Add(AppPath + "/Content/css/produtos" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
			cacheResources.Add(AppPath + "/Content/css/checkout" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
			cacheResources.Add(AppPath + "/Content/css/agendamento-validacao-fotos" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
            cacheResources.Add(AppPath + "/Content/css/agendamento_responsivo" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
			cacheResources.Add(AppPath + "/Content/css/offline-alunos" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
            cacheResources.Add(AppPath + "/Content/css/offline-alunos-responsivo" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
			cacheResources.Add(AppPath + "/Content/css/painel" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
			cacheResources.Add(AppPath + "/Content/css/checkout_confirm" + (mincss ? ".min" : "") + ".css?v=" + versaoCSS);
            
            cacheResources.Add(imgServer + "/albuns/images/logo_pixel.png");
            cacheResources.Add(imgServer + "/albuns/images/bg_albuns.jpg");
            cacheResources.Add(imgServer + "/albuns/images/loader-btn.gif");
            cacheResources.Add(imgServer + "/albuns/images/loader.gif");
            cacheResources.Add(imgServer + "/albuns/images/loader-input.gif");
            cacheResources.Add(imgServer + "/albuns/images/bg_login_fdv.jpg");
            cacheResources.Add(imgServer + "/albuns/images/agendamento/check_ok.jpg");            

            var fallbackResources = new Dictionary<string,string>();
            fallbackResources.Add(Url.Action("Index","Painel"), Url.Action("Index", "Login"));
            fallbackResources.Add(Url.Action("Index", "Alunos"), Url.Action("Index", "Login"));
            fallbackResources.Add(Url.Action("Index", "Produtos"), Url.Action("Index", "Login"));                 
            //fallbackResources.Add("/", Url.Action("Login", "Offline"));     

            var networkResources = new List<string>();
            networkResources.Add("*");            
            //networkResources.Add(Url.Action("Index", "Painel"));



            if (!useManifest)
            {
                cacheResources.Clear();
                fallbackResources.Clear();
            }

            var manifestResult = new ManifestResult(versaoManifest + "." + versaoCSS + "." + versaoJS)
            {
                NetworkResources = networkResources,//new List<string>(){ "*" },
                CacheResources = cacheResources,
                FallbackResources = fallbackResources
            };

            return manifestResult;
        }

        [NonAction]
        private IEnumerable<string> GetRelativePathsToRoot(string virtualPath)
        {
            var physicalPath = Server.MapPath(virtualPath);
            var absolutePaths = Directory.GetFiles(physicalPath, "*.*", SearchOption.AllDirectories);

            return absolutePaths.Select(
                x => Url.Content(virtualPath + x.Replace(physicalPath, ""))
            );
        }
	}
}