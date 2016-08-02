var oGerencial = {
	//Objetos - Início
	jqThis: null
	, ListVendedor: null
	//Objetos - Fim

	//Eventos - Início
	, evento_click: 'click'
	//Eventos - Fim

	//Seletores - Início
	, seletor_geral: '.conteudo-geral'
	, bootstrap_table: null
	//Seletores - Fim

	//Métodos - Início
	, Carregar: function (BootstrapTable) {
		var _this = this;

		_this.jqThis = jQuery(_this.seletor_geral);

		if (_this.jqThis.length) {
			_this.CarregarEventos();
			_this.bootstrap_table = BootstrapTable;
		}
	}
	, CarregarEventos: function () {
		var _this = this;
		var bootstrapTable = _this.jqThis.find(_this.bootstrap_table);
		bootstrapTable.on('post-body.bs.table', function (data) {
			
		});
	}
	, BtnDetalhes: function (value, row) {
	    var id = "lnkGotoProducts" + row.order_id + "_" + row.BrandID;

	    var data_values = "";
	    var link = url_detalhes + "?OrderID=" + row.order_id;

	    return "<a class='lnk_detalhes' href='" + link + "'> <span class='glyphicon glyphicon-zoom-in' aria-hidden='true'></span> </a>";

	    //return "<a id='" + id + "' " + data_values + " onclick=\"javascript:{oAluno.OpenProducts(" + row.order_id + ")}\" href='#' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored'>Produtos</a>";
	}
	//Métodos - Fim    
}
jQuery(document).ready(function () {
	oGerencial.Carregar(BootstrapTable);
});