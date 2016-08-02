using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PH.Formatura.DAL;
using PH.Formatura.DTO;
using PH.Formatura.Cache;
using PH.Formatura.BLL.Util;

namespace PH.Formatura.BLL
{
	public class PainelBLL : BaseBLL
	{
		public PainelBLL(PixelHouseDBEntities db) : base(db){
		}

		public RetornoCadastrarUsuarioPF CadastrarUsuarioPF(FormCadastroUsuarioPessoaFisica Form, User Owner)
		{
			RetornoCadastrarUsuarioPF Retorno = new RetornoCadastrarUsuarioPF();

			if (Form.tbxSenhaPessoaFisica != Form.tbxSenhaConfirmacaoPessoaFisica)
			{
				Retorno.Sucesso = false;
				Retorno.Mensagem = "As senhas precisam ser iguais";
			}
			else if (!ValidaCPF.IsCpf(Form.tbxCpfPessoaFisica))
			{
				Retorno.Sucesso = false;
				Retorno.Mensagem = "Informe um CPF válido";
			}
			else
			{
				try
				{
					CriptografiaBLL BLLCrypt = new CriptografiaBLL();
					string SenhaEncryptada = BLLCrypt.Encrypt(Form.tbxSenhaPessoaFisica, Form.tbxSenhaPessoaFisica);
				
					var Resultado = this.db.PR_GRD_CADASTRAR_USUARIO_PF(
						Form.tbxCpfPessoaFisica,
						Form.tbxRgPessoaFisica,
						Form.tbxNomePessoaFisica,
						Form.tbxTelefonePessoaFisica,
						Form.tbxEmailPessoaFisica,
						SenhaEncryptada,
						Form.tbxEmissorPessoaFisica,
						DateTime.Parse(Form.tbxDataEmissaoRgPessoaFisica),
						DateTime.Parse(Form.tbxNascimentoPessoaFisica),
						Form.tbxSexoPessoaFisica,
						Owner.Brand_ID,
						Form.tbxEnderecoPessoaFisica,
						Form.tbxNumeroPessoaFisica,
						Form.tbxComplementoPessoaFisica,
						Form.tbxBairroPessoaFisica,
						Form.tbxCidadePessoaFisica,
						Form.tbxEstadoPessoaFisica,
						Form.tbxCepPessoaFisica
					).FirstOrDefault();
					this.db.SaveChanges();

					Retorno.Sucesso = true;
					Retorno.Mensagem = Resultado.Mensagem;
					Retorno.User_ID = Resultado.user_id;
					Retorno.PessoaFisicaID = Resultado.PessoaFisicaID;
					Retorno.CompanyID = Resultado.CompanyID;
				}
				catch (Exception e)
				{
					Retorno.Sucesso = false;
					Retorno.Mensagem = "Erro ao salvar usuário no bd: " + e.Message;
				}
			}

			return Retorno;
		}

		public RetornoCadastrarUsuarioPJ CadastrarUsuarioPJc(FormCadastroUsuarioPessoaJuridicaCompleto Form, User Owner)
		{
			RetornoCadastrarUsuarioPJ Retorno = new RetornoCadastrarUsuarioPJ();

			if (Form.tbxSenhaUsuario != Form.tbxSenhaConfirmacaoUsuario)
			{
				Retorno.Sucesso = false;
				Retorno.Mensagem = "As senhas precisam ser iguais";
			}
			else if (!ValidaCNPJ.IsCnpj(Form.tbxCnpj))
			{
				Retorno.Sucesso = false;
				Retorno.Mensagem = "Informe um CNPJ válido";
			}
			else
			{
				try
				{
					CriptografiaBLL BLLCrypt = new CriptografiaBLL();
					string SenhaEncryptada = BLLCrypt.Encrypt(Form.tbxSenhaUsuario, Form.tbxSenhaUsuario);

					var Resultado = this.db.PR_GRD_CADASTRAR_USUARIO_PJ_C(
						Form.tbxNomePessoaJuridica,
						Form.tbxNomeUsuario,
						Form.tbxSexoPJUsuario,
						Form.tbxEmailUsuario,
						Form.tbxRazaoSocial,
						Form.tbxSite,
						Form.tbxCnpj,
						Form.tbxFacebook,
						Form.tbxTelefone,
						Form.tbxInscricaoEstadual,
						Form.tbxInscricaoMunicipal,
						SenhaEncryptada,
						DateTime.Parse(Form.tbxNascimentoUsuario),
						Owner.Brand_ID,
						Form.tbxEnderecoPessoaJuridica,
						Form.tbxNumeroPessoaJuridica,
						Form.tbxComplementoPessoaJuridica,
						Form.tbxBairroPessoaJuridica,
						Form.tbxCidadePessoaJuridica,
						Form.tbxEstadoPessoaJuridica,
						Form.tbxCepPessoaJuridica
					).FirstOrDefault();
					this.db.SaveChanges();

					Retorno.Sucesso = true;
					Retorno.Mensagem = Resultado.Mensagem;
					Retorno.User_ID = Resultado.user_id;
					Retorno.PessoaJuridicaID = Resultado.PessoaJuridicaID;
					Retorno.CompanyID = Resultado.CompanyID;
				}
				catch (Exception e)
				{
					Retorno.Sucesso = false;
					Retorno.Mensagem = "Erro ao salvar usuário no bd: " + e.Message;
				}
			}

			return Retorno;
		}

