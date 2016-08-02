/*$.fn.serializeObject = function () {
	var o = Object.create(null),
        elementMapper = function (element) {
        	element.name = $.camelCase(element.name);
        	return element;
        },
        appendToResult = function (i, element) {
        	var node = o[element.name];

        	if ('undefined' != typeof node && node !== null) {
        		o[element.name] = node.push ? node.push(element.value) : [node, element.value];
        	} else {
        		o[element.name] = element.value;
        	}
        };

	$.each($.map(this.serializeArray(), elementMapper), appendToResult);
	return o;
};*/

/**
 * jQuery serializeObject
 * @copyright 2014, macek <paulmacek@gmail.com>
 * @link https://github.com/macek/jquery-serialize-object
 * @license BSD
 * @version 2.5.0
 */
(function (root, factory) {

	// AMD
	if (typeof define === "function" && define.amd) {
		define(["exports", "jquery"], function (exports, $) {
			return factory(exports, $);
		});
	}

		// CommonJS
	else if (typeof exports !== "undefined") {
		var $ = require("jquery");
		factory(exports, $);
	}

		// Browser
	else {
		factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
	}

}(this, function (exports, $) {

	var patterns = {
		validate: /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
		key: /[a-z0-9_]+|(?=\[\])/gi,
		push: /^$/,
		fixed: /^\d+$/,
		named: /^[a-z0-9_]+$/i
	};

	function FormSerializer(helper, $form) {

		// private variables
		var data = {},
			pushes = {};

		// private API
		function build(base, key, value) {
			base[key] = value;
			return base;
		}

		function makeObject(root, value) {

			var keys = root.match(patterns.key), k;

			// nest, nest, ..., nest
			while ((k = keys.pop()) !== undefined) {
				// foo[]
				if (patterns.push.test(k)) {
					var idx = incrementPush(root.replace(/\[\]$/, ''));
					value = build([], idx, value);
				}

					// foo[n]
				else if (patterns.fixed.test(k)) {
					value = build([], k, value);
				}

					// foo; foo[bar]
				else if (patterns.named.test(k)) {
					value = build({}, k, value);
				}
			}

			return value;
		}

		function incrementPush(key) {
			if (pushes[key] === undefined) {
				pushes[key] = 0;
			}
			return pushes[key]++;
		}

		function encode(pair) {
			switch ($('[name="' + pair.name + '"]', $form).attr("type")) {
				case "checkbox":
					return pair.value === "on" ? true : pair.value;
				default:
					return pair.value;
			}
		}

		function addPair(pair) {
			if (!patterns.validate.test(pair.name)) return this;
			var obj = makeObject(pair.name, encode(pair));
			data = helper.extend(true, data, obj);
			return this;
		}

		function addPairs(pairs) {
			if (!helper.isArray(pairs)) {
				throw new Error("formSerializer.addPairs expects an Array");
			}
			for (var i = 0, len = pairs.length; i < len; i++) {
				this.addPair(pairs[i]);
			}
			return this;
		}

		function serialize() {
			return data;
		}

		function serializeJSON() {
			return JSON.stringify(serialize());
		}

		// public API
		this.addPair = addPair;
		this.addPairs = addPairs;
		this.serialize = serialize;
		this.serializeJSON = serializeJSON;
	}

	FormSerializer.patterns = patterns;

	FormSerializer.serializeObject = function serializeObject() {
		return new FormSerializer($, this).
		  addPairs(this.serializeArray()).
		  serialize();
	};

	FormSerializer.serializeJSON = function serializeJSON() {
		return new FormSerializer($, this).
		  addPairs(this.serializeArray()).
		  serializeJSON();
	};

	if (typeof $.fn !== "undefined") {
		$.fn.serializeObject = FormSerializer.serializeObject;
		$.fn.serializeJSON = FormSerializer.serializeJSON;
	}

	exports.FormSerializer = FormSerializer;

	return FormSerializer;
}));

(function ($) {
	$.fn.longTouch = function (callback, timeout) {
		var timer;
		timeout = timeout || 500;
		$(this).on('mousedown', function (event) {
			event.preventDefault();
			timer = setTimeout(function () { callback($(this), event); }, timeout);
			return false;
		});
		$(document).on('mouseup', function () {
			clearTimeout(timer);
			return false;
		});
	};

})(jQuery);

