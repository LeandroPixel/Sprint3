var oCadastro = {
	//Objetos - Início
	jqThis: null
	//Objetos - Fim

	//Strings - Início
	, string_url_base_aplicacao: oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao
	, string_url_cadastrar_usuario: '/User/CadastrarUsuario'
	, string_mensagem_ddd_invalido: '- DDD inválido;<br/>'
	, string_mensagem_telefone_invalido: '- Telefone inválido;<br/>'
	, string_tamanho_minimo_ddd: 2
	, string_tamanho_minimo_telefone: 8
	, string_duracao_transicoes: 400
	, string_mensagem_sessao_expirada: 'Sessão expirada. Por favor, faça login e tente novamente.'
	//Strings - Fim

	//Eventos - Início
	, evento_click: 'click'
	, evento_load: 'load'
	, evento_keyup: 'keyup'
	, evento_submit: 'submit'
	//Eventos - Fim

	//Seletores - Início
	, seletor_geral: '.conteudo-cadastrar-usuario'
	, seletor_form_cadastrar: '.form-cadastrar-usuario'
	, seletor_form_cadastrar_nao_ativo: '.form-cadastrar-usuario:not(.ativo)'
	, seletor_form_cadastrar_ativo: '.form-cadastrar-usuario.ativo'
	, seletor_btn_cadastrar: '.btn-confirma-cadastro'
	, seletor_tbx_nome: '#tbx-nome'
	, seletor_tbx_email: '#tbx-email'
	, seletor_tbx_senha: '#tbx-senha'
	, seletor_tbx_ddd: '#tbx-ddd'
	, seletor_tbx_telefone: '#tbx-telefone'
	, seletor_mensagem_cadastro: '.p-mensagem-cadastro'
	//Seletores - Fim

	//Métodos - Início
	, Carregar: function () {
		var _this = this;

		//NORMATIRAZAR STRINGS
		_this.string_url_cadastrar_usuario = _this.string_url_base_aplicacao + _this.string_url_cadastrar_usuario;
		//FIM NORMATIRAZAR STRINGS

		_this.jqThis = jQuery(_this.seletor_geral);

		if (_this.jqThis.length) {
			_this.CarregarEventos();
		}
	}
	, CarregarEventos: function () {
		var _this = this;

		_this.jqThis
			.on(_this.evento_submit, _this.seletor_form_cadastrar, function () { _this.ValidarCadastro(); return false; })
		;
	}
	, ValidarCadastro: function(){
		var _this = this;
		
		if (_this.jqThis.find(_this.seletor_form_cadastrar).hasClass('ativo'))
			return;

		_this.jqThis.find(_this.seletor_form_cadastrar).addClass('ativo');
		
		var Erro = false;
		var Mensagem = "";

		var Elementos_Form = _this.jqThis.find(
				_this.seletor_tbx_nome + ','
			+	_this.seletor_tbx_email + ','
			+	_this.seletor_tbx_senha + ','
			+	_this.seletor_tbx_ddd + ','
			+	_this.seletor_tbx_telefone
		);

		var nome = _this.jqThis.find(_this.seletor_tbx_nome);
		var email = _this.jqThis.find(_this.seletor_tbx_email);
		var senha = _this.jqThis.find(_this.seletor_tbx_senha);
		var ddd = _this.jqThis.find(_this.seletor_tbx_ddd);
		var telefone = _this.jqThis.find(_this.seletor_tbx_telefone);

		if (!_this.DDD_Valido(ddd.val())) {
			Erro = true; Mensagem += _this.string_mensagem_ddd_invalido;
		}
		if (!_this.Telefone_Valido(telefone.val())) {
			Erro = true; Mensagem += _this.string_mensagem_telefone_invalido;
		}

		if (Erro) {
			_this.jqThis.find(_this.seletor_mensagem_cadastro).promise().done(function () {
				jQuery(this).slideUp(_this.string_duracao_transicoes, function () {
					jQuery(this).html(Mensagem).slideDown(_this.string_duracao_transicoes, function () {
						_this.jqThis.find(_this.seletor_form_cadastrar).removeClass('ativo');
					});
				});
			});
		} else {
			jQuery.ajax({
				type: 'POST',
				url: _this.string_url_cadastrar_usuario,
				contentType: 'application/json',
				data: JSON.stringify({
					email: email.val().trim(),
					senha: senha.val(),
					nome: nome.val().trim(),
					telefone: ddd.val().toString() + telefone.val().toString()
				}),
				beforeSend: function () {
					Elementos_Form.each(function () { jQuery(this).attr('readonly', 'readonly'); });
					_this.jqThis.find(_this.seletor_mensagem_cadastro).promise().done(function () {
						jQuery(this).slideUp(_this.string_duracao_transicoes, function () {
							jQuery(this).html('');
						});
					});
				}
			})
				.done(function (poJSON) {
					if (poJSON) {
						if (poJSON.Sucesso === undefined && poJSON.error === undefined) {
							alert(_this.string_mensagem_sessao_expirada);
							document.location.reload(true);
						}

						if (poJSON.Sucesso) {
							_this.jqThis.find(_this.seletor_form_cadastrar)[0].reset();
						} else {

						}

						if (poJSON.Mensagem && poJSON.Mensagem.length) {
							_this.jqThis.find(_this.seletor_mensagem_cadastro).promise().done(function () {
								jQuery(this).html(poJSON.Mensagem).slideDown(_this.string_duracao_transicoes, function () {
								});
							});
						}
					}
				})
				.fail(function (jqXHR, textStatus) {

				})
				.always(function () {
					Elementos_Form.each(function () { jQuery(this).removeAttr('readonly'); });
					_this.jqThis.find(_this.seletor_form_cadastrar).removeClass('ativo');
				})
			;
		}
	}
	, DDD_Valido: function (ddd) {
		var _this = this;

		if (isNaN(ddd) || ddd.length < _this.string_tamanho_minimo_ddd || ddd < 11 || ddd % 10 == 0)
			return false;
		return true;
	}
	, Telefone_Valido: function (telefone) {
		var _this = this;

		if (isNaN(telefone) || telefone.length < _this.string_tamanho_minimo_telefone || telefone.charAt(0) == 0 || telefone.charAt(0) == 1)
			return false;
		return true;
	}
	//Métodos - Fim
}
jQuery(document).ready(function () {
	oCadastro.Carregar();
});