		public RetornoCadastrarUsuarioPJ CadastrarUsuarioPJu(FormCadastroUsuarioPessoaJuridicaUsuario Form, User Owner)
		{
			RetornoCadastrarUsuarioPJ Retorno = new RetornoCadastrarUsuarioPJ();

			if (Form.tbxSenhaUsuario != Form.tbxSenhaConfirmacaoUsuario)
			{
				Retorno.Sucesso = false;
				Retorno.Mensagem = "As senhas precisam ser iguais";
			}
			else
			{
				try
				{
					CriptografiaBLL BLLCrypt = new CriptografiaBLL();
					string SenhaEncryptada = BLLCrypt.Encrypt(Form.tbxSenhaUsuario, Form.tbxSenhaUsuario);

					var Resultado = this.db.PR_GRD_CADASTRAR_USUARIO_PJ_U(
						Form.grdCompanyId,
						Form.tbxNomeUsuario,
						DateTime.Parse(Form.tbxNascimentoUsuario),
						Form.tbxSexoPJUsuario,
						Form.tbxEmailUsuario,
						SenhaEncryptada,
						Owner.Brand_ID
					).FirstOrDefault();
					this.db.SaveChanges();

					Retorno.Sucesso = true;
					Retorno.Mensagem = Resultado.Mensagem;
					Retorno.User_ID = Resultado.user_id;
				}
				catch (Exception e)
				{
					Retorno.Sucesso = false;
					Retorno.Mensagem = "Erro ao salvar usuário no bd: " + e.Message;
				}
			}

			return Retorno;
		}

		public List<ListaEmpresasCadastroPJ> RetornarEmpresasCadastroPJ(Nullable<int> Brand_ID)
		{
			List<ListaEmpresasCadastroPJ> Dados = new List<ListaEmpresasCadastroPJ>();

			var Informacoes_Empresas = this.db.GRD_Company.Where(g => g.BrandID == Brand_ID && g.EntityType.ToUpper() == "J").ToList();

			if (Informacoes_Empresas != null)
			{
				Dados = (from g in Informacoes_Empresas
						select new ListaEmpresasCadastroPJ
						{
							grdCompanyId = g.ID,
							Nome = g.Name
						}).ToList();
			}

			return Dados;
		}

		public List<RetornoUsuariosCadastrados> RetornarUsuariosCadastrados(Nullable<int> Brand_ID)
		{
			List<RetornoUsuariosCadastrados> Dados = new List<RetornoUsuariosCadastrados>();

			var Usuarios = this.db.v_GRD_ListaUsuarios.Where(u => u.BrandID == Brand_ID).ToList();

			if (Usuarios != null)
			{
				Dados = (from u in Usuarios
						 select new RetornoUsuariosCadastrados
						 {
							 Empresa = u.NomeFantasia,
							 Usuario_Email = u.email,
							 Usuario_Nome = u.name,
							 Usuario_Telefone = u.telefone,
							 Usuario_Tipo = u.EntityType,
							 Usuario_UltimoAcesso = (u.DtUltimoAcesso != null ? u.DtUltimoAcesso.Value.ToString("dd/MM/yyyy HH:mm:ss") : null)
						 }).ToList();
			}

			return Dados;
		}
	
		/// <summary>
		/// Retorna o Code do Privilégio do usuário informado.
		/// </summary>
		/// <param name="User_ID">Parâmetro identificador do Usuário</param>
		/// <returns>Privilegio</returns>
		public string RetornarPrivilegioUsuario(int User_ID){
			return this.db.PR_PIX_ObtemPerfilUsuario(User_ID).FirstOrDefault();
		}
	}
}