var oGeral = {
	//Objetos - Início
	jqThis: null
	, jqModalEsqueciSenha: null
	//Objetos - Fim

	//Strings - Início
	, string_url_base_aplicacao: oInicial.BaseUrlAplicacao
	, string_url_redirect_login: '/Login/Logar'
	, string_url_logout: '/Login/Logout'
	, string_url_logout_nicephotos: '/logout.asp?forceDesktop=1'
	, string_url_esqueci_senha: '/Login/EsqueciMinhaSenha'
	, string_title_btn_fullscreen_open: 'TELA CHEIA'
	, string_title_btn_fullscreen_close: 'SAIR DO MODO TELA CHEIA'
	//Strings - Fim

	//Eventos - Início
	, evento_click: 'click'
	, evento_load: 'load'
	, evento_keyup: 'keyup'
	, evento_shown_modal: 'shown.bs.modal'
	//Eventos - Fim

	//Seletores - Início
	, seletor_geral: 'body'
	, seletor_btn_sair: '.ancora-logout'
	, seletor_ancora_esqueci_senha: '.ancora-esqueci-minha-senha'
	, seletor_modal_esqueci_senha: '.div-esqueci-senha-modal'
	, seletor_btn_esqueci_senha_enviar: '.btn-esqueci-senha-enviar'
	, seletor_btn_esqueci_senha_enviar_inativo: '.btn-esqueci-senha-enviar:not(.inativo)'
	, seletor_tbx_email_esqueci_senha: '.tbx-email'
	, seletor_div_mensagem_esqueci_senha_paragrafo: '.div-esqueci-senha-mensagem p'
	, seletor_btn_fullscreen: '.icone-fullScreen'
	//Seletores - Fim

	//Métodos - Início
	, Carregar: function () {
		var _this = this;

		//NORMATIRAZAR STRINGS
		_this.string_url_redirect_login = _this.string_url_base_aplicacao + _this.string_url_redirect_login;
		_this.string_url_logout = _this.string_url_base_aplicacao + _this.string_url_logout;
		_this.string_url_esqueci_senha = _this.string_url_base_aplicacao + _this.string_url_esqueci_senha;
		//FIM NORMATIRAZAR STRINGS

		_this.jqThis = $(_this.seletor_geral);

		if (_this.jqThis.length) {
			_this.jqModalEsqueciSenha = _this.jqThis.find(_this.seletor_modal_esqueci_senha);
			_this.CarregarEventos();
		}
	}
	, CarregarEventos: function () {
		var _this = this;

		_this.jqThis
			.on(_this.evento_click, _this.seletor_ancora_esqueci_senha, function () { _this.MostrarModalEsqueciSenha(); return false; })
			.on(_this.evento_click, _this.seletor_btn_esqueci_senha_enviar_inativo, function () { _this.ValidarFormularioEsqueciSenha(); })
			.on(_this.evento_keyup, _this.seletor_tbx_email_esqueci_senha, function (evento) { _this.TratarKeyUpEmailEsqueciSenha(evento); })
			.on(_this.evento_shown_modal, _this.jqModalEsqueciSenha, function () { _this.jqModalEsqueciSenha.find(_this.seletor_tbx_email_esqueci_senha).focus(); })
			.on(_this.evento_click, _this.seletor_btn_fullscreen, function (evento) { evento.preventDefault(); if (window.innerHeight != screen.height) { _this.RequisitarFullscreen(document.documentElement); } else { _this.SairFullscreen(document.documentElement); } })
		;
	}
	, RequisitarFullscreen: function (elemento) {
		var _this = this;
		
		if (elemento.requestFullscreen) {
			elemento.requestFullscreen();
		} else if (elemento.webkitRequestFullscreen) {
			elemento.webkitRequestFullscreen();
		} else if (elemento.mozRequestFullScreen) {
			elemento.mozRequestFullScreen();
		} else if (elemento.msRequestFullscreen) {
			elemento.msRequestFullscreen();
		} else {
			console.log('Seu browser não tem suporte à Fullscreen API.');
		}
		_this.jqThis.find(_this.seletor_btn_fullscreen).attr('title', _this.string_title_btn_fullscreen_close).css({ transform: 'rotate(180deg)' });
	}
	, SairFullscreen: function () {
		var _this = this;

		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else {
			console.log('Seu browser não tem suporte à Fullscreen API.');
		}
		_this.jqThis.find(_this.seletor_btn_fullscreen).attr('title', _this.string_title_btn_fullscreen_open).css({ transform: '' });
	}
	, RedirectPost: function (sUrl, oParametros, sMetodo) {
		metodo = sMetodo || 'post';
		var form = document.createElement('form');
		form.setAttribute('method', metodo);
		form.setAttribute('action', sUrl);

		if (oParametros) {
			for (var key in oParametros) {
				if (oParametros.hasOwnProperty(key)) {
					var hiddenField = document.createElement('input');
					hiddenField.setAttribute('type', 'hidden');
					hiddenField.setAttribute('name', key);
					hiddenField.setAttribute('value', oParametros[key]);
					form.appendChild(hiddenField);
				}
			}
		}
		document.body.appendChild(form);
		form.submit();
	}
	, TratarKeyUpEmailEsqueciSenha: function (evento) {
		var _this = this;

		(evento.keyCode == 13) ? _this.jqModalEsqueciSenha.find(_this.seletor_btn_esqueci_senha_enviar).focus().trigger(_this.evento_click) : 0;
	}
	, MostrarModalEsqueciSenha: function () {
		var _this = this;

		_this.jqModalEsqueciSenha.modal();
	}
	, EsconderModalEsqueciSenha: function () {
		var _this = this;

		_this.jqModalEsqueciSenha.modal('hide');
	}
	, ValidarFormularioEsqueciSenha: function () {
		var _this = this;

		var tbxEmail = _this.jqModalEsqueciSenha.find(_this.seletor_tbx_email_esqueci_senha),
			Erro = '';

		if (tbxEmail.val().trim() == '') { Erro += '- Informe seu email;'; tbxEmail.focus(); }

		if (Erro != '') {
			_this.jqModalEsqueciSenha.find(_this.seletor_div_mensagem_esqueci_senha_paragrafo).slideUp(400, function () {
				$(this).html(Erro.replace(/;/g, '\<br\/\>')).slideDown(400);				
			});
			return false;
		} else {
			try {
				$.ajax({
					method: 'POST',
					url: _this.string_url_esqueci_senha,
					contentType: 'application/json',
					data: JSON.stringify({
						email: tbxEmail.val().trim(),
						brand_id: oInicial.Brand_ID
					}),
					beforeSend: function (jqXHR) {
						_this.jqModalEsqueciSenha.find(_this.seletor_div_mensagem_esqueci_senha_paragrafo).slideUp(400, function () {
							$(this).html('');
						});
						_this.jqModalEsqueciSenha.find(_this.seletor_btn_esqueci_senha_enviar).addClass('inativo disabled');
						tbxEmail.addClass('ativo').attr('disabled', 'disabled');
						//_this.jqModalEsqueciSenha.find('.loader .glyphicon-refresh').slideDown(400, function () { $(this).removeClass('hidden'); });
					}
				})
					.done(function (poJSON) {
						poJSON.Sucesso ? tbxEmail.val('') : tbxEmail.focus();
						
						_this.jqModalEsqueciSenha.find(_this.seletor_div_mensagem_esqueci_senha_paragrafo).promise().done(function () {
							$(this).html(poJSON.Mensagem);
							_this.jqModalEsqueciSenha.find(_this.seletor_btn_esqueci_senha_enviar).removeClass('inativo disabled');
							_this.jqModalEsqueciSenha.find(_this.seletor_div_mensagem_esqueci_senha_paragrafo).slideDown(400);
							tbxEmail.removeClass('ativo').removeAttr('disabled');
						});
					})
					.fail(function (jqXHR, textStatus) {
						console.log(textStatus);
						_this.jqModalEsqueciSenha.find(_this.seletor_btn_esqueci_senha_enviar).removeClass('inativo disabled');
						_this.jqModalEsqueciSenha.find(_this.seletor_div_mensagem_esqueci_senha_paragrafo).slideDown(400);
						tbxEmail.removeClass('ativo');
					})
					.always(function (jqXHR, textStatus) {
						//_this.jqModalEsqueciSenha.find('.loader .glyphicon-refresh').slideUp(400, function () {
						//	$(this).addClass('hidden');
						//	_this.jqModalEsqueciSenha.find(_this.seletor_btn_esqueci_senha_enviar).removeClass('inativo disabled');
						//	_this.jqModalEsqueciSenha.find(_this.seletor_div_mensagem_esqueci_senha_paragrafo).slideDown(400);
						//	tbxEmail.removeClass('ativo');
						//});
					})
				;
			} catch (e) {
				console.log(e.message);
			}
		}
	}
	//Métodos - Fim
}
$(document).ready(function () {
	oGeral.Carregar();
	if ($.datetimepicker != undefined) {
		$.datetimepicker.setLocale('pt-BR');
	}
});