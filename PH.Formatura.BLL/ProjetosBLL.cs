using PH.Formatura.DAL;
using PH.Formatura.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL
{
	public class ProjetosBLL : BaseBLL
	{
		public ProjetosBLL(PixelHouseDBEntities db)
			: base(db)
		{
		}

		public List<ProjetosEmAndamento> RetornarProjetosEmAndamento(int User_ID)
		{
			List<ProjetosEmAndamento> Dados = new List<ProjetosEmAndamento>();

			var Informacoes_Photobook = db.v_Informacoes_Photobook_Formatura.Where(u => u.User_ID == User_ID).ToList();

			if (Informacoes_Photobook != null)
			{
				Dados = (from u in Informacoes_Photobook
						 where u.Data_Finalizacao == null
						   select new ProjetosEmAndamento
						   {
							   ID = u.Book_ID,
							   Album_Nome = u.Titulo,
							   Album_Modelo = u.Size_Description + " - " + "tema: " + u.Category_Name + "/" + u.Theme_Name ,
							   Data = u.Data_Criacao.ToString("dd/MM/yyyy HH:mm")
						   }).ToList();
			}

			return Dados;
		}

		public List<ProjetosFinalizados> RetornarProjetosFinalizados(int User_ID)
		{
			List<ProjetosFinalizados> Dados = new List<ProjetosFinalizados>();

			var Informacoes_Photobook = db.v_Informacoes_Photobook_Formatura.Where(u => u.User_ID == User_ID).ToList();

			if (Informacoes_Photobook != null)
			{
				Dados = (from u in Informacoes_Photobook
						 where u.Data_Finalizacao != null
						 select new ProjetosFinalizados
						 {
							ID = u.Book_ID,
							Album_Nome = u.Titulo,
							Album_Modelo = u.Size_Description,
							Pedido_ID = u.Pedido_ID,
							Pedido_Code = u.Pedido_Codigo,
							Pedido_Status = (u.Pedido_Status != null ? u.Pedido_Status : "Pedido não efetuado"),
							Data = (u.Pedido_Data_Criacao != null ? u.Pedido_Data_Criacao.Value.ToString("dd/MM/yyyy HH:mm") : ""),
							Texto_Lombada = u.Texto_Lombada,
							Qtd_fotos = u.Qtd_fotos
						 }).ToList();
			}

			return Dados;
		}

		public List<MontarProjetoDadosProdutos> RetornarProdutos(int Brand_ID)
		{
			var DadosView = db.v_products.Where(u => u.Brand_ID == Brand_ID).ToList();

			List<MontarProjetoDadosProdutos> Dados =  new List<MontarProjetoDadosProdutos>();
			if (DadosView != null)
			{
				Dados = (
					from d in DadosView
					where d.Brand_ID == Brand_ID
					select new MontarProjetoDadosProdutos
					{
						Brand_ID = d.Brand_ID,
						Product_ID = d.product_id,
						Product_Type = d.product_type,
						Descricao = d.description,
						Size_ID = d.SizeID,
						Paginas_Default = d.Pages,
						Paginas_Min = d.PagesMin,
						Paginas_Max = d.PagesMax,
						Paginas_Extra_Preco = d.Price_Extra_Page,
						Preco = d.Price,
						Url = d.Url,
						cod_size = d.cod_size,
						des_size = d.des_size,
						des_medidas = d.des_medidas,
						fl_active = d.fl_active,
						fl_promo_allowed = d.fl_promo_allowed,
						fl_offer_allowed = d.fl_offer_allowed,
						photos_capacity = d.photos_capacity,
						isPortifolio = d.isPortifolio,
						Scale_Mode_ID_Default = d.Scale_Mode_ID_Default,
						order = d.order,
						PhotobookLineID = d.PhotobookLineID,
						shelfPhotobookID = d.shelfPhotobookID
					}
				).ToList();
			}

			return Dados;
		}

		public List<ExtratoPedidoPagamento> RetornarExtratoPedidoPagamento(int User_ID)
		{
			List<ExtratoPedidoPagamento> Dados = new List<ExtratoPedidoPagamento>();

			var Informacoes_Extrato = this.db.user_account_transaction_history.Where(u => u.userID == User_ID).ToList();

			if (Informacoes_Extrato != null)
			{
				Dados = (from i in Informacoes_Extrato
						 orderby i.id ascending
						 select new ExtratoPedidoPagamento
						 {
							 ID = i.id,
							 Descricao = i.description,
							 Valor = i.vlr,
							 Data = i.dtInclude
						 }).ToList();
			}

			return Dados;
		}

		public bool ExcluirProjeto(int Book_ID, int User_ID)
		{
			bool Excluiu = false;

			var DadosFotolivro = db.FB_Photobook.Where(u => u.UserID == User_ID && u.ID == Book_ID && u.isDeleted == false).ToList().FirstOrDefault();

			if (DadosFotolivro != null)
			{
				DadosFotolivro.isDeleted = true;
				DadosFotolivro.LastUpdateDate = DateTime.Now;
				db.SaveChanges();
				Excluiu = true;
			}

			return Excluiu;
		}
	}
}
