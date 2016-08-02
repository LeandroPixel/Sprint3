using PH.Formatura.Web.Controllers.Base;
using PH.Formatura.BLL;
using PH.Formatura.DTO;
using PH.Formatura.DAL;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PH.Formatura.DTO.Produtos;

namespace PH.Formatura.Web.Controllers
{
    public class ProdutosController : BaseMVCController
    {
        //
        // GET: /Produtos/
        public ActionResult Index(string a)
        {
            int AlunoTurmaID;
            string AlunoTurmaID_STR;
            string keyPixel = HttpContext.Application["KeyPixel"].ToString();

            if (string.IsNullOrEmpty(a))
                throw new Exception("Parâmetro nao enviado");

            //AlunoTurmaID
            AlunoTurmaID_STR = PH.Formatura.BLL.Util.Cript.DecriptRC4(keyPixel, a);
            if (!int.TryParse(AlunoTurmaID_STR, out AlunoTurmaID))
                throw new Exception("AlunoTurmaID enviado é invalido [a=" + a + ",a_str=" + AlunoTurmaID_STR + "]");
            

			ViewData["_User"] = _User;
            ViewData["keyPixel"] = keyPixel;
            ViewData["AlunoTurmaID_Cript"] = a;
            ViewData["objConfig"] = new
            {
                user_id = _User.User_ID,
                aluno_turma_id = AlunoTurmaID,
                aluno_turma_id_Cript = AlunoTurmaID_STR,
                url_save = Url.Action("SaveCartProduct", "api/Produtos"),
                url_delete = Url.Action("DeleteItemCartProduct", "api/Produtos"),
                aluno_turma_id_Cript2 = a,
            };
            
            ProductsBLL bll = new ProductsBLL(context.db);
            List<pr_GRD_ProductsAluno_Result> Dados = bll.RetornaProdutosAlunoTurma(AlunoTurmaID);
            bool hasPhotoSelect = bll.HasPhotoSelect(AlunoTurmaID);
            if (!hasPhotoSelect)
            {
                pr_GRD_ProductsAluno_Result fotolivro = Dados.Where(o => o.Grupo.Equals("FOTOLIVRO", StringComparison.OrdinalIgnoreCase)).LastOrDefault();
                string parametros = ProdutosController.GetParamsValidaFotosProduto(fotolivro, keyPixel, a, true);                
                return RedirectToAction("ValidacaoFotos", "Agendamento", new { a = parametros });                
            }

            ProdutosBLL prodBLL = new ProdutosBLL(context.db);
            AlunoBLL alunoBLL = new AlunoBLL(context.db);
            int turmaID = alunoBLL.GetTurmaID(AlunoTurmaID);
            List<Pacote> pacotes = prodBLL.GetPacotes(turmaID);
            prodBLL.GetPacotesProducts(pacotes);            
            ViewData["pacotes"] = pacotes;
            int? pacoteUser = prodBLL.GetPacoteUser(AlunoTurmaID);
            if (!pacoteUser.HasValue)
            {
                prodBLL.InsertOrUpdatePacoteUser(pacotes.FirstOrDefault().ID, AlunoTurmaID);
                pacoteUser = pacotes.FirstOrDefault().ID;
            }
            ViewData["pacoteUser"] = pacoteUser;
            
            //if (_User.User_ID == 2199697) // teste produto obrigatorio
            //{
            //    var t = Dados.Where(o=>o.ExibirListaProdutos == true && o.QtdProductsCart == 0).FirstOrDefault();
            //    t.ProdutoObrigatorio = true;
            //    t = Dados.Where(o => o.ExibirListaProdutos == true && o.QtdProductsCart == 0 && o.QtdMinFoto == 0).FirstOrDefault();
            //    t.ProdutoObrigatorio = true;
            //}

            //var t = Dados.Where(o => o.ProductID == 3688 || o.ProductID == 3690).ToList();
            //foreach (var item in t)            
            //    item.ProdutoObrigatorio = true;                

            //ValidacaoProdutos Obrigatorios
            List<pr_GRD_ProductsAluno_Result> prodsObrigatorios = Dados.Where(o => o.ProdutoObrigatorio == true && o.QtdProductsCart == 0 && o.ExibirListaProdutos == true).ToList();
            if (prodsObrigatorios.Count > 1)
            {
                CartBLL cartBLL = new CartBLL(context.db);
                foreach (var item in prodsObrigatorios)
                {
                    CartProduct prod = new CartProduct()
                    {
                        AlunoTurmaID = item.AlunoTurmaID.Value,
                        BookID = 0,
                        ProductID = item.ProductID,
                        Qtd = 1,
                        QtdFoto = item.QtdFotosSelecionadas.Value,
                        UserID = _User.User_ID
                    };
                    cartBLL.InserUpdateCartProduct(prod);
                    item.QtdProductsCart = 1;
                }    
            }
            
            return View(Dados);
        }

        [NonAction]
        public static string GetParamsValidaFotosProduto(pr_GRD_ProductsAluno_Result item, string keyPixel, string alunoTurmaID_Cript, bool isFirstAcess = false)
        {
            string BaseAplicacao = System.Web.HttpContext.Current.Request.ApplicationPath; BaseAplicacao = ((BaseAplicacao.Substring(0, 1) == "/" ? BaseAplicacao : "/" + BaseAplicacao).Length == 1 ? "" : (BaseAplicacao.Substring(0, 1) == "/" ? BaseAplicacao : "/" + BaseAplicacao));
            string parametros = item.AlbumID.ToString() + "|" + item.ProductID.ToString() + "|" + item.QtdMaxFoto + "|" + BaseAplicacao + "/Produtos?a=" + alunoTurmaID_Cript + "|" + item.AlunoTurmaID + "|" + item.QtdMinFoto + "|" + item.PercentualDescarte + "|" + isFirstAcess;            
            return PH.Formatura.BLL.Util.Cript.EncriptRC4(keyPixel, parametros);           
        }

        [HttpPost]
        public PartialViewResult ProdutosPacote(int pacoteID, string alunoTurmaID_Cript)
        {
            string keyPixel = HttpContext.Application["KeyPixel"].ToString();
            ViewData["keyPixel"] = keyPixel;
            ViewData["AlunoTurmaID_Cript"] = alunoTurmaID_Cript;
            string AlunoTurmaID_STR = PH.Formatura.BLL.Util.Cript.DecriptRC4(keyPixel, alunoTurmaID_Cript);
            int AlunoTurmaID;
            if (!int.TryParse(AlunoTurmaID_STR, out AlunoTurmaID))
                throw new Exception("AlunoTurmaID enviado é invalido [a=" + alunoTurmaID_Cript + ",a_str=" + AlunoTurmaID_STR + "]");
            
            ProductsBLL bll = new ProductsBLL(context.db);                        
            List<pr_GRD_ProductsAluno_Result> Dados = bll.RetornaProdutosAlunoTurma(AlunoTurmaID);

            Pacote pacote = new Pacote() { ID = pacoteID };
            ProdutosBLL prodBll = new ProdutosBLL(context.db);     
            List<Pacote> pacotes = new List<Pacote>();
            pacotes.Add(pacote);
            prodBll.GetPacotesProducts(pacotes);
            ViewData["pacoteSelected"] = pacotes.FirstOrDefault();

            prodBll.InsertOrUpdatePacoteUser(pacoteID, AlunoTurmaID);

            //salvar seleção pacote
            return PartialView("Produtos", Dados);
        }
	}
}