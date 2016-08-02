using PH.Formatura.BLL;
using PH.Formatura.DTO;
using PH.Formatura.DTO.Agendamento;
using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace PH.Formatura.Web.Controllers.API
{
    public class AgendamentoController : BaseAPIController
    {   
        public HttpResponseMessage SelectPhoto(AlbumSelected album)
        {            
            string keyPixel = HttpContext.Current.Application["KeyPixel"].ToString();
            AgendamentoBLL bll = new AgendamentoBLL(context.db);
            bool ok = bll.SelectPhoto(album, keyPixel, User.UserId, false, album.isFirstAcess);
            return Request.CreateResponse(System.Net.HttpStatusCode.OK, new BaseAPI {
                Sucesso = ok
                ,Mensagem = "Foto selecionada/desmarcada com sucesso"
                ,Obj = album 
            });
        }

        public HttpResponseMessage GoToCart(AlbumSelected album)
        {
            string keyPixel = HttpContext.Current.Application["KeyPixel"].ToString();
            AgendamentoBLL bll = new AgendamentoBLL(context.db);
            bool ok = true;
            string mensagem = string.Empty;
            if (album.QtdMinFoto > 0 && album.fotos.Where(o=>o.Selected).Count() < album.QtdMinFoto )
            {
                ok = false;
                mensagem = "limit_min";
            }
            else if (album.QtdMaxFoto > 0 && album.fotos.Where(o => o.Selected).Count() > album.QtdMaxFoto)
            {
                ok = false;
                mensagem = "limit_max";
            }

            if (ok)
            {
                ok = bll.SelectPhoto(album, keyPixel, User.UserId, true, album.isFirstAcess);
                mensagem = "Foto selecionada/desmarcada com sucesso";            
            }            

            //Seleciono as fotos para o mesmo grupo de produtos
            if (ok)
            {
                bll.SelectPhotoGrupoProducts(album.AlunoTurmaID, album.ProductID);
            }

            return Request.CreateResponse(System.Net.HttpStatusCode.OK, new BaseAPI
            {
                Sucesso = ok,
                Mensagem = mensagem,
                Obj = album
            });
        }

        public HttpResponseMessage Agendar(Agendar dto)
        {
            AgendamentoBLL bll = new AgendamentoBLL(context.db);
            bool ok = bll.Agendar(dto);
            return Request.CreateResponse(System.Net.HttpStatusCode.OK, new BaseAPI
            {
                Sucesso = ok,
                Mensagem = ok ? "Agendamento realizado com sucesso" : "Erro ao agendar",
                Obj = dto
            });
        }

        public HttpResponseMessage ChangeStatus(ChangeStatus dto)
        {
            AgendamentoBLL bll = new AgendamentoBLL(context.db);
            bool ok = bll.ChangeStatus(dto);
            return Request.CreateResponse(System.Net.HttpStatusCode.OK, new BaseAPI
            {
                Sucesso = ok,
                Mensagem = ok ? "Status alterado com sucesso" : "Erro ao alterar status",
                Obj = dto
            });
        }    
    }
}
