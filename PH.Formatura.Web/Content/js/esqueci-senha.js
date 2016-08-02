var oEsqueciMinhaSenha = {
	//Objetos - Início
	jqThis: null
	//Objetos - Fim

	//Strings - Início
	, string_url_base_aplicacao: oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao
	, string_url_alterar_senha: '/Login/EsqueciMinhaSenhaAlteracao'
	, string_msg_senhas_diferem: 'As senhas precisam ser iguais'
	, string_chave_replace_msg_senha_curta: '$minlength$'
	, string_msg_senha_curta: 'A senha deve ter no mínimo $minlength$ caracteres'
	, string_nova_senha_minlength: 6
	, string_duracao_animacao_slides: 400
	, string_chave_replace_html_senha_alterada_com_sucesso: '$string_url_base_aplicacao$'
	, string_html_senha_alterada_com_sucesso: '<p class=""><a href="$string_url_base_aplicacao$/Login/" style="color: #3f51b5;text-decoration: underline;">Acesse aqui o site</a></p>'
	//Strings - Fim

	//Eventos - Início
	, evento_click: 'click'
	, evento_load: 'load'
	, evento_change: 'change'
	, evento_keyup: 'keyup'
	, evento_submit: 'submit'
	//Eventos - Fim

	//Seletores - Início
	, seletor_geral: '.conteudo-esqueci-senha'
	, seletor_tbx_nova_senha: '#tbx_nova_senha'
	, seletor_tbx_nova_senha_confirmacao: '#tbx_nova_senha_confirmacao'
	, seletor_form_esqueci_senha_alterar: '#form_esqueci_senha_alterar'
	, seletor_btn_alterar_senha: '.btn-alterar-senha'
	, seletor_msg_retorno_alteracao: '.msg_retorno_alteracao'
	, seletor_form_campos: '.form_campos'
	//Seletores - Fim

	//Métodos - Início
	, Carregar: function () {
		var _this = this;

		//NORMATIRAZAR STRINGS
		_this.string_url_alterar_senha = _this.string_url_base_aplicacao + _this.string_url_alterar_senha;
		_this.string_html_senha_alterada_com_sucesso = _this.string_html_senha_alterada_com_sucesso.replace(_this.string_chave_replace_html_senha_alterada_com_sucesso, _this.string_url_base_aplicacao)
		//FIM NORMATIRAZAR STRINGS

		_this.jqThis = jQuery(_this.seletor_geral);

		if (_this.jqThis.length) {
			_this.CarregarEventos();
		}
	}
	, CarregarEventos: function () {
		var _this = this;

		_this.jqThis
			.on(_this.evento_change, _this.seletor_tbx_nova_senha, function () { _this.VerificarAlteracaoSenhasParidade(); })
			.on(_this.evento_keyup, _this.seletor_tbx_nova_senha_confirmacao, function () { _this.VerificarAlteracaoSenhasParidade(); })
			.on(_this.evento_submit, _this.seletor_form_esqueci_senha_alterar, function () { _this.VerificarAlteracaoSenha(); return false; })
		;
	}
	, VerificarAlteracaoSenhasParidade: function () {
		var _this = this;

		var tbx_nova_senha = _this.jqThis.find(_this.seletor_tbx_nova_senha);
		var tbx_nova_senha_confirmacao = _this.jqThis.find(_this.seletor_tbx_nova_senha_confirmacao);

		if (tbx_nova_senha.val() != tbx_nova_senha_confirmacao.val()) {
			tbx_nova_senha_confirmacao[0].setCustomValidity(_this.string_msg_senhas_diferem);
		} else {
			tbx_nova_senha_confirmacao[0].setCustomValidity('');
		}
	}
	, VerificarAlteracaoSenha: function () {
		var _this = this;

		var tbx_nova_senha = _this.jqThis.find(_this.seletor_tbx_nova_senha);
		var tbx_nova_senha_confirmacao = _this.jqThis.find(_this.seletor_tbx_nova_senha_confirmacao);
		var btn_alterar_senha = _this.jqThis.find(_this.seletor_btn_alterar_senha);
		var p_msg_retorno_alteracao = _this.jqThis.find(_this.seletor_msg_retorno_alteracao);
		var form_campos = _this.jqThis.find(_this.seletor_form_campos);

		if (tbx_nova_senha.val().length < _this.string_nova_senha_minlength) {
			var msg = _this.string_msg_senha_curta.replace(_this.string_chave_replace_msg_senha_curta, _this.string_nova_senha_minlength.toString());
			p_msg_retorno_alteracao.text(msg).slideUp(_this.string_duracao_animacao_slides, function () {
				jQuery(this).slideDown(_this.string_duracao_animacao_slides);
			});
		} else {
			if (!btn_alterar_senha.hasClass('ativo')) {
				jQuery.ajax({
					type: 'POST',
					url: _this.string_url_alterar_senha,
					contentType: 'application/json',
					data: JSON.stringify({
						senha_nova: tbx_nova_senha.val(),
						senha_nova_confirmacao: tbx_nova_senha_confirmacao.val()
					}),
					dataType: 'json',
					beforeSend: function () {
						p_msg_retorno_alteracao.slideUp(_this.string_duracao_animacao_slides, function () {
							jQuery(this).text('');
							btn_alterar_senha.addClass('ativo disabled');
							tbx_nova_senha.attr('readonly', 'readonly');
							tbx_nova_senha_confirmacao.attr('readonly', 'readonly');
						});
					}
				})
					.done(function (poJSON) {
						if (poJSON) {
							if (poJSON.Sucesso) {
								form_campos.slideUp(_this.string_duracao_animacao_slides, function () {
									jQuery(this).remove();
									if (poJSON.Mensagem && poJSON.Mensagem.length) {
										p_msg_retorno_alteracao.promise().done(function () {
											jQuery(this).html(poJSON.Mensagem).slideDown(_this.string_duracao_animacao_slides);
											jQuery(this).parent().append(_this.string_html_senha_alterada_com_sucesso);
										});
									}
								})
							} else {
								if (poJSON.Mensagem && poJSON.Mensagem.length) {
									form_campos.promise().done(function () {
										p_msg_retorno_alteracao.promise().done(function () {
											jQuery(this).text(poJSON.Mensagem).slideDown(_this.string_duracao_animacao_slides);
										});
									});
								}
							}
						}
					})
					.fail(function (jqXHR, textStatus) {

					})
					.always(function (jqXHR, textStatus) {
						btn_alterar_senha.removeClass('ativo disabled');
						tbx_nova_senha.removeAttr('readonly');
						tbx_nova_senha_confirmacao.removeAttr('readonly');
					})
				;
			}
		}
	}
	//Métodos - Fim
}

jQuery(document).ready(function () {
	oEsqueciMinhaSenha.Carregar();
});