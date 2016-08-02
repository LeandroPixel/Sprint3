using PH.Formatura.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PH.Formatura.Web.Controllers.API
{
    public class DadosController : Base.BaseAPIController
    {

        [HttpGet]
        [HttpPost]
        public HttpResponseMessage GetListProductConfig()
        {

            List<ProductConfig> LPC = new List<ProductConfig>();

            LPC.Add(new ProductConfig { ID = 1, ProductID = 10, QtdMaxFoto = 0, UsaPrecoPorFoto = false }); //Pendrive
            LPC.Add(new ProductConfig { ID = 2, ProductID = 20, QtdMaxFoto = 40, UsaPrecoPorFoto = true }); //Fotolivro Pq
            LPC.Add(new ProductConfig { ID = 3, ProductID = 30, QtdMaxFoto = 0, UsaPrecoPorFoto = false }); //CD
            LPC.Add(new ProductConfig { ID = 4, ProductID = 40, QtdMaxFoto = 4, UsaPrecoPorFoto = false }); //Porta Retrato Parede
            LPC.Add(new ProductConfig { ID = 5, ProductID = 50, QtdMaxFoto = 100, UsaPrecoPorFoto = true }); //Fotolivro Grande
            LPC.Add(new ProductConfig { ID = 6, ProductID = 60, QtdMaxFoto = 0, UsaPrecoPorFoto = false }); //Porta Retrato Digital
            

            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new { Sucesso = true, Mensagem = "Configuracao de produtos.", ListProductConfig=LPC });
        }

        [HttpGet]
        [HttpPost]
        public HttpResponseMessage GetListTurmaPrecoProducts()
        {

            List<TurmaPrecoProduct> TPC = new List<TurmaPrecoProduct>();

            TPC.Add(new TurmaPrecoProduct { ID = 1, Parcela = 1, Preco = 25.50m, PrecoFoto = 0, ProductID = 1, TurmaID = 1, TurmaPrecoHistID = "COD1" });
            TPC.Add(new TurmaPrecoProduct { ID = 2, Parcela = 2, Preco = 26.50m, PrecoFoto = 0, ProductID = 1, TurmaID = 1, TurmaPrecoHistID = "COD1" });
            TPC.Add(new TurmaPrecoProduct { ID = 3, Parcela = 3, Preco = 27.50m, PrecoFoto = 0, ProductID = 1, TurmaID = 1, TurmaPrecoHistID = "COD1" });
            TPC.Add(new TurmaPrecoProduct { ID = 4, Parcela = 4, Preco = 28.50m, PrecoFoto = 0, ProductID = 1, TurmaID = 1, TurmaPrecoHistID = "COD1" });
            TPC.Add(new TurmaPrecoProduct { ID = 5, Parcela = 5, Preco = 29.50m, PrecoFoto = 0, ProductID = 1, TurmaID = 1, TurmaPrecoHistID = "COD1" });

            TPC.Add(new TurmaPrecoProduct { ID = 6, Parcela = 1, Preco = 1500.00m, PrecoFoto = 0, ProductID = 2, TurmaID = 1, TurmaPrecoHistID = "COD1" });
            TPC.Add(new TurmaPrecoProduct { ID = 7, Parcela = 2, Preco = 1600.00m, PrecoFoto = 0, ProductID = 2, TurmaID = 1, TurmaPrecoHistID = "COD1" });
            TPC.Add(new TurmaPrecoProduct { ID = 8, Parcela = 3, Preco = 1700.00m, PrecoFoto = 0, ProductID = 3, TurmaID = 1, TurmaPrecoHistID = "COD1" });
            TPC.Add(new TurmaPrecoProduct { ID = 9, Parcela = 4, Preco = 1800.00m, PrecoFoto = 0, ProductID = 4, TurmaID = 1, TurmaPrecoHistID = "COD1" });
            TPC.Add(new TurmaPrecoProduct { ID = 10, Parcela = 5, Preco = 1900.00m, PrecoFoto = 0, ProductID = 5, TurmaID = 1, TurmaPrecoHistID = "COD1" });

            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new { Sucesso = true, Mensagem = "Configuracao de preços PRODUTO X TURMA X PARCELA.", ListTurmaPrecoProducts = TPC });
        }

    }
}
