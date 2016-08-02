var oPage = {
    //Objetos - Início
    jqThis: null
    , oPhotos: null
    , oSwiper: null
	, IntervaloMouseHoldThumbImg: null
    //Objetos - Fim
    
    //Eventos - Início
	, evento_click: 'click'
	, evento_mousedown: 'mousedown'
	, evento_mouseup: 'mouseup'
	, evento_contextmenu: 'contextmenu'
	, evento_touchend: 'touchend'
	, evento_wheel: 'wheel'
	, evento_keydown: 'keydown'
    //Eventos - Fim

    //Seletores - Início
	, seletor_geral: 'body'
	, seletor_foto_selecionar: '.cont-foto li:not(.grid-sizer)'
    , seletor_foto_selecionar_img: '.cont-foto li img'
    , seletor_foto_filtro: '.resumo-fotos a'
    , seletor_btn_eu_quero: '.btn-eu-quero'
    , seletor_btn_view_thumb: '#btn-view-thumb'
    , seletor_btn_view_big: '#btn-view-big'
	, seletor_btn_view_flip: '#btn-view-flip'
	, seletor_btn_change_view: '.dvImageView a'
    , seletor_foto_selecionar_view_big: '.swiper-wrapper .swiper-slide .cont-img'
    , seletor_foto_selecionar_view_big_img: '.swiper-wrapper .swiper-slide .cont-img img'
    , seletor_resumo: '.resumo-fotos'
    , seletor_btn_fechar: '.btnFechar'
	, seletor_thumbs: '.thumbs'
	, seletor_hold_preview: '.hold-preview'
	, seletor_bg_hold_preview: '.bg-hold-preview'
	, seletor_div_fechar_hold_preview: '.div-fechar-hold-preview'
	, seletor_view_thumb_foto: '#view-thumb-foto'
	, seletor_swiper_container: '.swiper-container'
	, seletor_btn_carrousel_next: '.btn-carrousel-next'
	, seletor_btn_carrousel_prev: '.btn-carrousel-prev'
    , seletor_all_img: 'img'
    //Seletores - Fim

	//variaveis
	, string_active: 'active'
    , filtro: "todas"
    , limit_percent_discart: 0.00
    , percent_atual: 0
    , viewType: "thumb"
    , urlRender: ""
    , token: ""
    , delayFotos: 800
    , _fotos_excluidas_qtd: 0
    , _fotos_selecionadas_qtd: 0
    , url_api_select_photo: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/api/Agendamento/SelectPhoto"
    , albumIDCript: ""
    //, url_api_go_to_cart: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + (oInicial.UrlRetorno || '')
    , url_api_go_to_cart: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/api/Agendamento/GoToCart"    
    , alunoTurmaID : 0
    , productID: 0
    , qtdMinFoto: 0
    , qtdMaxFoto: 0
    , urlRetorno: ""
    , isFirstAcess: false

    //Métodos - Início
	, Carregar: function (oPhotos, urlRender, token, albumIDCript, alunoTurmaID, productID, limit_percent_discart, qtdMinFoto, qtdMaxFoto, urlRetorno, isFirstAcess) {
		var _this = oPage;

	    _this.jqThis = $(_this.seletor_geral);

	    _this.oPhotos = oPhotos;
	    _this.urlRender = urlRender;
	    _this.token = token;
	    _this.albumIDCript = albumIDCript;
	    _this.alunoTurmaID = alunoTurmaID;
	    _this.productID = productID;	    
	    _this.limit_percent_discart = limit_percent_discart;
	    _this.qtdMinFoto = parseInt(qtdMinFoto);
	    _this.qtdMaxFoto = parseInt(qtdMaxFoto);
	    _this.urlRetorno = urlRetorno;
	    _this.isFirstAcess = isFirstAcess;	    

	    if (_this.jqThis.length) {
	    	_this.CarregarEventos();
	    }
	    _this.CalculaResumo(_this.oPhotos);

	    oTurn.mIniciar();
	}
	, CarregarEventos: function () {
		var _this = oPage;

		$(_this.seletor_foto_filtro).on(_this.evento_click, function (evento) { _this.ShowFotos(this); _this.TratarCliqueAncorasResumoFotos(this); return false; });
		$(_this.seletor_btn_eu_quero).on(_this.evento_click, function (evento) { _this.EuQuero(evento, this); return false; });
		$(_this.seletor_btn_change_view).on(_this.evento_click, function (evento) { _this.ChangeView(evento, $(this).attr('data-view-type').toLowerCase()); return false; });
		$(_this.seletor_btn_fechar).on(_this.evento_click, function (evento) { _this.ChangeView(evento, 'thumb'); return false; });
		$(_this.seletor_view_thumb_foto).isotope({ itemSelector: 'li', percentPosition: true });
		$(_this.seletor_foto_selecionar).on(_this.evento_click, function (evento) { _this.SelecionarFoto(evento, this); return false; });
		$(_this.seletor_all_img).on(_this.evento_contextmenu, function (evento) { _this.TratarOnContextMenu(evento); });
	    $(_this.seletor_thumbs).on(_this.evento_touchend, function (e) { _this.TratarTouchEndThumbs(e); });
	    $(_this.seletor_thumbs).longTouch(function (escopo, evento) { _this.TratarLongTouch(escopo, evento); }, 125);
	    $(_this.seletor_swiper_container)
			.on(_this.evento_wheel, function (evento) { _this.TratarRolada(evento); })
		;
		
	    $(document).on(_this.evento_keydown, function (evento) { _this.TratarKeyDown(evento); });
	}
	, TratarKeyDown: function (evento) {
		var _this = oPage;

		if ($(_this.seletor_swiper_container).is(':visible')) {
			if (evento.keyCode == 37 || evento.keyCode == 39) {
				$(evento.keyCode == 37 ? _this.seletor_btn_carrousel_prev : _this.seletor_btn_carrousel_next).trigger(_this.evento_click);					
			}
		}
	}
    , TratarOnContextMenu: function (e) {        
        e.preventDefault();        
        return false;
    }
	, TratarRolada: function (evento) {
		var _this = oPage;
		$((evento.originalEvent.wheelDelta / 120 > 0) ? _this.seletor_btn_carrousel_prev : _this.seletor_btn_carrousel_next).trigger(_this.evento_click);
	}
	, TratarTouchEndThumbs: function (e) {
		var _this = oPage;
		$(_this.seletor_hold_preview).promise().done(function () { $(_this.seletor_div_fechar_hold_preview).click();});
	}
	, TratarCliqueAncorasResumoFotos: function (obj) {
		var _this = oPage;

		oPage.RefatoraIsotope();
		$('.' + _this.string_active + '[filtro]').not(obj).removeClass(_this.string_active);
		$(obj).addClass(_this.string_active);
	}
	, TratarLongTouch: function (escopo, evento) {
		var _this = oPage;

		$(_this.seletor_hold_preview).remove();
		$(_this.seletor_bg_hold_preview).remove();
		var Clone = $(evento.target).clone();
		Clone.on(_this.evento_contextmenu, function (evento) { return _this.TratarOnContextMenu(evento); });
		var DivBgHoldPreview = $('<div class="bg-hold-preview"></div>');
		var DivHoldPreview = $('<div class="hold-preview"></div>');
		
		$('body').append(DivHoldPreview);
		
		$(DivHoldPreview).append(Clone);

	    $(DivHoldPreview).css({
	    	position: 'fixed',
	    	width: evento.target.width + 'px',
	    	height: evento.target.height + 'px',
	    	left: evento.target.x + 'px',
	    	top: (evento.target.y - Number($(evento.target).css('margin-top').replace('px', ''))) + (evento.target.width > evento.target.height ? Number($(evento.target).css('margin-top').replace('px', '')) : 0) + 'px',
	    	'z-index': 11,
	    	'border-width': 0,
	    	'border-color': '#fff',
	    	'border-style': 'solid',
	    	'opacity': $(evento.target).closest('li').css('opacity'),
	    	'-moz-opacity': $(evento.target).closest('li').css('-moz-opacity'),
	    	'filter': $(evento.target).closest('li').css('filter')
	    });

	    var margem = 40.0;
	    var proporcao, altura, largura, margem_top, margem_left;

		//Se a orientação do dispositivo for landscape
	    if (escopo[0].innerWidth > evento.target.height) {
	    	proporcao = evento.target.width / evento.target.height;
	    	
	    	largura = Number((escopo[0].innerWidth - (margem * 2)).toFixed(2));
	    	altura = Number((largura / proporcao).toFixed(2));
	    	if (((escopo[0].innerHeight - altura)) < margem) {
	    		altura = Number((escopo[0].innerHeight - (margem * 2)).toFixed(2));
	    		largura = Number((altura * proporcao).toFixed(2));
	    	}
	    } else {
	    	proporcao = evento.target.height / evento.target.width;

	    	altura = Number((escopo[0].innerHeight - (margem * 2)).toFixed(2));
	    	largura = Number((altura * proporcao).toFixed(2));
	    	if (((escopo[0].innerWidth - largura)) < margem) {
	    		largura = Number((escopo[0].innerWidth - (margem * 2)).toFixed(2));
	    		altura = Number((largura / proporcao).toFixed(2));
	    	}
	    }
	    margem_top = (Number(escopo[0].innerHeight - altura) ) / 2;
	    margem_left = (Number(escopo[0].innerWidth - largura)) / 2;

		$(DivHoldPreview).animate({
			'width': largura + 'px',
			'height': altura + 'px',
			'left': margem_left + 'px',
			'top': margem_top + 'px',
			'borderWidth': '10px',
			'opacity': 1,
			'-moz-opacity': 1,
			'filter': 'alpha(opacity=100)'
		}, 150, function () {
			$(this).append('<div class="div-fechar-hold-preview"><div class="glyphicon glyphicon-remove-sign"></div></div>');
			$('body').append(DivBgHoldPreview);
		
			var config_inicial = {
				width: evento.target.width + 'px',
				height: evento.target.height + 'px',
				left: evento.target.x + 'px',
				top: (evento.target.y - Number($(evento.target).css('margin-top').replace('px', ''))) + (evento.target.width > evento.target.height ? Number($(evento.target).css('margin-top').replace('px', '')) : 0) + 'px',
				borderWidth: 0
			};
		
			$(_this.seletor_div_fechar_hold_preview).on(_this.evento_click, function (evento) { evento.preventDefault(); _this.TratarCliqueDivFecharHoldPreview(config_inicial); });
			$(_this.seletor_bg_hold_preview).unbind().on(_this.evento_click, function (evento) { evento.preventDefault(); $(_this.seletor_div_fechar_hold_preview).trigger(_this.evento_click); });
		});

	    return false;
	}
	, TratarCliqueDivFecharHoldPreview: function (config_animate) {
		var _this = oPage;

		$(_this.seletor_div_fechar_hold_preview).remove();
		$(_this.seletor_bg_hold_preview).remove();
		$(_this.seletor_hold_preview).animate(config_animate, 150, function () {
			$(this).fadeOut(function () { $(this).remove(); });
		});
	}
    , CalculaResumo: function(oPhotos){
    	var _this = oPage;
        var total = oPhotos.length;
        var marcadas = 0;
        var desmarcadas = 0;
        for (var i = 0; i < total; i++) {
            var objFoto = oPhotos[i];
            objFoto.Selected
            if (objFoto.Selected) {
                marcadas++;
            } else {
                desmarcadas++;
            }
        }
        var fotos_selecionadas = $("#fotos_selecionadas");
        var fotos_excluidas = $("#fotos_excluidas");
        var fotos_excluidas_percent = $("#fotos_excluidas_percent");

        fotos_selecionadas.html(marcadas);
        fotos_excluidas.html(desmarcadas);
        _this._fotos_excluidas_qtd = desmarcadas;
        _this._fotos_selecionadas_qtd = marcadas;
        var percent = _this.CalculaPercent(desmarcadas, total);        
        _this.percent_atual = percent;
        fotos_excluidas_percent.html(_this.percent_atual + "%");        
    }
    , GetoPhotosById: function (id) {
    	var _this = oPage;
        var objFotoAux = null;
        for (var i = 0; i < _this.oPhotos.length; i++) {
            var objFoto = _this.oPhotos[i];
            if (id == objFoto.PhotoIDCript) {
                objFotoAux = objFoto;
                break;
            }
        }
        return objFotoAux;
    }
    , GetoPhotosByFilter: function (filter) {
    	var _this = oPage;
        var objFotoAux = [];        
        for (var i = 0; i < _this.oPhotos.length; i++) {
            var objFoto = _this.oPhotos[i];
            switch (filter.toLowerCase()) {
                case "todas":
                    objFotoAux.push(objFoto);                    
                    break;
                case "selecionadas":
                    if (objFoto.Selected) {
                        objFotoAux.push(objFoto);
                    }                    
                    break;
                case "excluidas":
                    if (!objFoto.Selected) {
                        objFotoAux.push(objFoto);                     
                    }
                    break;
            }
        }
        return objFotoAux;
    }	
    , ShowFotos: function (elemento) {
    	var _this = oPage;
    	var obj = elemento != undefined ? $(elemento) : $(_this.seletor_foto_filtro + '[filtro="todas"]');
        var tipo = obj.length > 0 ? obj.attr("filtro") : "todas";
        _this.filtro = tipo;
        var allFotos = _this.oPhotos;
        $(_this.seletor_resumo).children().removeClass("active");
        obj.addClass("active");

        switch (tipo) {
            case "todas":
                for (var i = 0; i < allFotos.length; i++) {
                    var obj = allFotos[i];
                    $("#" + obj.PhotoIDCript).show();
                }
                break;
            case "selecionadas":
                for (var i = 0; i < allFotos.length; i++) {
                    var obj = allFotos[i];
                    if (obj.Selected) {
                    	$("#" + obj.PhotoIDCript).show();
                    } else {
                    	$("#" + obj.PhotoIDCript).hide();
                    }
                }
                break;
            case "excluidas":
                for (var i = 0; i < allFotos.length; i++) {
                    var obj = allFotos[i];
                    if (obj.Selected == false) {
                    	$("#" + obj.PhotoIDCript).show();
                    } else {
                    	$("#" + obj.PhotoIDCript).hide();
                    }
                }
                break;
        }
        _this.ReloadSwiper();
    }
    , ChangeView: function (evento, tipo) {
    	var _this = oPage;

    	$(_this.seletor_btn_change_view).removeClass('active');

        if (tipo == 'thumb') {
        	$(_this.seletor_btn_view_thumb).addClass('active');
        	$(_this.seletor_swiper_container).hide();
        	$(oTurn.sContainerTurn).hide();
        	$('#section-principal').removeClass('swiper-ativo');
        } else if (tipo == 'big') {
        	$(_this.seletor_btn_view_big).addClass('active');
        	$(_this.seletor_swiper_container).css('opacity', 1).show();
        	$(oTurn.sContainerTurn).hide();
        	$('#section-principal').addClass('swiper-ativo');
            _this.ReloadSwiper();
        } else if (tipo == 'flip') {
        	$(_this.seletor_btn_view_flip).addClass('active');
        	$('#section-principal').addClass('swiper-ativo');
        	$(oTurn.sContainerTurn).show();
        	oTurn.mReconfigurarTurn();
        }
        _this.AjustarMargemImgSwiper();
        _this.viewType = tipo.toLowerCase();
    }
	, AjustarMargemImgSwiper: function () {
		var _this = oPage;
		$(_this.seletor_foto_selecionar_view_big_img).each(function (e) {
			$(this).css('margin-top', ((window.innerHeight - this.height) / 2) + 'px');
		});
	}
    , CriaSwiper: function (filtro) {
    	var _this = oPage;
    	var swiperWrapper = $(_this.seletor_swiper_container).find(".swiper-wrapper");
        var oPhotosWithFilter = _this.GetoPhotosByFilter(filtro);

        for (var i = 0; i < oPhotosWithFilter.length; i++) {
            var html = '';
            var objFoto = oPhotosWithFilter[i];
            var objFotoHtml = swiperWrapper.find("#sw_" + objFoto.PhotoIDCript);
            if (objFotoHtml.length == 0) {
                html = '<div class="swiper-slide" id="sw_' + objFoto.PhotoIDCript + '">' +
                            '<div class="cont-img" photoid="' + objFoto.PhotoIDCript + '">' +
                                '<img alt="' + objFoto.Nome + '" title="' + objFoto.Nome + '" src="' + _this.urlRender + "/?hash=" + objFoto.RenderMain + '&t=' + _this.token + '" class="' + (objFoto.Height > objFoto.Width ? 'portrait' : 'landscape') + ' ' + (objFoto.Selected ? 'selecionado' : 'nao-selecionado') + '" /> ' +
                                '<div class="checks">' +
                                    '<div class="check-img ' + (objFoto.Selected ? 'selecionado' : 'nao-selecionado') + '"></div> ' +
                                    '<div class="no-check-img ' + (objFoto.Selected ? 'nao-selecionado' : 'selecionado') + '"></div> ' +
                                '</div>' +                                 
                            '</div>' +
                        '</div>';

                _this.oSwiper == null ? swiperWrapper.append(html) : _this.oSwiper.appendSlide(html);
            } else {
            	var elementoImg = objFotoHtml.find("img");
                (objFoto.Selected) ? elementoImg.removeClass('nao-selecionado').addClass('selecionado').parent().addClass('selecionado') : elementoImg.removeClass('selecionado').addClass('nao-selecionado').parent().removeClass('selecionado');
            }
        }

        _this.jqThis.find(_this.seletor_swiper_container + " " + _this.seletor_all_img).on(_this.evento_contextmenu, function (evento) { _this.TratarOnContextMenu(evento); });
    	
        if (_this.oSwiper == null) {
        	_this.oSwiper = new Swiper(_this.seletor_swiper_container, {
            	nextButton: _this.seletor_btn_carrousel_next
                , prevButton: _this.seletor_btn_carrousel_prev
                , spaceBetween: 30
            });

            _this.jqThis
                .on(_this.evento_click, _this.seletor_foto_selecionar_view_big, function (evento) { _this.SelecionarFotoSwiper(evento, this); return false; })
            ;
        }
    }
    , ReloadSwiper: function () {
    	var _this = oPage;
        _this.DestroySwiper();
        _this.CriaSwiper(_this.filtro);
    }
    , DestroySwiper: function () {
    	var _this = oPage;
        if (_this.oSwiper != null) {
            _this.oSwiper.removeAllSlides();
        }
    }
    , DoSelecionarFoto: function (id) {        
    	var _this = oPage;

        var modal = $("#div-limite-fotos-modal");
        modal.modal('hide');
        
        var obj = $("#"+id);
        var photoID = obj.attr("id");
        var objFoto = _this.GetoPhotosById(photoID);
        var objFotoHtmlSwiper = $("#sw_" + photoID);
        var elementoImg = objFotoHtmlSwiper.find("img");

        var objAjax =
        {
            AlbumIDCript: _this.albumIDCript
            , AlunoTurmaID: _this.alunoTurmaID
            , ProductID: _this.productID
            , QtdMinFoto: _this.qtdMinFoto
            , QtdMaxFoto: _this.qtdMaxFoto
            , isFirstAcess: _this.isFirstAcess
            , fotos: [
              {
                  PhotoIDCript: photoID
                  , Selected: !objFoto.Selected
              }
            ]
        };        

        _this.RecalculaResumo(!objFoto.Selected, true)

        oUtil.ShowLoader(true);
        $.ajax({
            url: _this.url_api_select_photo
            , data: JSON.stringify(objAjax)
			, contentType: 'application/json'
            , method: "POST"
            , headers: oUtil.GetToken()
        }).fail(function (data, textStatus, jqXHR) {

            oUtil.ShowModalError("", "", data);

        }).done(function (data, textStatus, jqXHR) {
            var _this = oPage;
            if (data.Sucesso == false) {
                oUtil.ShowModalError("", data.Mensagem);
                return;
            }

            for (var i = 0; i < data.Obj.fotos.length; i++) {
                var objFoto = data.Obj.fotos[i];
                obj = $(document.getElementById(objFoto.PhotoIDCript));
                var objSw = oPage.jqThis.find("#sw_" + objFoto.PhotoIDCript).find("img");
                elementoImg = oPage.jqThis.find("#sw_" + objFoto.PhotoIDCript).find(".check-img");
                elementoImg2 = oPage.jqThis.find("#sw_" + objFoto.PhotoIDCript).find(".no-check-img");
                var oPhotoPage = oPage.GetoPhotosById(objFoto.PhotoIDCript);
                //var check = obj.find(".check-img");
                var check = obj.find("img");

                if (_this.filtro == "selecionadas" && !objFoto.Selected) {
                    obj.hide(_this.delayFotos);
                } else if (_this.filtro == "excluidas" && objFoto.Selected) {
                    obj.hide(_this.delayFotos);
                    if (_this._fotos_excluidas_qtd == 0) {
                        setTimeout(oPage.ShowFotos, 800);
                    }
                }


                if (objFoto.Selected) {
                	check.removeClass("nao-selecionado").addClass("selecionado").closest('li').removeClass("nao-selecionado").addClass('selecionado');
                	elementoImg.removeClass("nao-selecionado").addClass("selecionado").closest('li').removeClass("nao-selecionado").addClass('selecionado');                	
                	objSw.removeClass("nao-selecionado").addClass('selecionado');
                	elementoImg2.removeClass("selecionado").addClass("nao-selecionado");
                    oPhotoPage.Selected = true;
                } else {
                	check.removeClass("selecionado").addClass("nao-selecionado").closest('li').removeClass("selecionado").addClass('nao-selecionado');
                	elementoImg.removeClass("selecionado").addClass("nao-selecionado").closest('li').removeClass("selecionado").addClass('nao-selecionado');
                	objSw.removeClass("selecionado").addClass('nao-selecionado');
                	elementoImg2.removeClass("nao-selecionado").addClass("selecionado");                	
                    oPhotoPage.Selected = false;
                }

                if (_this.oSwiper != null && _this.filtro != "todas") {
                    var index = _this.oSwiper.activeIndex;
                    var obj = $("#sw_" + photoID);
                    if (_this.filtro == "selecionadas" || _this.filtro == "excluidas") {
                    	obj.hide(_this.delayFotos);
                        //_this.oSwiper.removeSlide(index);
                    	setTimeout("oPage.oSwiper.removeSlide(" + index + ")", _this.delayFotos);
                    }
                }
            }
            if (_this.oSwiper != null && _this.filtro != "todas") {
            	setTimeout(oPage.RefatoraIsotope, _this.delayFotos + 1);
            }
        }).always(function () {
            oUtil.ShowLoader(false);
        });
    }
	, RefatoraIsotope: function () {
		$(oPage.seletor_view_thumb_foto).isotope();
	}
    , SelecionarFoto: function (evento, elemento) {
    	var _this = oPage;

        var obj = $(elemento);
        var id = obj.attr("id");
        var objFoto = _this.GetoPhotosById(id);

        //verificar Qtd Min                 
        if (objFoto.Selected == true && parseInt(_this.qtdMinFoto) > 0) {                        
            if ((_this._fotos_selecionadas_qtd - 1) < parseInt(_this.qtdMinFoto)) {
                var modal = $("#div-min-fotos-modal");
                modal.modal();
                //return;
            }            
        }
        
        //verificar Qtd Max                 
        if (objFoto.Selected == false && parseInt(_this.qtdMaxFoto) > 0) {
            if ((_this._fotos_selecionadas_qtd + 1) > parseInt(_this.qtdMaxFoto)) {
                var modal = $("#div-max-fotos-modal");
                modal.modal();
                //return;
            }
        }        
        
        //recalculando resumos
        var ok = _this.RecalculaResumo(!objFoto.Selected, false);
        if (!ok && objFoto.Selected == true) {
            var modal = $("#div-limite-fotos-modal");            
            modal.find(".btn-ok").unbind(_this.evento_click);
            modal.find(".btn-ok").on(_this.evento_click, function (evento) { oPage.DoSelecionarFoto(id); return false; });
            modal.modal();
            return;
        }                

        _this.DoSelecionarFoto(id);
    }
    , SelecionarFotoSwiper: function (evento, elemento) {
    	var _this = oPage;
        var photoID = elemento.getAttribute("photoid");
        var acaoEfetuada = _this.SelecionarFoto(evento, document.getElementById(photoID));        
    }
    , CalculaPercent: function (fotos_excluidas_qtd, fotos_all_qtd) {
        return Math.round((fotos_excluidas_qtd / fotos_all_qtd) * 100);
    }
    , RecalculaResumo: function (selected, atualiza) {
    	var _this = oPage;
        var fotos_selecionadas = $("#fotos_selecionadas");
        var fotos_excluidas = $("#fotos_excluidas");
        var fotos_excluidas_percent = $("#fotos_excluidas_percent");
        var fotos_all_qtd = parseInt($("#fotos_all").html());

        var fotos_excluidas_qtd = parseInt(fotos_excluidas.html())
        var fotos_selecionadas_qtd = parseInt(fotos_selecionadas.html())        
        if (selected != undefined) {
            if (selected) {
                fotos_excluidas_qtd -= 1;
                fotos_selecionadas_qtd += 1;
            } else {
                fotos_excluidas_qtd += 1
                fotos_selecionadas_qtd -= 1                
            }
        }        
        
        var percent = _this.CalculaPercent(fotos_excluidas_qtd, fotos_all_qtd);
        var b = false;
        if ((percent / 100) > _this.limit_percent_discart && _this.limit_percent_discart > 0) {
            b = false;
        } else {            
            b = true;
        }
        if (atualiza) {
            _this.percent_atual = percent;
            fotos_excluidas.html(fotos_excluidas_qtd);
            fotos_selecionadas.html(fotos_selecionadas_qtd);
            fotos_excluidas_percent.html(_this.percent_atual + "%");
            _this._fotos_excluidas_qtd = fotos_excluidas_qtd;
            _this._fotos_selecionadas_qtd = fotos_selecionadas_qtd;
        }        
        return b;
    }        
    , EuQuero: function (evento, elemento) {
    	var _this = oPage;

        if (_this.qtdMinFoto > 0) {
            if (_this._fotos_selecionadas_qtd < _this.qtdMinFoto) {
                var modal = $("#div-min-fotos-modal");
                modal.modal();
                return false;
            }
        }

        //verificar Qtd Max         
        if (_this.qtdMaxFoto > 0) {
            if (_this._fotos_selecionadas_qtd > _this.qtdMaxFoto) {
                var modal = $("#div-max-fotos-modal");
                modal.modal();
                return;
            }
        }

        //if (_this.percent_atual > _this.limit_percent_discart) {
        //    $("#div-limite-fotos-modal").modal();
        //    return false;
        //}

        var allFotos = _this.oPhotos;
        var fotos = [];
        for (var i = 0; i < allFotos.length; i++) {
            var obj = allFotos[i];            
            fotos.push({
                PhotoIDCript: obj.PhotoIDCript,
                Selected: obj.Selected
            })
        }       

        oUtil.ShowLoader(true);
        var objAjax =
        {
            AlbumIDCript: _this.albumIDCript            
            , AlunoTurmaID: _this.alunoTurmaID
            , ProductID: _this.productID
            , QtdMinFoto: _this.qtdMinFoto
            , QtdMaxFoto: _this.qtdMaxFoto
            , isFirstAcess: _this.isFirstAcess
            , fotos: fotos
        };

        //console.log(objAjax);

        //chamar API caso         
        $.ajax({
            url: _this.url_api_go_to_cart
            , data: JSON.stringify(objAjax)
			, contentType: 'application/json'
            , method: "POST"
            , headers: oUtil.GetToken()
        }).fail(function (data, textStatus, jqXHR) {

            oUtil.ShowModalError("", "", data);

        }).done(function (data, textStatus, jqXHR) {
            var _this = oPage;
            if (data.Sucesso == false) {
                if (data.Mensagem.toLowerCase() == "limit_min") {
                    var modal = $("#div-min-fotos-modal");
                    modal.modal();
                } else if (data.Mensagem.toLowerCase() == "limit_max") {
                    var modal = $("#div-max-fotos-modal");
                    modal.modal();
                }else{
                    oUtil.ShowModalError("", data.Mensagem);
                }                
                return;
            }
            document.location.href = urlRetorno;            
        }).always(function () {
            oUtil.ShowLoader(false);
        });        
    }
    //Métodos - Fim    
}
var oTurn = {
	vImagens: [],
	oThis: null,
	oControleCliquePagina: 0,
	eClick: 'click',
	eTurned: 'turned',
	sContainerTurn: '.container-turn',
	sTurn: '.turn',
	sPageWrapper: '.page-wrapper',
	sBtnTurnNav: '.btn-turn-nav',
	mIniciar: function () {
		var _this = oTurn;
		_this.oThis = $(_this.sTurn);
		if (_this.oThis.length) {
			_this.mCriarImagens();
			_this.mConfigurarTurn();
		}
		window.screen.orientation.onchange = function () {
			oTurn.mReconfigurarTurn();
		};
		window.addEventListener('resize', function () {
			oTurn.mReconfigurarTurn();
		});
	},
	mCriarImagens: function () {
		var _this = oTurn;
		var vImagens = oPage.oPhotos;

		var htmlCapa = '<div class="page" style="background-image: url(\'{$src}\');"></div>';
		var htmlImg = '<div class="page" style="background-image: url(\'{$src}\');"></div>';
		var htmlContracapa = '<div class="page" {$style}></div>';

		if (vImagens) {
			for (var i = 0; i < vImagens.length; i++) {
				var item = vImagens[i];
				_this.vImagens.push({
					name: item.Nome,
					orientation: (item.Height > item.Width ? 'portrait' : 'landscape'),
					selected: (item.Selected ? 'selecionado' : 'nao-selecionado'),
					src: oPage.urlRender + '/?hash=' + item.RenderMain + '&t=' + oPage.token,
					photoId: item.PhotoIDCript
				});

				if (i == 0) {
					_this.oThis.append(htmlCapa.replace('{$src}', _this.vImagens[i].src));
				} else {
					if (i == (vImagens.length - 1)) {
						_this.oThis.append(htmlContracapa.replace('{$style}', (!_this.vImagens[i].bg) ? '' : 'style="background-image: url(\'' + _this.vImagens[i].src + '\');"'));
					} else {
						_this.oThis.append(htmlImg.replace('{$src}', _this.vImagens[i].src));
					}
				}
			}
			if (vImagens.length % 2 != 0) _this.oThis.append(htmlContracapa.replace('{$style}', ''));

			_this.mConfigurarListners();
		}
	},
	mConfigurarTurn: function () {
		var _this = oTurn;

		var margem = 0, fatorProporcao = 1.5;
		var largura, altura, margemSuperior;

		if ((window.innerWidth / fatorProporcao) <= (window.innerHeight - margem)) {
			largura = (window.innerHeight - margem) * fatorProporcao;
			altura = largura / fatorProporcao;
		} else {
			altura = (window.innerWidth - margem) / fatorProporcao;
			largura = altura * fatorProporcao;
		}
		_this.oThis.css({ marginTop: margemSuperior, acceleration: true, gradients: true });
		_this.oThis.turn({ width: largura, height: altura });

		margemSuperior = (window.innerHeight - _this.oThis.height()) / 2;
		_this.oThis.css({ marginTop: margemSuperior });
	},
	mReconfigurarTurn: function () {
		var _this = oTurn;

		if (_this.oThis.turn('is')) _this.oThis.turn('destroy');
		_this.mCriarImagens();
		_this.mConfigurarTurn();
		_this.mAdicionarClassesPageWrapper();
	},
	mAdicionarClassesPageWrapper: function () {
		var _this = oTurn;
		$(_this.sPageWrapper).removeClass('page-wrapper-par page-wrapper-impar').addClass(function () { return (Number($(this).attr('page')) % 2) == 0 ? 'page-wrapper-par' : 'page-wrapper-impar'; });
	},
	mConfigurarListners: function () {
		var _this = oTurn;
		_this.oThis
			.unbind(_this.eTurned)
			.on(_this.eTurned, function (event, page, view) { _this.mAdicionarClassesPageWrapper(); })
		;
		
		$(_this.sBtnTurnNav)
			.unbind(_this.eClick)
			.on(_this.eClick, function (e) { e.preventDefault(); _this.mTratarCliqueSetasNavegacao(this); return false; })
		;
	},
	mTratarCliqueSetasNavegacao: function (elemento) {
		var _this = oTurn;

		if ($(elemento).hasClass('next')) {
			_this.oThis.turn('next');
		} else if ($(elemento).hasClass('previous')) {
			_this.oThis.turn('previous');
		}

	}
}
$(document).ready(function () {
    oPage.Carregar(oPhotos, urlRender, token, albumIDCript, alunoTurmaID, productID, limit_percent_discart, qtdMinFoto, qtdMaxFoto, urlRetorno, isFirstAcess);
	oUtil.ShowLoader(true);
});
$(window).load(function () {
	oUtil.ShowLoader(false);
	oPage.RefatoraIsotope();
});

window.screen.orientation.onchange = function () {
	oPage.AjustarMargemImgSwiper();
};
window.addEventListener('resize', function () {
	oPage.AjustarMargemImgSwiper();
});