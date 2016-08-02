var oAlbuns = {
	//Objetos - Início
	jqThis: null
	, album: ''
	//Objetos - Fim

	//Strings - Início
	//, string_html_visualizador_paginas: '<div class="{$class}" style="background-image:url({$url})"></div>'
	, string_html_visualizador_paginas: '<div style="background-image:url({$url})"></div>'
	, string_html_visualizador_pagina_sem_foto: '<div style="background-color: #ebebeb;"></div>'
	, string_html_visualizador_flipbook_controle_anterior: '<span class="controle-flipbook anterior cursor-pointer"><a class="svg">&nbsp;</a></span>'
	, string_html_visualizador_flipbook_controle_proximo: '<span class="controle-flipbook proximo cursor-pointer"><a class="svg">&nbsp;</a></span>'
	, string_path_albuns: 'http://isrv.pixelhouse.com.br/formatura/images/albuns/'
	, string_orientacao_landscape: 'Para melhorar a navegação, utilize a orientação landscape'
	, string_html_visualizador_flipbook_script: '<script type="text/javascript" id="script_load_app">'
													+ '	function loadApp{$P}() {'
													+ '		/*var flipbook = jQuery(".flipbook");'
													+ '		if (flipbook.width()==0 || flipbook.height()==0) {'
													+ '			setTimeout(loadApp{$P}, 10);'
													+ '			return;'
													+ '		}'
													+ '		jQuery(".flipbook .double").scissor();*/'
													+ '		jQuery(".flipbook").turn({'
													+ '				width: 982.4,'
													+ '				height: 614,'
													+ '				elevation: 50,'
													+ '				gradients: true,'
													+ '				autoCenter: true'
													+ '		});'
													+ '	}'
													+ '	yepnope({'
													+ '		test : Modernizr.csstransforms,'
													+ '		yep: ["../Content/js/framework/turn.min.js"],'
													+ '		nope: ["../Content/js/framework/turn.html4.min.js"],'
													+ '		both: ["../Content/css/flipbook-basic.min.css"],'
													+ '		complete: loadApp{$P}'
													+ '	});'
													+ '</script>'
	//Strings - Fim

	//Constantes - Início
	, constante_qtd_max_imagens_por_album: 0
	//Constantes - Fim

	//Eventos - Início
	, evento_click: 'click'
	, evento_load: 'load'
	, evento_end: 'end'
	//Eventos - Fim

	//Seletores - Início
	, seletor_geral: '.conteudo-albuns'
	, seletor_ancora_album: '.ancora-album'
	, seletor_body: 'body'
	, seletor_bg_fader: '#bg-fader'
	, seletor_fechar_visualizador: '#fechar-visualizador'
	, seletor_visualizador_de_album: '#visualizador-de-album'

	, seletor_visualizador_viewport: '.flipbook-viewport'
	, seletor_visualizador_container: '.flipbook-viewport .container'
	, seletor_visualizador_flipbook: '.flipbook-viewport .container .flipbook'
	, seletor_visualizador_flipbook_script: '#script_load_app'
	, seletor_flipbook_controle_anterior: '.flipbook .controle-flipbook.anterior'
	, seletor_flipbook_controle_proximo: '.flipbook .controle-flipbook.proximo'
	//Seletores - Fim

	//Métodos - Início
	, ConfigurarObjeto: function () {
		var _this = this;

		_this.jqThis = jQuery(_this.seletor_visualizador_de_album);

		if (_this.jqThis.length) {
			_this.album = oUtil.Url_Parametro('album');
			_this.constante_qtd_max_imagens_por_album = parseInt(oUtil.Url_Parametro('qtd_fotos'));
			_this.MontarVisualizador();
			_this.ConfigurarBinds();
		}
	}
	, ConfigurarBinds: function () {
		var _this = this;

		_this.jqThis
		//	.on(_this.evento_click, _this.seletor_ancora_album, function(e){ _this.MontarVisualizador(e, this); return false; })
			.on(_this.evento_click, _this.seletor_flipbook_controle_anterior, function () { jQuery('.flipbook').turn('previous'); })
			.on(_this.evento_click, _this.seletor_flipbook_controle_proximo, function () { jQuery('.flipbook').turn('next'); })
			.on(_this.evento_end, _this.seletor_visualizador_flipbook, function (event, pageObject, turned) { console.log(1); })
		;
	}
	, MontarVisualizador: function (evento, elemento) {
		var _this = this;

		var album = _this.album;
		var arquivo = '';

		var pagina = '';
		var classe = '';
		var url = '';

		var i;
		for (i = 2; i <= _this.constante_qtd_max_imagens_por_album; i++) {
			arquivo = '00' + (i).toString();
			arquivo = arquivo.substr(arquivo.length - 3, 3) + '.jpg';

			//classe = ((i==0 || i+1 == _this.constante_qtd_max_imagens_por_album) ? 'page' : 'double');
			classe = '';

			url = (_this.string_path_albuns + album + '/' + arquivo);

			pagina = _this.string_html_visualizador_paginas;
			pagina = pagina.replace('{$class}', classe).replace('{$url}', url);

			//adiciona a contra-capa em sem foto
			if (i == 3)
				jQuery(_this.seletor_visualizador_flipbook).append(_this.string_html_visualizador_pagina_sem_foto);

			//adiciona a foto
			jQuery(_this.seletor_visualizador_flipbook).append(pagina);

			//se a qtd de fotos for impar e for a penultima foto adiciona um folha sem foto
			if (_this.constante_qtd_max_imagens_por_album % 2 == 1 && i + 1 == _this.constante_qtd_max_imagens_por_album) {
				jQuery(_this.seletor_visualizador_flipbook).append(_this.string_html_visualizador_pagina_sem_foto);

			}

			//se for a última foto adiciona o verso
			if (i == _this.constante_qtd_max_imagens_por_album) {
				jQuery(_this.seletor_visualizador_flipbook).append(_this.string_html_visualizador_pagina_sem_foto);
				jQuery(_this.seletor_visualizador_flipbook).append(pagina.replace(url, (_this.string_path_albuns + album + '/001.jpg')));
			}
		}

		jQuery(_this.seletor_body).append(_this.string_html_visualizador_flipbook_script.replace(/\{\$P\}/g, album));
	}
	, RedimensionarVisualizador: function () {
		var _this = this;

		//var largura = parseInt(window.innerWidth * 0.75);
		//var altura = parseInt(largura / 2 * 1.25);
		var altura = parseInt(window.innerHeight * 0.68);
		var largura = parseInt(altura * 0.8 * 2);
		if (jQuery(_this.seletor_visualizador_flipbook).length && jQuery(_this.seletor_visualizador_flipbook).turn('is')) {
			jQuery(_this.seletor_visualizador_flipbook).turn('size', largura, altura);
		}
	}
	//Métodos - Fim
}
jQuery(document).ready(function () {
	oAlbuns.ConfigurarObjeto();
});
jQuery(window).load(function () {
	setTimeout(function () {
		jQuery(oAlbuns.seletor_visualizador_flipbook)
			.append(oAlbuns.string_html_visualizador_flipbook_controle_anterior)
			.append(oAlbuns.string_html_visualizador_flipbook_controle_proximo)
		;
	}, 1000);
	setTimeout(function () {

		oAlbuns.jqThis.fadeIn('slow', function () {
		});

		oAlbuns.RedimensionarVisualizador();

	}, 2000);
	setTimeout(function () {
		//oAlbuns.RedimensionarVisualizador();
	}, 3000);

});