var oPainel = {
	//Objetos
	jqThis: null

	//Strings
	, string_html_span_qtd_pedidos_pendentes: '<span class="qtd_pedidos_pendentes"></span>'

	//Seletores
	, seletor_geral: '.conteudo-painel'
	, seletor_item_pedidos_pendentes: '.item-pedidos-pendentes'
	, seletor_qtd_pedidos_pendentes: '.qtd_pedidos_pendentes'

	//Eventos

	//Métodos
	, Iniciar: function () {
		var _this = oPainel;

		_this.jqThis = $(_this.seletor_geral);
		if (_this.jqThis.length) {
			_this.ConfigurarEscutas();
		}
	}
	, ConfigurarEscutas: function () {
		var _this = oPainel;


	}
	, TratarInfoOrdersPendentes: function (Dados) {
		var _this = oPainel;

		if (Dados.length) {
			var StringQtdPedidos = (Dados.length > 99 ? '+99' : Dados.length.toString());
			_this.jqThis.find(_this.seletor_item_pedidos_pendentes).append(_this.string_html_span_qtd_pedidos_pendentes).find(_this.seletor_qtd_pedidos_pendentes).text(StringQtdPedidos);
		}
	}
}
$(document).ready(function () {
	oPainel.Iniciar();
});

dbControl.CallbackOpenOnSuccess = function () {
	jQuery(document).ready(function () {
		var user = oOffline.getCookie(cookie_user_name);
		user = JSON.parse(user);
		dbControl.SelectALL(dbControl.Orders_Pending.Name, function (result) {
			var Dados = [];
			if (result != null && result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					var obj = result[i];
					if (obj.StatusSync.toLowerCase() != "sincronizado" && obj.DadosPgto.userId == user.User_ID) {
						Dados.push(obj);
					}
				}
				oPainel.TratarInfoOrdersPendentes(Dados);
			}
		});
	});
}