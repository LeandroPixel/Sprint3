var oDetalhes = {

    //Objetos - Início
    jqThis: null

    //Eventos - Início
	, evento_click: 'click'
    //Eventos - Fim

    //Seletores - Início
	, seletor_geral: '.conteudo-geral'
    , seletor_opcoes: '.jqOpt'
    , seletor_painel_dados: '.mdl-tabs__panel'
    //Seletores - Fim

    //variaveis    
    //, url_api_agendamento: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/api/Agendamento/Agendar"

    //Métodos - Início
	, Carregar: function () {

	    var _this = this;

	    _this.jqThis = jQuery(_this.seletor_geral);

	    if (_this.jqThis.length) {
	        _this.CarregarEventos();
	    }

	}
    , CarregarEventos: function () {
        var _this = this;

        _this.jqThis.find(_this.seletor_opcoes).on(_this.evento_click, function (e) {

            _this.jqThis.find(_this.seletor_opcoes).parent().removeClass("active");
            _this.jqThis.find(e.target).parent().addClass("active");
            _this.jqThis.find(_this.seletor_painel_dados).removeClass("is-active");

            var painel_ativo = _this.jqThis.find(e.target).attr("data-ref");

            _this.jqThis.find(painel_ativo).addClass("is-active");
            
        });

    }
}

jQuery(document).ready(function () {
    //oUtil.ShowLoader(true);
    oDetalhes.Carregar();

});