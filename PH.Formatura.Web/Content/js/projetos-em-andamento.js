var oProjetos = {
	//Objetos - Início
	jqThis: null
	//Objetos - Fim

	//Strings - Início
	, string_url_excluir_projeto: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + '/Painel/ExcluirProjeto'
	, string_html_svg_loader_excluir: '<svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-hourglass loader-projeto-excluir"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><g><path fill="none" stroke="#afafaf" stroke-width="5" stroke-miterlimit="10" d="M58.4,51.7c-0.9-0.9-1.4-2-1.4-2.3s0.5-0.4,1.4-1.4 C70.8,43.8,79.8,30.5,80,15.5H70H30H20c0.2,15,9.2,28.1,21.6,32.3c0.9,0.9,1.4,1.2,1.4,1.5s-0.5,1.6-1.4,2.5 C29.2,56.1,20.2,69.5,20,85.5h10h40h10C79.8,69.5,70.8,55.9,58.4,51.7z" class="glass"></path><clipPath id="uil-hourglass-clip1"><rect x="15" y="20" width="70" height="25" class="clip"><animate attributeName="height" from="25" to="0" dur="1s" repeatCount="indefinite" vlaues="25;0;0" keyTimes="0;0.5;1"></animate><animate attributeName="y" from="20" to="45" dur="1s" repeatCount="indefinite" vlaues="20;45;45" keyTimes="0;0.5;1"></animate></rect></clipPath><clipPath id="uil-hourglass-clip2"><rect x="15" y="55" width="70" height="25" class="clip"><animate attributeName="height" from="0" to="25" dur="1s" repeatCount="indefinite" vlaues="0;25;25" keyTimes="0;0.5;1"></animate><animate attributeName="y" from="80" to="55" dur="1s" repeatCount="indefinite" vlaues="80;55;55" keyTimes="0;0.5;1"></animate></rect></clipPath><path d="M29,23c3.1,11.4,11.3,19.5,21,19.5S67.9,34.4,71,23H29z" clip-path="url(#uil-hourglass-clip1)" fill="#292664" class="sand"></path><path d="M71.6,78c-3-11.6-11.5-20-21.5-20s-18.5,8.4-21.5,20H71.6z" clip-path="url(#uil-hourglass-clip2)" fill="#292664" class="sand"></path><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="180 50 50" repeatCount="indefinite" dur="1s" values="0 50 50;0 50 50;180 50 50" keyTimes="0;0.7;1"></animateTransform></g></svg>'
	//Strings - Fim

	//Eventos - Início
	, evento_click: 'click'
	//Eventos - Fim

	//Seletores - Início
	, seletor_geral: '.conteudo-projetos-em-andamento'
	, seletor_projeto_btn_excluir: '.ancora-acao-excluir-projeto'
	, seletor_projeto_btn_excluir_nao_ativo: '.ancora-acao-excluir-projeto:not(.ativo)'
	, seletor_svg_loader_excluir: '.loader-projeto-excluir'
	//Seletores - Fim

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

		_this.jqThis
			.on(_this.evento_click, _this.seletor_projeto_btn_excluir_nao_ativo, function (evento) { _this.ExcluirProjeto(evento, this); return false; })
		;
	}
	, ExcluirProjeto: function (evento, elemento) {
		var _this = this;

		var book_id = jQuery(elemento).attr('book_id');

		jQuery.ajax({
			type: 'POST',
			url: _this.string_url_excluir_projeto,
			contentType: 'application/json',
			data: JSON.stringify({
				'book_id': book_id
			}),
			dataType: 'json',
			beforeSend: function (jqXHR) {
				jQuery(elemento).addClass('hidden');
				jQuery(elemento).closest('td').append(_this.string_html_svg_loader_excluir);
			}
		})
		.done(function (poJSON) {
			if (poJSON.Sucesso) {
				jQuery(elemento).closest('tr').fadeOut('slow', function () { jQuery(this).remove(); });
			} else {

			}
		})
		.fail(function () {
			jQuery(elemento).removeClass('hidden');
			jQuery(elemento).siblings(_this.seletor_svg_loader_excluir).remove();
		})
		.always(function () {
		})
		;
	}
	//Métodos - Fim
}
jQuery(document).ready(function () {
	oProjetos.Carregar();
});