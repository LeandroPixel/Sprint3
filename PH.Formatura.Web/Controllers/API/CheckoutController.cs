using PH.Formatura.BLL;
using PH.Formatura.DTO;
using PH.Formatura.DTO.Checkout;
using PH.Formatura.Log;
using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace PH.Formatura.Web.Controllers.API
{
    public class CheckoutController : BaseAPIController
    {
        [HttpGet]
        [HttpPost]
        public HttpResponseMessage GetAddressByCep(string cep)
        {
            bool Sucesso = true;

            CartBLL cartBLL = new CartBLL(context.db, null, 0);

            Address a = new Address();

            a = cartBLL.GetAddress(cep, User.Token);
            
            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new { Sucesso = Sucesso, Mensagem = "", Address = a });
        }

        [HttpGet]
        [HttpPost]
        public HttpResponseMessage RegisterOrder(DadosCompra dadosPedido)
        {

            CartBLL cartBLL = new CartBLL(context.db, null, User.UserId);

            string remote_Addr = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];

            try
            {
                OrderFormatura aux = new OrderFormatura();
                aux = cartBLL.RegisterOrder(User.Token, dadosPedido, remote_Addr);
                return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new { Sucesso = true, Mensagem = aux.Mensagem, Order = aux });
            }
            catch (Exception ex)
            {
                ErrorControl control = new ErrorControl(ConfigurationManager.AppSettings["ConnError"].ToString());
                string aplicacaoID = ConfigurationManager.AppSettings["PH_Aplicacao_ID"].ToString();
                string site = ConfigurationManager.AppSettings["Site_URL_HTTP"].ToString();
                string localAddr = System.Web.HttpContext.Current.Request.ServerVariables["LOCAL_ADDR"];
                int cod_erro = control.RegisterError(ex, localAddr, true, site, dadosPedido, User.UserId, 0, aplicacaoID);

                return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.InternalServerError, new { Sucesso = false, Mensagem = ex.Message, erro_id = cod_erro });
            }
            
        }

        [HttpGet]
        [HttpPost]
        public HttpResponseMessage GetListProducts(int AlunoTurmaID, string url_base)
        {

            string keyPixel = System.Configuration.ConfigurationManager.AppSettings["KeyPixel"].ToString();

            CartBLL cartBLL = new CartBLL(context.db, null, User.UserId);

            List<CartProductCheckout> item = cartBLL.GetListProducts(User.Brand_id.Value, AlunoTurmaID, User.UserId, keyPixel, url_base);

            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new { Sucesso = true, Mensagem = "Itens recuperados.", List = item });
        }

        [HttpGet]
        [HttpPost]
        public HttpResponseMessage GetListProductsPrice(int brandID, int turmaID)
        {
            PrecosBLL precosbll = new PrecosBLL(context.db);

            var precosInfo = precosbll.Get(brandID, turmaID).ToList();

            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new { Sucesso = true, Mensagem = "Itens recuperados.", List = precosInfo });
        }

        [HttpGet]
        [HttpPost]
        public HttpResponseMessage SyncTeste()
        {
            bool Sucesso = true;
            //TODO sync
            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new { Sucesso = Sucesso, Mensagem = "Pedido sincronizado com sucesso" });
        }

    }
}
