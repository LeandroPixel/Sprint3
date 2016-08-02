var oCheckoutConfirm = {
	//Objetos - Início
	jqThis: null
	//Objetos - Fim

	//Strings - Início
	, string_url_base_aplicacao: oInicial.BaseUrlAplicacao
	//, string_url_x: '/'
	, string_intervalo_animacao: 400
    , string_pgto_cartao: "cartao-credito"
    , string_pgto_boleto: "boleto"
    , string_pgto_cheque: "cheque"
    , string_pgto_dinheiro: "dinheiro"
	, string_ChaveSessionStorageDadosConclusao: 'dados_conclusao_pedido'
	, string_pedido_realizado_com_sucesso_online: 'Pedido realizado com sucesso.'
	, string_pedido_realizado_com_sucesso_offline: 'Pedido registrado com sucesso, porém aguardando sincronização.'
	//, string_svg_icon_pedido_com_sucesso: '<svg fill="#00AD00" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
	//, string_svg_icon_pedido_sem_sucesso: '<svg fill="#DD0000" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>'
	, string_url_painel: oInicial.BaseUrlAplicacao + '/Painel'
	//Strings - Fim

	//Eventos - Início
	, evento_click: 'click'
	, evento_change: 'change'
	, evento_keyup: 'keyup'
	, evento_keydown: 'keydown'
	, evento_blur: 'blur'
	, evento_focus: 'focus'
	//Eventos - Fim

	//Seletores - Início
	, seletor_geral: '.conteudo-geral'
	, seletor_divPedidoConcluidoOnline: '.divPedidoConcluidoOnline'
	, seletor_divPedidoConcluidoOffline: '.divPedidoConcluidoOffline'
	, seletor_h3_msg_status_pedido: '.h3-msg-status-pedido'
	, seletor_span_msg_code_pedido: '.span-msg-code-pedido'
	, seletor_divPedidoInfoStatus: '.divPedidoInfoStatus'
	, seletor_div_infos: '.div-infos'
	//Seletores - Fim

	//Métodos - Início
	, Carregar: function () {
		var _this = this;

		oUtil.ShowLoader(true);

		//NORMATIRAZAR STRINGS
		//_this.string_url_x = _this.string_url_base_aplicacao + _this.string_url_x;
		//FIM NORMATIRAZAR STRINGS

		_this.jqThis = $(_this.seletor_geral);

		if (_this.jqThis.length) {
			_this.CarregarEventos();
		}

	}
	, CarregarEventos: function () {
		var _this = this;

		//_this.jqThis
		//	.on(_this.evento_click, _this.seletor_ancora_pedido_forma_pgto, function () { _this.TratarTrocaOpcoesPgto(); })
		//;
	}
	, LimparSessionStorageDadosConclusao: function () {
		var _this = this;

		window.sessionStorage.removeItem(_this.string_ChaveSessionStorageDadosConclusao);
	}
	, VerificarDadosConclusaoPedido: function () {
		var _this = this;
		var oDadosConclusao = null;
		try {
			oDadosConclusao = JSON.parse(window.sessionStorage.getItem(_this.string_ChaveSessionStorageDadosConclusao));
		} catch (e) {
		}
		
		if (oDadosConclusao == null) {
			console.log('SESSION STORAGE SEM DADOS (oDadosConclusao=null)');
			window.document.location.href = _this.string_url_painel;
			return false;
		}

		oUtil.ShowLoader(false);
		_this.PreencherDadosConclusaoPedido(oDadosConclusao);
		
	}
	, PreencherDadosConclusaoPedido: function (Dados) {
		var _this = this;
		var TextoMsgStatus = '';
		
		_this.jqThis.find(_this.seletor_span_msg_code_pedido).text(Dados.Code);

		switch (Dados.Origem) {
			case 'ONLINE':
				_this.jqThis.find(_this.seletor_h3_msg_status_pedido).text(_this.string_pedido_realizado_com_sucesso_online);
				_this.jqThis.find(_this.seletor_divPedidoConcluidoOffline).hide();
				_this.jqThis.find(_this.seletor_divPedidoConcluidoOnline).slideDown(_this.string_intervalo_animacao);
				break;
			case 'OFFLINE':
				_this.jqThis.find(_this.seletor_h3_msg_status_pedido).text(_this.string_pedido_realizado_com_sucesso_offline);
				_this.jqThis.find(_this.seletor_divPedidoConcluidoOnline).hide();
				_this.jqThis.find(_this.seletor_divPedidoConcluidoOffline).slideDown(_this.string_intervalo_animacao);
				break;
			default:
				break;
		}

	}
	//Métodos - Fim
}

$(document).ready(function () {
	oOffline.verifyAcesso();
	oCheckoutConfirm.Carregar();
});

dbControl.CallbackOpenOnSuccess = function () {
	oCheckoutConfirm.VerificarDadosConclusaoPedido();
	oCheckoutConfirm.LimparSessionStorageDadosConclusao();
}