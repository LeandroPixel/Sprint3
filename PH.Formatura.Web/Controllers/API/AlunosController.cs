using Newtonsoft.Json.Linq;
using PH.Formatura.BLL;
using PH.Formatura.Web.Controllers.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using PH.Formatura.DTO;
using PH.Formatura.DTO.Aluno;
using PH.Formatura.DTO.Agendamento;
using System.Web;

namespace PH.Formatura.Web.Controllers.API
{
    public class AlunosController : BaseAPIController
    {
        [HttpGet]
        public JArray List() {
            string keyPixel = System.Configuration.ConfigurationManager.AppSettings["KeyPixel"].ToString();
            UserBLL UserBll = new UserBLL(context.db);
            User _User = UserBll.Get(User.Token);
            AlunoBLL alunoBLL = new AlunoBLL(context.db);
            return alunoBLL.List(_User.Brand_ID.Value, _User.User_ID, keyPixel);
        }

        [HttpPost]
        public JArray Detail(int AlunoTurmaID)
        {
            string keyPixel = System.Configuration.ConfigurationManager.AppSettings["KeyPixel"].ToString();
            UserBLL UserBll = new UserBLL(context.db);
            User _User = UserBll.Get(User.Token);
            AlunoBLL alunoBLL = new AlunoBLL(context.db);
            return alunoBLL.Get(_User.Brand_ID.Value, AlunoTurmaID, keyPixel);
        }


        [HttpPost]
        public HttpResponseMessage Sync(SyncAluno dto)
        {
            string keyPixel = System.Configuration.ConfigurationManager.AppSettings["KeyPixel"].ToString();
            UserBLL UserBll = new UserBLL(context.db);
            User _User = UserBll.Get(User.Token);
            AlunoBLL alunoBLL = new AlunoBLL(context.db);            
            JArray alunoInfo = new JArray();
            JArray precosInfo = new JArray();
            JArray produtosInfo = new JArray();
            JArray alunoTurmaPhotos = new JArray();
            JArray orderProductPhotos = new JArray(); 
            JArray cartProduct = new JArray();
            JArray pacotes = new JArray();
            JArray pacotesProducts = new JArray();
            JArray pacotesTurma = new JArray();
            JArray alunoPacote = new JArray();
            List<PhotoSync> photos_album = new List<PhotoSync>();             
            int[] alunoTurmaIDs = null;
            int[] album_ids = null;

            //recuperandos infos alunos            
            if (dto.Alunos != null && dto.Alunos.Count > 0){
                alunoInfo = alunoBLL.Get(_User.Brand_ID.Value, dto.Alunos, _User.User_ID, keyPixel);
                alunoTurmaIDs = dto.Alunos.Select(o => o.AlunoTurmaID).ToArray();
                album_ids = dto.Alunos.Select(o => o.AlbumID).ToArray();
            }                

            if (dto.Tabelas != null && dto.Tabelas.Count > 0)
            {
                ProdutosBLL produtosbll = new ProdutosBLL(context.db);
                foreach (var item in dto.Tabelas)
                {
                    if (item.LastSync == null || item.LastSync > DateTime.Now.AddDays(-1))
                        continue;

                    switch (item.Name.ToLower())
                    {
                        case "v_grd_tabelapreco":
                            PrecosBLL precosbll = new PrecosBLL(context.db);
                            precosInfo = precosbll.Get(_User.Brand_ID.Value);
                            break;
                        case "v_grd_products":                            
                            produtosInfo = produtosbll.Get(_User.Brand_ID.Value);
                            break;
                        case "grd_alunoturma_photos":
                            if (alunoTurmaIDs != null && alunoTurmaIDs.Count() > 0)
                                alunoTurmaPhotos = alunoBLL.GetAlunoTurmaPhotos(alunoTurmaIDs);    
                            break;
                        case "grd_order_product_photos":                            
                            if (alunoTurmaIDs != null && alunoTurmaIDs.Count() > 0)
                                orderProductPhotos = alunoBLL.GetOrderProduct(alunoTurmaIDs);    
                            break;
                        case "grd_cart_product":                            
                            if (alunoTurmaIDs != null && alunoTurmaIDs.Count() > 0)
                                cartProduct = alunoBLL.GetCartProduct(alunoTurmaIDs);    
                            break;
                        case "photos_album":
                            if (album_ids != null && album_ids.Count() > 0)
                            {
                                string url = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority).ToString();
                                photos_album = alunoBLL.GetPhotosAlbum(album_ids, keyPixel, (url.Contains("localhost") || url.Contains("wwwh3.nicephotos.com.br")));
                            }
                            break;
                        case "grd_pacote":                            
                            pacotes = produtosbll.GetPacotes();
                            break;
                        case "grd_pacote_products":
                            pacotesProducts = produtosbll.GetPacotesProducts();
                            break;
                        case "grd_turma_pacote":
                            pacotesTurma = produtosbll.GetPacotesTurma();
                            break;
                        case "grd_aluno_pacote":
                            alunoPacote = produtosbll.GetAlunoPacote();
                            break;
                    }
                }

            }      

            return Request.CreateResponse<dynamic>(System.Net.HttpStatusCode.OK, new 
            {
                Sucesso = true,
                Mensagem = "Foto selecionada/desmarcada com sucesso",
                v_GRD_ListaAlunos = alunoInfo,
                v_GRD_TabelaPreco = precosInfo,
                v_GRD_Products = produtosInfo,
                GRD_AlunoTurma_Photos = alunoTurmaPhotos,
                GRD_ORDER_PRODUCT_PHOTOS = orderProductPhotos,
                GRD_CART_PRODUCT = cartProduct,
                Photos_Album = photos_album,
                GRD_Pacote = pacotes,
                GRD_Pacote_Products = pacotesProducts,
                GRD_Turma_Pacote = pacotesTurma,
                GRD_Aluno_Pacote = alunoPacote,
            });             
        }
    }
}
