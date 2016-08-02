var oSupervisor = {
	//Objetos - Início
	jqThis: null
	, ListVendedor: null
	//Objetos - Fim

	//Eventos - Início
	, evento_click: 'click'
	//Eventos - Fim

	//Seletores - Início
	, seletor_geral: '.conteudo-geral'
	, bootstrap_table: '#table-associa-alunos-vendedor-list'
	//Seletores - Fim

	//variaveis    
	, url_api_change_vendedor: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/api/Supervisor/ChangeVendedor"

	//Métodos - Início
	, Carregar: function (ListVendedor) {
		var _this = this;

		_this.jqThis = jQuery(_this.seletor_geral);
		_this.ListVendedor = ListVendedor;

		if (_this.jqThis.length) {
			_this.CarregarEventos();
		}
	}
	, CarregarEventos: function () {
		var _this = this;
		var bootstrapTable = _this.jqThis.find(_this.bootstrap_table);
		bootstrapTable.on('post-body.bs.table', function (data) {
			
		});
	}

	, MostrarVendedores: function (value, row) {
		return oSupervisor.ReturnMostrarVendedores(value, row.VendedorID, row.AlunoTurmaID);

	}
	, ReturnMostrarVendedores: function (nameVendedor, vendedorID, alunoTurmaID) {
		var html = "<div class='dropdown'> " +
					"      <button class='btn btn-default dropdown-toggle' type='button' id='btnAssociaVendedor" + alunoTurmaID + "' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'> " +
					"        " + nameVendedor +
					"        <span class='caret'></span> " +
					"      </button> " +
					"      <ul class='dropdown-menu' aria-labelledby='btnAssociaVendedor" + alunoTurmaID + "'> " +
							oSupervisor.ReturnVendedorOptions(vendedorID, alunoTurmaID) +
					"      </ul> " +
					"</div> ";                    
		return html;
	}
	, ReturnVendedorOptions: function (vendedorAtual, alunoTurmaID) {
		var html = "";
		jQuery(oSupervisor.ListVendedor).each(function () {
			var oThis = this;
			if (vendedorAtual != oThis.ID) {
				html += "<li><a href='javascript:oSupervisor.DoChangeVendedor(" + oThis.ID + "," + alunoTurmaID + ")'>" + oThis.Descricao + "</a></li>";
			}
		});
		return html;
	}
	, DoChangeVendedor: function (vendedorID, alunoTurmaID) {
		var _this = this;
		info = { vendedorID: vendedorID, alunoTurmaID: alunoTurmaID };
		$.ajax({
			type: 'POST',
			url: _this.url_api_change_vendedor,
			data: JSON.stringify(info),
			headers: oUtil.GetToken(),
			contentType: 'application/json',
			beforeSend: function () {
				oUtil.ShowLoader(true);
			}
		})
			.done(function (poJSON) {
				var Titulo_Modal = 'Associar Alunos a Vendedores';
				if (poJSON.Sucesso) {
					oUtil.ShowModalGeral(Titulo_Modal, poJSON.Mensagem);
					var bootstrapTable = _this.jqThis.find(_this.bootstrap_table);
					bootstrapTable.bootstrapTable('refresh', null)
				}
			})
			.fail(function (jqXHR, textStatus) {
				oUtil.ShowModalError("", "", jqXHR, 'Associar Alunos a Vendedores');
			})
			.always(function (jqXHR, textStatus) {
				oUtil.ShowLoader(false);
			})
		;
	}

	//Métodos - Fim    
}
jQuery(document).ready(function () {
	oSupervisor.Carregar(ListVendedor);
});