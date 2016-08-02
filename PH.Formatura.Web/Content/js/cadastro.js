var oCadastro = {
	//Objetos - Início
	jqThis: null
	//Objetos - Fim

	//Strings - Início
	, string_url_base_aplicacao: oInicial.BaseUrlAplicacao
	, string_url_cadastro_usuario_pj_c: '/api/Painel/CadastrarUsuarioPJc'
	, string_url_cadastro_usuario_pj_u: '/api/Painel/CadastrarUsuarioPJu'
	, string_url_cadastro_usuario_pf: '/api/Painel/CadastrarUsuarioPF'
	//Strings - Fim

	//Eventos - Início
	, evento_click: 'click'
	, evento_load: 'load'
	, evento_keyup: 'keyup'
	, evento_change: 'change'
	//Eventos - Fim

	//Seletores - Início
	, seletor_geral: '.conteudo-cadastrar'
	, seletor_form_pessoa_juridica: '.form-pessoa-juridica'
	, seletor_form_pessoa_fisica: '.form-pessoa-fisica'
	, seletor_btn_cadastrar_form_pessoa_juridica: '.btn-cadastrar-pessoa-juridica'
	, seletor_btn_cadastrar_form_pessoa_fisica: '.btn-cadastrar-pessoa-fisica'
	, seletor_div_erro_cadastro_pj: '.div-erro-cadastro-pessoa-juridica'
	, selector_sbx_empresas_pj: '.sbx-empresas-pj'
	, seletor_form_pessoa_juridica_etapa_1: '.form-pessoa-juridica .etapa-1 .mdl-textfield'
	//Seletores - Fim

	//Métodos - Início
	, Carregar: function () {
		var _this = this;

		_this.jqThis = $(_this.seletor_geral);

		_this.string_url_cadastro_usuario_pj_c = _this.string_url_base_aplicacao + _this.string_url_cadastro_usuario_pj_c;
		_this.string_url_cadastro_usuario_pj_u = _this.string_url_base_aplicacao + _this.string_url_cadastro_usuario_pj_u;
		_this.string_url_cadastro_usuario_pf = _this.string_url_base_aplicacao + _this.string_url_cadastro_usuario_pf;

		if (_this.jqThis.length) {
			_this.CarregarEventos();
		}
	}
	, CarregarEventos: function () {
		var _this = this;
		_this.jqThis
			.on(_this.evento_click, _this.seletor_btn_cadastrar_form_pessoa_juridica, function (evento) { evento.preventDefault(); _this.ValidarFormularioPessoaJuridica(); })
			.on(_this.evento_click, _this.seletor_btn_cadastrar_form_pessoa_fisica, function (evento) { evento.preventDefault(); _this.ValidarFormularioPessoaFisica(); })
			.on(_this.evento_change, _this.selector_sbx_empresas_pj, function () { _this.OnChangeSbxEmpresasPJ(); })
		;
	}
	, OnChangeSbxEmpresasPJ: function () {
		var _this = this;

		var Select = _this.jqThis.find(_this.selector_sbx_empresas_pj);
		var Elementos = _this.jqThis.find(_this.seletor_form_pessoa_juridica_etapa_1);

		Select.val() == '' ? Elementos.show() : Elementos.hide();
	}
	, ValidarFormularioPessoaJuridica: function () {
		var _this = this;

		var Select = _this.jqThis.find(_this.selector_sbx_empresas_pj);

		Select.val() == '' ? _this.EnviarFormularioCadastro('j-c') : _this.EnviarFormularioCadastro('j-u');

	}
	, ValidarFormularioPessoaFisica: function () {
		var _this = this;

		_this.EnviarFormularioCadastro('f');
	}
	, EnviarFormularioCadastro: function (Tipo) {
		var _this = this;

		try {
			var config = { url: '', form: null };
			switch (Tipo) {
				case 'j-c':
					config.url = _this.string_url_cadastro_usuario_pj_c;
					config.form = _this.jqThis.find(_this.seletor_form_pessoa_juridica);
					break;
				case 'j-u':
					config.url = _this.string_url_cadastro_usuario_pj_u;
					config.form = _this.jqThis.find(_this.seletor_form_pessoa_juridica);
					break;
				case 'f':
					config.url = _this.string_url_cadastro_usuario_pf;
					config.form = _this.jqThis.find(_this.seletor_form_pessoa_fisica);
					break;
				default:
					break;
			}
		
			$.ajax({
				type: 'POST',
				url: config.url,
				contentType: 'application/json',
				data: JSON.stringify(config.form.serializeObject()),
				headers: oUtil.GetToken(),
				//contentType: 'application/json',
				beforeSend: function () {
					oUtil.ShowLoader(true);
				}
			})
				.done(function (poJSON) {
					var Titulo_Modal = 'Cadastro';
					if (poJSON.Sucesso) {
						config.form[0].reset();
						_this.OnChangeSbxEmpresasPJ();
					}
					oUtil.ShowModalGeral(Titulo_Modal, poJSON.Mensagem);
				})
				.fail(function (jqXHR, textStatus) {
					oUtil.ShowModalError("", "", jqXHR, 'Cadastro');
				})
				.always(function (jqXHR, textStatus) {
					oUtil.ShowLoader(false);
				})
			;
		} catch (e) {
			console.log('Erro: ' + e.message);
		}
	}
	//Métodos - Fim
}
$(document).ready(function () {
	oCadastro.Carregar();
});