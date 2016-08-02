var Teste = {
	jqThis: null
	, Carregar: function () {
		var _this = this;

		_this.jqThis = jQuery('html');

		if (_this.jqThis.length) {
			_this.AdicionarScriptTestadorDePublicidade();
		}
	}
	, AdicionarScriptTestadorDePublicidade: function () {
		var _this = this;

		try {
			_this.jqThis.find('body').append('<span id="teste-de-bloqueador-de-publicidade" class="hidden"></span>');
		} catch (e) {
			alert(e.message);
		}
	}
}
Teste.Carregar();