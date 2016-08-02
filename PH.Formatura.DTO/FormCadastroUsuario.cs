using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace PH.Formatura.DTO
{
	public class FormCadastroUsuarioPessoaJuridicaCompleto : FormCadastroUsuario
	{
		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Facebook")]
		[ValidacaoDeFacebook(ErrorMessage = "Informe um Facebook válido (Ex.: https://www.facebook.com/usuario)")]
		public string tbxFacebook { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe uma Inscrição Estadual")]
		[ValidacaoDeNumeros(ErrorMessage = "Informe uma Inscrição Estadual válida (Somente números)")]
		public string tbxInscricaoEstadual { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe uma Inscrição Municipal")]
		[ValidacaoDeNumeros(ErrorMessage = "Informe uma Inscrição Municipal válida (Somente números)")]
		public string tbxInscricaoMunicipal { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Nome")]
		public string tbxNomePessoaJuridica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe uma Razão Social")]
		public string tbxRazaoSocial { get; set; }
		
		[Required(AllowEmptyStrings = false, ErrorMessage="Informe um CNPJ")]
		[ValidacaoDeCpf_CNPJ(ErrorMessage="Informe um CNPJ válido (Somente números)")]
		public string tbxCnpj { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Site (Ex.: http://exemplo.com)")]
		[ValidacaoDeSite(ErrorMessage = "Informe um Site válido (Ex.: http://exemplo.com)")]
		public string tbxSite { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Telefone")]
		[ValidacaoDeTelefone(ErrorMessage = "Informe um Telefone válido (Somente números)")]
		public string tbxTelefone { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um CEP")]
		[ValidacaoDeCEP(ErrorMessage = "Informe um CEP válido (Somente números)")]
		public string tbxCepPessoaJuridica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Endereço")]
		public string tbxEnderecoPessoaJuridica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Número")]
		public string tbxNumeroPessoaJuridica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Complemento")]
		public string tbxComplementoPessoaJuridica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Bairro")]
		public string tbxBairroPessoaJuridica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe uma Cidade")]
		public string tbxCidadePessoaJuridica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Estado")]
		[ValidacaoDeEstadosBR(ErrorMessage = "Informe um Estado válido")]
		public string tbxEstadoPessoaJuridica { get; set; }
	}

	public class FormCadastroUsuarioPessoaJuridicaUsuario : FormCadastroUsuario
	{
		[Required(ErrorMessage = "Informe um grdCompanyId")]
		public int grdCompanyId { get; set; }
	}

	public class FormCadastroUsuario
	{
		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Nome")]
		public string tbxNomeUsuario { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um E-mail")]
		[ValidacaoDeEmail(ErrorMessage="Informe um E-mail válido")]
		public string tbxEmailUsuario { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe uma Data de nascimento (Ex.: 31/12/2000)")]
		public string tbxNascimentoUsuario { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe uma Senha")]
		public string tbxSenhaUsuario { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe a Confirmação de Senha")]
		public string tbxSenhaConfirmacaoUsuario { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Sexo")]
		[ValidacaoDeSexo(ErrorMessage = "Informe um Sexo válido")]
		public string tbxSexoPJUsuario { get; set; }
	}

	public class FormCadastroUsuarioPessoaFisica
	{
		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe uma Data de Nascimento (Ex.: 31/12/2000)")]
		public string tbxNascimentoPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Telefone (Somente números)")]
		[ValidacaoDeTelefone(ErrorMessage = "Informe um Telefone válido (Somente números)")]
		public string tbxTelefonePessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um CEP (Somente números)")]
		[ValidacaoDeCEP(ErrorMessage = "Informe um CEP válido (Somente números)")]
		public string tbxCepPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Endereço")]
		public string tbxEnderecoPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Número")]
		public string tbxNumeroPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Complemento")]
		public string tbxComplementoPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Bairro")]
		public string tbxBairroPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe uma Cidade")]
		public string tbxCidadePessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Estado")]
		[ValidacaoDeEstadosBR(ErrorMessage = "Informe um Estado válido")]
		public string tbxEstadoPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um CPF (Somente números)")]
		[ValidacaoDeCpf_CNPJ(ErrorMessage = "Informe um CPF válido (Somente números)")]
		public string tbxCpfPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe uma Data de Emissão (Ex.: 31/12/2000)")]
		public string tbxDataEmissaoRgPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um E-mail")]
		[ValidacaoDeEmail(ErrorMessage = "Informe um E-mail válido")]
		public string tbxEmailPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Emissor")]
		public string tbxEmissorPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Nome")]
		public string tbxNomePessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um RG (Somente números)")]
		public string tbxRgPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe uma Senha")]
		public string tbxSenhaPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe a Confirmação de Senha")]
		public string tbxSenhaConfirmacaoPessoaFisica { get; set; }

		[Required(AllowEmptyStrings = false, ErrorMessage = "Informe um Sexo")]
		[ValidacaoDeSexo(ErrorMessage = "Informe um Sexo válido")]
		public string tbxSexoPessoaFisica { get; set; }
	}
}
