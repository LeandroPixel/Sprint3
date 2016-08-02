using PH.Formatura.BLL;
using PH.Formatura.DTO.Agendamento;
using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PH.Formatura.Web.Controllers
{
    public class AgendamentoController : BaseMVCController
    {
        public ActionResult ValidacaoFotos(string a)
        {            
            int aux;
            decimal aux2;
            bool aux3; 

            string keyPixel = HttpContext.Application["KeyPixel"].ToString();

            if (string.IsNullOrEmpty(a))
                throw new Exception("Parâmetros nao enviado para a página de validacao de fotos");

            string Parametros = PH.Formatura.BLL.Util.Cript.DecriptRC4(keyPixel, a);
            string[] splitParam = Parametros.Split(new char[] { '|' });
            if (splitParam.GetUpperBound(0) < 6)
                throw new Exception("Parâmetros incompletos(qtd: " + splitParam.GetUpperBound(0).ToString() + ") ");

            PH.Formatura.DTO.ParamSelecaoFotos param = new DTO.ParamSelecaoFotos();

            //AlbumID
            if (!int.TryParse(splitParam[0], out aux))
                throw new Exception("Album enviado é invalido [a=" + a + ",a_str=" + splitParam[0] + "]");
            param.AlbumID = aux;
            //ProductID
            if (!int.TryParse(splitParam[1], out aux))
                throw new Exception("Produto enviado é invalido [a=" + a + ",a_str=" + splitParam[1] + "]");
            param.ProductID = aux;
            //QtdMaxFoto 
            if (!int.TryParse(splitParam[2], out aux))
                throw new Exception("QtdMaxFoto enviado é invalido [a=" + a + ",a_str=" + splitParam[2] + "]");
            param.QtdMaxFoto = aux;
            //URL_RETORNO
            param.urlRetorno = splitParam[3];
            //AlunoTurmaID
            if (!int.TryParse(splitParam[4], out aux))
                throw new Exception("AlunoTurmaID enviado é invalido [a=" + a + ",a_str=" + splitParam[4] + "]");
            param.AlunoTurmaID = aux;
            //AlunoTurmaID
            if (!int.TryParse(splitParam[5], out aux))
                throw new Exception("QtdMinFoto enviado é invalido [a=" + a + ",a_str=" + splitParam[5] + "]");
            param.QtdMinFoto = aux;
            if (!decimal.TryParse(splitParam[6], out aux2))
                throw new Exception("PercentDiscard enviado é invalido [a=" + a + ",a_str=" + splitParam[6] + "]");
            param.PercentDiscard = aux2;
            param.isFirstAcess = false;
            if (!bool.TryParse(splitParam[7], out aux3))
                throw new Exception("isFirstAcess enviado é invalido [a=" + a + ",a_str=" + splitParam[7] + "]");
            param.isFirstAcess = aux3;

            AgendamentoBLL bll = new AgendamentoBLL(context.db);

            List<Photo> fotos = bll.GetFotosAlunoTurma(param.AlunoTurmaID);
            fotos = bll.SetLinksRender(fotos, keyPixel);

            //seleciona as fotos de acordo com os parâmetros
            bll.SelecionaFotos(fotos, param.QtdMaxFoto, param.QtdMinFoto, param.ProductID,param.PercentDiscard,param.AlunoTurmaID);
                        
            //#1 insert na tabela GRD_ORDER_PRODUCT_PHOTOS obtendo qtdMax e caso o produto seja diferente de fotolivro    
            bll.InsertOrderProductPhotos(fotos, param.AlunoTurmaID, param.ProductID);

            ProdutosBLL produtosBLL = new ProdutosBLL(context.db);
            ViewData["NomeProduto"] = produtosBLL.Get(_User.Brand_ID.Value,param.ProductID).NomeProduto;
            ViewData["QtdMaxFoto"] = param.QtdMaxFoto;
            ViewData["ProductID"] = param.ProductID;
            ViewData["QtdMinFoto"] = param.QtdMinFoto;            
            ViewData["photos"] = fotos;
            ViewData["Token"] = _User.Token;
            ViewData["AlbumIDCript"] = PH.Formatura.BLL.Util.Cript.EncriptRC4(keyPixel,param.AlbumID.ToString());
            ViewData["UrlRetorno"] = param.urlRetorno;
            ViewData["AlunoTurmaID"] = param.AlunoTurmaID;
            ViewData["PercentDiscard"] = param.PercentDiscard;
            ViewData["AlunoTurmaID_Cript"] = PH.Formatura.BLL.Util.Cript.EncriptRC4(keyPixel, param.AlunoTurmaID.ToString());
            ViewData["isFirstAcess"] = param.isFirstAcess;         

            return View();
        }
    }
}
