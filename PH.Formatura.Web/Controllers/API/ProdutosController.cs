 using PH.Formatura.BLL;
using PH.Formatura.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PH.Formatura.Web.Controllers.API
{
    public class ProdutosController : Base.BaseAPIController
    {
        [HttpPost]
        public HttpResponseMessage SaveCartProduct(CartProduct product)
        {

            CartBLL cartBLL = new CartBLL(context.db);

            cartBLL.InserUpdateCartProduct(product);

            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new
            {
                Sucesso = true,
                Mensagem = "Item incluido no bd.",
            });
        }

        [HttpPost]
        public HttpResponseMessage DeleteItemCartProduct(CartProduct product)
        {

            CartBLL cartBLL = new CartBLL(context.db);

            cartBLL.DeleteItemCartProduct(product);

            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new
            {
                Sucesso = true,
                Mensagem = "Item excluido do bd.",
            });
        }

        [HttpPost]
        public HttpResponseMessage DeleteAllItensCart(CartProductBase model)
        {

            CartBLL cartBLL = new CartBLL(context.db);

            cartBLL.DeleteAllItensCart(model);

            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new
            {
                Sucesso = true,
                Mensagem = "Item excluido do bd.",
            });
        }

        [HttpPost]
        public HttpResponseMessage ProductionStatus(CartProduct product)
        {

            CartBLL cartBLL = new CartBLL(context.db);

            cartBLL.DeleteItemCartProduct(product);

            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new
            {
                Sucesso = true,
                Mensagem = "Item excluido do bd.",
            });
        }

    }
}
