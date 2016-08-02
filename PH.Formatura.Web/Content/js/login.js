var oLogin = {
	//Objetos - Início
	jqThis: null
	//Objetos - Fim

	//Strings - Início
	, string_url_base_aplicacao: oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao
	, string_informe_login_senha: 'Informe seu login e sua senha'
	, string_informe_login: 'Informe seu login'
	, string_informe_senha: 'Informe sua senha'
	, string_url_validar_login: '/Login/ValidarLogin'
	, string_url_redirect_login: '/Login/Logar'
    , pageDefault : ""
	//Strings - Fim

	//Eventos - Início
	, evento_click: 'click'
	, evento_load: 'load'
	, evento_submit: 'submit'
	, evento_keyup: 'keyup'
	//Eventos - Fim

	//Seletores - Início
	, seletor_geral: '.conteudo-login'
	, seletor_btn_entrar: '.btn-entrar'
	, seletor_btn_entrar_nao_ativo: '.btn-entrar:not(.ativo)'
	, seletor_tbx_login: '.tbx-login'
	, seletor_tbx_password: '.tbx-password'
	, seletor_span_erro_login: '.alert-danger-on'
	//Seletores - Fim

	//Métodos - Início
	, Carregar: function (pageDefault) {
		var _this = this;

		//NORMATIRAZAR STRINGS
		_this.string_url_validar_login = _this.string_url_base_aplicacao + _this.string_url_validar_login;
		_this.string_url_redirect_login = _this.string_url_base_aplicacao + _this.string_url_redirect_login;
		//FIM NORMATIRAZAR STRINGS

		_this.jqThis = jQuery(_this.seletor_geral);

		if (_this.jqThis.length) {
			_this.CarregarEventos();
		}

		_this.pageDefault = pageDefault;
	}
	, CarregarEventos: function () {
		var _this = this;

		_this.jqThis
			.on(_this.evento_click, _this.seletor_btn_entrar_nao_ativo, function () { _this.ValidarLogin(); })
			.on(_this.evento_keyup, _this.seletor_tbx_login + ',' + _this.seletor_tbx_password, function (evento) { _this.LoginTratarKeyUp(evento); })
		;
	}
	, LoginTratarKeyUp: function (evento) {
		var _this = this;

		(evento.keyCode == 13) ? jQuery(_this.seletor_btn_entrar_nao_ativo).focus().trigger(_this.evento_click) : 0;
	}
	, ValidarLogin: function () {
		var _this = this;

		var Erro = false;
		var Mensagem = '';
		var Login = _this.jqThis.find(_this.seletor_tbx_login);
		var Password = _this.jqThis.find(_this.seletor_tbx_password);

		if (!Erro && Login.val().trim().length == 0 && Password.val().trim().length == 0) { Mensagem = _this.string_informe_login_senha; Login.focus(); Erro = true; }
		if (!Erro && Login.val().trim().length == 0) { Mensagem = _this.string_informe_login; Login.focus(); Erro = true; }
		if (!Erro && Password.val().trim().length == 0) { Mensagem = _this.string_informe_senha; Password.focus(); Erro = true; }

		if (Erro) {
			_this.jqThis.find(_this.seletor_span_erro_login).slideUp('fast', function () {
				jQuery(this).text(Mensagem).slideDown('fast');
			});
			return;
		}

		var BotaoLabelTemp = _this.jqThis.find(_this.seletor_btn_entrar).val();
		var oDadosDeLogin = {
			email: Login.val().trim(),
			senha: Password.val(),
			brand_id: oInicial.Brand_ID,
			url_destino: '/'
		}

		_this.jqThis.find(_this.seletor_btn_entrar).val('').addClass('ativo');
		_this.jqThis.find(_this.seletor_span_erro_login).slideUp('fast', function () {
			//PRIMEIRO, VERIFICAR SE ESSE USUÁRIO É VALIDO
			jQuery.ajax({
				url: _this.string_url_validar_login,
				contentType: 'application/json',
				type: 'POST',
				data: JSON.stringify({
					email: Login.val().trim(),
					senha: Password.val(),
					brand_id: oInicial.Brand_ID
				})
			})
				.done(function (poJSON, textStatus, jqXHR) {
					if(poJSON){
						if (poJSON.Sucesso) {
							var oParametros = {
								email: oDadosDeLogin.email,
								senha: oDadosDeLogin.senha,
								brand_id: oDadosDeLogin.brand_id
							}
							oGeral.RedirectPost(_this.string_url_redirect_login, oParametros);
						} else {
							if (poJSON.Mensagem) {
								_this.jqThis.find(_this.seletor_btn_entrar).val(BotaoLabelTemp).removeClass('ativo');
								_this.jqThis.find(_this.seletor_span_erro_login).text(poJSON.Mensagem).slideDown('fast');
							} else {
								window.document.location.reload(true);
							}
						}
					}
				})
				.fail(function(jqXHR, textStatus) {
					console.log(textStatus);
					_this.jqThis.find(_this.seletor_btn_entrar).val(BotaoLabelTemp).removeClass('ativo');
				})
				.always(function (jqXHR, textStatus) {
					//loading
				})
			;
		});
	}
	, TratarUsuarioLogado: function () {
		if (oOffline.vefiryUserIsLogged()) {
			window.document.location.reload(true);
		}
	}
	//Métodos - Fim
}

if (oOffline.verifyUserLogged() ) {
    document.location.href = default_page_logged_offline;
}

if (oOffline.vefiryUserIsLogged()) {
    document.location.href = pageDefault;
}

jQuery(document).ready(function () {
    oLogin.Carregar(pageDefault);
});

oOffline.CallbackVerifyOnline = function (Online) {
	if (Online){
		oLogin.TratarUsuarioLogado();
	}
}