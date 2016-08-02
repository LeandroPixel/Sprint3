var oValidacaoOffline = {
    //Objetos - Início
    jqThis: null
    , oPhotos: null
    , oSwiper: null
    , objControl: null
    , oProduto: null
    , oGRD_ORDER_PRODUCT_PHOTOS: []
    , oListaProductGroup: []
    //Objetos - Fim

    //Eventos - Início
	, evento_click: 'click'
	, evento_mousedown: 'mousedown'
	, evento_mouseup: 'mouseup'
	, evento_contextmenu: 'contextmenu'
	, evento_touchend: 'touchend'
	, evento_wheel: 'wheel'
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
    , seletor_nome_produto: '#NomeProduto'
    , seletor_qtd_min: '#QtdMinFoto'
    , seletor_qtd_max: '#QtdMaxFoto'
    , seletor_fotos_all: '#fotos_all'
    , seletor_fotos_selecionadas: '#fotos_selecionadas'
    , seletor_fotos_excluidas: '#fotos_excluidas'
    , seletor_fotos_excluidas_percent: '#fotos_excluidas_percent'
    , seletor_resumo: '.resumo-fotos'
    , select_view_fotos: '#view-thumb-foto'
    , seletor_btn_fechar: '.btnFechar'
	, seletor_thumbs: '.thumbs'
	, seletor_bg_hold_preview: '.bg-hold-preview'
	, seletor_div_fechar_hold_preview: '.div-fechar-hold-preview'
	, seletor_view_thumb_foto: '#view-thumb-foto'
	, seletor_swiper_container: '.swiper-container'
	, seletor_btn_carrousel_next: '.btn-carrousel-next'
	, seletor_btn_carrousel_prev: '.btn-carrousel-prev'
	, seletor_hold_preview: '.hold-preview'
    , seletor_all_img: 'img'    
    //Seletores - Fim

    //variaveis
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
    , alunoTurmaID: 0
    , productID: 0
    , qtdMinFoto: 0
    , qtdMaxFoto: 0
    , urlRetorno: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/Offline/Produtos"
    , NomeProduto: ""

    //Métodos - Início
    , LoadInit: function () {
        var _this = oValidacaoOffline;
        _this.objControl = sessionStorage.getItem(oOffline.cookie_validacao_fotos);
        if (_this.objControl == null || _this.objControl == undefined) {
            oUtil.ShowModalError("objControl", "Informações de carregamento da página não encontrados");
            return;
        }
        _this.objControl = JSON.parse(_this.objControl);
        _this.objControl.AlunoTurmaID = parseInt(_this.objControl.AlunoTurmaID);
        _this.urlRetorno = _this.objControl.url_retorno;

        var tableName = dbControl.GRD_AlunoTurma_Photos.Name;
        var GRD_AlunoTurma_Photos = [];
        dbControl.SelectALL(tableName, function (result) {
            if (result == null || result.length == 0) {
                oUtil.ShowModalError("AlunoTurma_Photos", "AlunoTurma_Photos não encontrado");
                return;
            }
            //result = oUtil.SortByInt(result, true, "itemOrder");

            for (var i = 0; i < result.length; i++) {
                var obj = result[i];
                if (obj.AlunoTurmaID == _this.objControl.AlunoTurmaID) {
                    GRD_AlunoTurma_Photos.push(obj);
                }
            }
            if (GRD_AlunoTurma_Photos.length == 0) {
                oUtil.ShowModalError("AlunoTurma_Photos", "AlunoTurma_Photos não encontrado para esse aluno");
                return;
            }
            _this.LoadPhotos(GRD_AlunoTurma_Photos);
        });
    }
    , LoadPhotos: function (fotos) {
    	var _this = oValidacaoOffline;
        _this.oPhotos = [];
        var tableName = dbControl.Photos_Album.Name;
        dbControl.SelectALL(tableName, function (result) {
            if (result == undefined || result == undefined || result.length == 0) {
                oUtil.ShowModalError("Photos_Album", "Photos_Album sem registros");
                return;
            }

            for (var i = 0; i < result.length; i++) {
                var obj = result[i];
                var objF = _this.GetFoto(fotos, obj.PhotoID, fotos.length);
                if (objF != null) {
                    obj.Selected = false;
                    obj.itemOrder = objF.itemOrder;                    
                    _this.oPhotos.push(obj);
                }
            }

            if (_this.oPhotos.length == 0) {
                oUtil.ShowModalError("Photos_Album", "Photos nao encontradas");
                return;
            }

            _this.oPhotos = oUtil.SortByInt(_this.oPhotos, true, "itemOrder");

            var tableName = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;
            dbControl.SelectALL(tableName, function (result) {
                var c = _this.objControl;
                if (result != null && result != undefined && result.length > 0) {
                    _this.Load_ORDER_PRODUCT_PHOTOS(result, _this.objControl.ProductID, _this.objControl.AlunoTurmaID);
                }
                _this.Carregar(_this.oPhotos, "", "", c.AlunoTurmaID_Cript, c.AlunoTurmaID, c.ProductID, c.PercentualDescarte, c.QtdMinFoto, c.QtdMaxFoto, c.NomeProduto, c.isFirstAcess);
                setTimeout(oValidacaoOffline.RefatoraIsotope, _this.delayFotos + 1);
            });
        })
    }
    , Load_ORDER_PRODUCT_PHOTOS: function (result, ProductID, AlunoTurmaID) {
    	var _this = oValidacaoOffline;
        _this.oGRD_ORDER_PRODUCT_PHOTOS = [];
        for (var i = 0; i < result.length; i++) {
            var obj = result[i];
            if (AlunoTurmaID == obj.AlunoTurmaID && ProductID == obj.ProductID && obj.OrderID == null) {
                _this.oGRD_ORDER_PRODUCT_PHOTOS.push(obj);
            }
        }
    }
    , GetFoto: function (fotos, photoID, total) {
        var b = null;
        for (var j = 0; j < total; j++) {
            var foto = fotos[j];
            if (foto.PhotoID == photoID) {
                b = foto;
                break;
            }
        }
        return b;
    }
    , SelecionaFotosInit: function (oPhotos, oGRD_ORDER_PRODUCT_PHOTOS, qtdMaxFoto, qtdMinFoto, percentDiscard) {        
    	var _this = oValidacaoOffline;
        var totalFotos = oPhotos.length;
        var totalGRD = oGRD_ORDER_PRODUCT_PHOTOS.length
        for (var i = 0; i < totalGRD; i++) {
            var obj = oGRD_ORDER_PRODUCT_PHOTOS[i];
            var foto = _this.GetFoto(oPhotos, obj.PhotoID, totalFotos);
            if (foto != null) {
                foto.Selected = true;
            }
        }

        if (percentDiscard > 0 && totalGRD == 0) {
            for (var i = 0; i < totalFotos; i++) {
                var foto = oPhotos[i];
                if (i < qtdMaxFoto) {
                    foto.Selected = true;
                } else {
                    foto.Selected = false;
                }
            }
        }
        var objAjax =
        {
            AlbumIDCript: _this.albumIDCript
            , AlunoTurmaID: _this.alunoTurmaID
            , ProductID: _this.productID
            , QtdMinFoto: _this.qtdMinFoto
            , QtdMaxFoto: _this.qtdMaxFoto
            , fotos: oPhotos
        };

        //console.log(oPhotos);
        if (totalGRD == 0) {
            _this.SelectPhotoIndexDB(objAjax, null, null, null, null, null, null, _this.AtualizaHtml);            
        } else {
            _this.AtualizaHtml();            
        }
    }
    , ExibeFotosHtml: function (oPhotos) {
    	var _this = oValidacaoOffline;
        var objView = _this.jqThis.find(_this.select_view_fotos);
        var total = oPhotos.length;

        objView.append('<li class="grid-sizer"></li>');

        for (var i = 0; i < total; i++) {
            var item = oPhotos[i];
            objView.append('<li id="' + item.PhotoIDCript + '"> ' +
                //'<div class="check-img ' + (item.Selected ? "selecionado" : "nao-selecionado") + '"></div> ' +
                '<img class="thumbs ' + (item.Width >= item.Height ? "thumb_h" : "thumb_v") + (item.Selected ? " selecionado" : " nao-selecionado") + '" alt="' + item.Nome + '" title="' + item.Nome + '" src="data:image/jpg;base64,' + item.RenderMain + '" photoid="' + item.PhotoIDCript + '"> ' +
                '</li>');
        }
    }
	, Carregar: function (oPhotos, urlRender, token, albumIDCript, alunoTurmaID, productID, limit_percent_discart, qtdMinFoto, qtdMaxFoto, NomeProduto, isFirstAcess) {
		var _this = oValidacaoOffline;

	    _this.jqThis = jQuery(_this.seletor_geral);

	    _this.oPhotos = oPhotos;
	    _this.urlRender = urlRender;
	    _this.token = token;
	    _this.albumIDCript = albumIDCript;
	    _this.alunoTurmaID = alunoTurmaID;
	    _this.productID = productID;
	    _this.limit_percent_discart = limit_percent_discart;
	    _this.qtdMinFoto = parseInt(qtdMinFoto);
	    _this.qtdMaxFoto = parseInt(qtdMaxFoto);
	    //_this.urlRetorno = urlRetorno;
	    _this.NomeProduto = NomeProduto;
	    _this.isFirstAcess = isFirstAcess;	    

	    //console.log("_this.isFirstAcess = " + _this.isFirstAcess);
	    if (_this.isFirstAcess) {
	        _this.jqThis.find(_this.seletor_nome_produto).html("Seleção de fotos para álbum");
	    } else {
	        _this.jqThis.find(_this.seletor_nome_produto).html("Produto: " + _this.NomeProduto);
	    }
        
	    $(_this.seletor_qtd_min).html(_this.qtdMinFoto);
	    $(_this.seletor_qtd_max).html(_this.qtdMaxFoto);
	    _this.jqThis.find(_this.seletor_fotos_all).html(_this.oPhotos.length);

	    _this.SelecionaFotosInit(_this.oPhotos, _this.oGRD_ORDER_PRODUCT_PHOTOS, _this.qtdMaxFoto, _this.qtdMinFoto, _this.limit_percent_discart);

	    //if (_this.jqThis.length) {
	    //	_this.CarregarEventos();
	    //}
	}

    , AtualizaHtml: function () {
        var _this = oValidacaoOffline;
        _this.ExibeFotosHtml(_this.oPhotos);

        _this.CalculaResumo(_this.oPhotos);

        if (_this.qtdMinFoto == _this.qtdMaxFoto) {
            _this.jqThis.find(_this.seletor_resumo).hide();
        } else {
            _this.jqThis.find(_this.seletor_resumo).show();
        }
        //_this.CarregarEventos();
        if (_this.jqThis.length) {
            _this.CarregarEventos();
        }
        oUtil.ShowLoader(false);
        oTurn.mIniciar();
    }
	, CarregarEventos: function () {
		var _this = oValidacaoOffline;

	    $(_this.seletor_foto_filtro).on(_this.evento_click, function (evento) { _this.ShowFotos(this); _this.TratarCliqueAncorasResumoFotos(this); return false; });
	    $(_this.seletor_btn_eu_quero).on(_this.evento_click, function (evento) { _this.EuQuero(evento, this); return false; });
	    $(_this.seletor_btn_change_view).on(_this.evento_click, function (evento) { _this.ChangeView(evento, $(this).attr('data-view-type').toLowerCase()); return false; });
	    $(_this.seletor_btn_fechar).on(_this.evento_click, function (evento) { _this.ChangeView(evento, 'thumb'); return false; });
	    $(_this.seletor_view_thumb_foto).isotope({ itemSelector: 'li', percentPosition: true });
	    $(_this.seletor_foto_selecionar).on(_this.evento_click, function (evento) { _this.SelecionarFoto(evento, this); return false; });
	    $(_this.seletor_all_img).on(_this.evento_contextmenu, function (evento) { _this.TratarOnContextMenu(evento); });
	    $(_this.seletor_thumbs).on(_this.evento_touchend, function (e) { _this.TratarTouchEndThumbs(e); });
	    $(_this.seletor_thumbs).longTouch(function (escopo, evento) { return _this.TratarLongTouch(escopo, evento); }, 125);
	    $(_this.seletor_swiper_container).on(_this.evento_wheel, function (evento) { _this.TratarRolada(evento); });
	}
    , TratarOnContextMenu: function (e) {        
        e.preventDefault();        
        return false;
    }
	, TratarRolada: function (evento) {
		var _this = oValidacaoOffline;
		$((evento.originalEvent.wheelDelta / 120 > 0) ? _this.seletor_btn_carrousel_prev : _this.seletor_btn_carrousel_next).trigger(_this.evento_click);
	}
	, TratarTouchEndThumbs: function (e) {
		var _this = this;
		$(_this.seletor_hold_preview).promise().done(function () { $(_this.seletor_div_fechar_hold_preview).click(); });
	}
	, TratarCliqueAncorasResumoFotos: function (obj) {
		var _this = oValidacaoOffline;

		oValidacaoOffline.RefatoraIsotope();
		$('.' + _this.string_active + '[filtro]').not(obj).removeClass(_this.string_active);
		$(obj).addClass(_this.string_active);
	}
	, TratarLongTouch: function (escopo, evento) {	    
		var _this = oValidacaoOffline;
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
		margem_top = (Number(escopo[0].innerHeight - altura)) / 2;
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
		var _this = oValidacaoOffline;

		$(_this.seletor_div_fechar_hold_preview).remove();
		$(_this.seletor_bg_hold_preview).remove();
		$(_this.seletor_hold_preview).animate(config_animate, 150, function () {
			$(this).fadeOut(function () { $(this).remove(); });
		});
	}
    , CalculaResumo: function (oPhotos) {
    	var _this = oValidacaoOffline;
        var total = oPhotos.length;
        var marcadas = 0;
        var desmarcadas = 0;
        for (var i = 0; i < total; i++) {
            var objFoto = oPhotos[i];
            if (objFoto.Selected) {
                marcadas++;
            } else {
                desmarcadas++;
            }
        }
        var fotos_selecionadas = _this.jqThis.find(_this.seletor_fotos_selecionadas);
        var fotos_excluidas = _this.jqThis.find(_this.seletor_fotos_excluidas);
        var fotos_excluidas_percent = _this.jqThis.find(_this.seletor_fotos_excluidas_percent);

        fotos_selecionadas.html(marcadas);
        fotos_excluidas.html(desmarcadas);
        _this._fotos_excluidas_qtd = desmarcadas;
        _this._fotos_selecionadas_qtd = marcadas;
        var percent = _this.CalculaPercent(desmarcadas, total);
        _this.percent_atual = percent;
        fotos_excluidas_percent.html(_this.percent_atual + "%");
    }
    , GetoPhotosById: function (id) {
    	var _this = oValidacaoOffline;
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
    	var _this = oValidacaoOffline;
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
    	var _this = oValidacaoOffline;
    	var obj = elemento != undefined ? $(elemento) : $(_this.seletor_foto_filtro + '[filtro="todas"]');
        var tipo = obj.length > 0 ? obj.attr("filtro") : "todas";
        _this.filtro = tipo;
        var allFotos = _this.oPhotos;
        _this.jqThis.find(_this.seletor_resumo).children().removeClass("active");
        obj.addClass("active");

        switch (tipo) {
            case "todas":
                for (var i = 0; i < allFotos.length; i++) {
                    var obj = allFotos[i];
                    _this.jqThis.find("#" + obj.PhotoIDCript).show();
                }
                break;
            case "selecionadas":
                for (var i = 0; i < allFotos.length; i++) {
                    var obj = allFotos[i];
                    if (obj.Selected) {
                        _this.jqThis.find("#" + obj.PhotoIDCript).show();
                    } else {
                        _this.jqThis.find("#" + obj.PhotoIDCript).hide();
                    }
                }
                break;
            case "excluidas":
                for (var i = 0; i < allFotos.length; i++) {
                    var obj = allFotos[i];
                    if (obj.Selected == false) {
                        _this.jqThis.find("#" + obj.PhotoIDCript).show();
                    } else {
                        _this.jqThis.find("#" + obj.PhotoIDCript).hide();
                    }
                }
                break;
        }
        _this.ReloadSwiper();
    }
    , ChangeView: function (evento, tipo) {
    	var _this = oValidacaoOffline;

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
		var _this = oValidacaoOffline;
		$(_this.seletor_foto_selecionar_view_big_img).each(function (e) {
			$(this).css('margin-top', ((window.innerHeight - this.height) / 2) + 'px');
		});
	}
    , CriaSwiper: function (filtro) {
    	var _this = oValidacaoOffline;
    	var swiperWrapper = $(_this.seletor_swiper_container).find(".swiper-wrapper");
    	var oPhotosWithFilter = _this.GetoPhotosByFilter(filtro);

    	for (var i = 0; i < oPhotosWithFilter.length; i++) {
    		var html = '';
    		var objFoto = oPhotosWithFilter[i];
    		var objFotoHtml = swiperWrapper.find("#sw_" + objFoto.PhotoIDCript);
    		if (objFotoHtml.length == 0) {
    			html = '<div class="swiper-slide" id="sw_' + objFoto.PhotoIDCript + '">' +
                            '<div class="cont-img" photoid="' + objFoto.PhotoIDCript + '">' +
                                '<img alt="' + objFoto.Nome + '" title="' + objFoto.Nome + '" src="data:image/jpg;base64,' + objFoto.RenderMain + '" class="' + (objFoto.Height > objFoto.Width ? 'portrait' : 'landscape') + ' ' + (objFoto.Selected ? 'selecionado' : 'nao-selecionado') + '" /> ' +
                                '<div class="checks">' +
                                    '<div class="check-img ' + (objFoto.Selected ? 'selecionado' : 'nao-selecionado') + '"></div> ' +
                                    '<div class="no-check-img ' + (objFoto.Selected ? 'nao-selecionado' : 'selecionado') + '"></div> ' +
                                '</div>' +
                            '</div>' +
                        '</div>';
    			//html = '<div class="swiper-slide" id="sw_' + objFoto.PhotoIDCript + '">' +
                //            '<div class="cont-img" photoid="' + objFoto.PhotoIDCript + '">' +
                //                '<img alt="' + objFoto.Nome + '" title="' + objFoto.Nome + '" src="' + _this.urlRender + "/?hash=" + objFoto.RenderMain + '&t=' + _this.token + '" class="' + (objFoto.Height > objFoto.Width ? 'portrait' : 'landscape') + '" /> ' +
                //                '<div class="check-img ' + (objFoto.Selected ? 'selecionado' : 'nao-selecionado') + '"></div> ' +
                //            '</div>' +
                //        '</div>';
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
    	var _this = oValidacaoOffline;
        _this.DestroySwiper();
        _this.CriaSwiper(_this.filtro);
    }
    , DestroySwiper: function () {
    	var _this = oValidacaoOffline;
        if (_this.oSwiper != null) {
            _this.oSwiper.removeAllSlides();
        }
    }
    , CompleteSelectFotos: function (objAjax, obj, check, photoID, objFoto, objFotoHtmlSwiper, elementoImg) {
    	var _this = oValidacaoOffline;
        try {
            _this.RecalculaResumo(!objFoto.Selected, true)
            for (var i = 0; i < objAjax.fotos.length; i++) {
                var objFoto = objAjax.fotos[i];
                obj = $(document.getElementById(objFoto.PhotoIDCript));
                var objSw = oValidacaoOffline.jqThis.find("#sw_" + objFoto.PhotoIDCript).find("img");
                elementoImg = oValidacaoOffline.jqThis.find("#sw_" + objFoto.PhotoIDCript).find(".check-img");
                elementoImg2 = oValidacaoOffline.jqThis.find("#sw_" + objFoto.PhotoIDCript).find(".no-check-img");
                var oPhotoPage = oValidacaoOffline.GetoPhotosById(objFoto.PhotoIDCript);
                //var check = obj.find(".check-img");
                var check = obj.find("img");

                if (_this.filtro == "selecionadas" && !objFoto.Selected) {
                    obj.hide(_this.delayFotos);
                } else if (_this.filtro == "excluidas" && objFoto.Selected) {
                    obj.hide(_this.delayFotos);
                    if (_this._fotos_excluidas_qtd == 0) {
                        setTimeout("oValidacaoOffline.ShowFotos()", 800);
                    }
                }

                if (objFoto.Selected) {
                    check.removeClass("nao-selecionado").addClass("selecionado");
                    elementoImg.removeClass("nao-selecionado").addClass("selecionado");                    
                    check.addClass('selecionado');
                    elementoImg2.removeClass("selecionado").addClass("nao-selecionado");
                    objSw.removeClass("nao-selecionado").addClass('selecionado');
                    oPhotoPage.Selected = true;
                } else {
                    check.removeClass("selecionado").addClass("nao-selecionado");
                    elementoImg.removeClass("selecionado").addClass("nao-selecionado");                    
                    check.removeClass('selecionado');
                    elementoImg2.removeClass("nao-selecionado").addClass("selecionado");
                    objSw.removeClass("selecionado").addClass('nao-selecionado');
                    oPhotoPage.Selected = false;
                }

                if (_this.oSwiper != null && _this.filtro != "todas") {
                    var index = _this.oSwiper.activeIndex;
                    var obj = _this.jqThis.find("#sw_" + photoID);
                    if (_this.filtro == "selecionadas" || _this.filtro == "excluidas") {
                        obj.hide(_this.delayFotos);
                        //_this.oSwiper.removeSlide(index);
                        setTimeout("oValidacaoOffline.oSwiper.removeSlide(" + index + ")", 800);
                    }
                }
            }
            oUtil.ShowLoader(false);
            if (_this.oSwiper != null && _this.filtro != "todas") {
            	setTimeout(oValidacaoOffline.RefatoraIsotope, _this.delayFotos + 1);
            }
        } catch (e) {
            oUtil.ShowLoader(false);
            oUtil.ShowModalError("", "Erro no metodo CompleteSelectFotos erro: " + e);
        }
    }
    , SelectPhotoIndexDB: function (objAjax, obj, check, photoID, objFoto, objFotoHtmlSwiper, elementoImg, fCallback) {
    	var _this = oValidacaoOffline;
        try {
            oUtil.ShowLoader(true);
            var total_order_product = _this.oGRD_ORDER_PRODUCT_PHOTOS.length;
            var c = _this.objControl;
            var tableName = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;
            var totalFotos = objAjax.fotos.length;
            var photosToAdd = []
            for (var i = 0; i < totalFotos; i++) {
                var foto = objAjax.fotos[i];                
                var objOrderProduct = {
                    AlunoTurmaID: c.AlunoTurmaID
                    , ProductID: c.ProductID
                    , PhotoID: foto.PhotoID
                    , OrderID: null
                };
                if (foto.Selected == true) {                    
                    total_order_product++;
                    objOrderProduct.ID = total_order_product;
                    photosToAdd.push(objOrderProduct);                    
                } else {                    
                    dbControl.DeleteByIndexComplex(tableName, objOrderProduct, function (result, indice) {
                        if (result == undefined || result == false) {
                            oUtil.ShowLoader(false);
                            oUtil.ShowModalError("", "Erro ao deletar " + tableName);
                            return;
                        }
                        if ((indice + 1) == totalFotos) {
                            var tableName = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;
                            dbControl.SelectALL(tableName, function (result) { // atualizando os dados da oGRD_ORDER_PRODUCT_PHOTOS
                                //if (result == null || result == undefined || result.length == 0) {
                                //    oUtil.ShowLoader(false);
                                //    oUtil.ShowModalError("", "Erro no metodo SelectPhotoIndexDB -> SelectALL." + tableName);
                                //    return;
                                //}
                                _this.Load_ORDER_PRODUCT_PHOTOS(result, _this.objControl.ProductID, _this.objControl.AlunoTurmaID);
                                if (fCallback != undefined) {
                                    fCallback();
                                } else {
                                	_this.CompleteSelectFotos(objAjax, obj, check, photoID, objFoto, objFotoHtmlSwiper, elementoImg);
                                }
                            })
                        }
                    }, i);
                }
            }
            //console.log(photosToAdd);
            if (photosToAdd.length > 0) {
                dbControl.InsertArray(tableName, photosToAdd, function (result, indice) {
                    if (result == undefined || result == false) {
                        oUtil.ShowLoader(false);
                        oUtil.ShowModalError("", "Erro ao inserir " + tableName);
                        return;
                    }
                    for (var i = 0; i < photosToAdd.length; i++) {
                        _this.oGRD_ORDER_PRODUCT_PHOTOS.push(photosToAdd[i]);
                    }
                    if (fCallback != undefined) {
                        fCallback();
                    } else {
                        _this.CompleteSelectFotos(objAjax, obj, check, photoID, objFoto, objFotoHtmlSwiper, elementoImg);
                    }
                });                
            }            
        } catch (e) {
            oUtil.ShowLoader(false);
            oUtil.ShowModalError("", "Erro no metodo SelectPhotoIndexDB erro: " + e);
        }
    }
    , DoSelecionarFoto: function (id) {
    	var _this = oValidacaoOffline;

        var modal = $("#div-limite-fotos-modal");
        modal.modal('hide');

        var obj = jQuery("#" + id);
        //var check = obj.find(".check-img");
        var check = obj.find("img");
        var photoID = obj.attr("id");
        var objFoto = _this.GetoPhotosById(photoID);
        var objFotoHtmlSwiper = _this.jqThis.find("#sw_" + photoID);
        var elementoImg = objFotoHtmlSwiper.find("img");

        var objAjax =
        {
            AlbumIDCript: _this.albumIDCript
            , AlunoTurmaID: _this.alunoTurmaID
            , ProductID: _this.productID
            , QtdMinFoto: _this.qtdMinFoto
            , QtdMaxFoto: _this.qtdMaxFoto
            , fotos: [
              {
                  PhotoID: objFoto.PhotoID
                  , Selected: !objFoto.Selected
                  , PhotoIDCript: objFoto.PhotoIDCript
              }
            ]
        };

        _this.SelectPhotoIndexDB(objAjax, obj, check, photoID, objFoto, objFotoHtmlSwiper, elementoImg, undefined);
    }
	, RefatoraIsotope: function () {	    
		var _this = oValidacaoOffline;
	    $(_this.seletor_view_thumb_foto).isotope();		
	}
    , SelecionarFoto: function (evento, elemento) {
    	var _this = oValidacaoOffline;

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
            modal.find(".btn-ok").on(_this.evento_click, function (evento) { oValidacaoOffline.DoSelecionarFoto(id); return false; });
            modal.modal();
            return;
        }

        _this.DoSelecionarFoto(id);
    }
    , SelecionarFotoSwiper: function (evento, elemento) {
    	var _this = oValidacaoOffline;
        var photoID = elemento.getAttribute("photoid");
        var acaoEfetuada = _this.SelecionarFoto(evento, document.getElementById(photoID));
    }
    , CalculaPercent: function (fotos_excluidas_qtd, fotos_all_qtd) {
        return Math.round((fotos_excluidas_qtd / fotos_all_qtd) * 100);
    }
    , RecalculaResumo: function (selected, atualiza) {
    	var _this = oValidacaoOffline;
        var fotos_selecionadas = _this.jqThis.find(_this.seletor_fotos_selecionadas);
        var fotos_excluidas = _this.jqThis.find(_this.seletor_fotos_excluidas);
        var fotos_excluidas_percent = _this.jqThis.find(_this.seletor_fotos_excluidas_percent);
        var fotos_all_qtd = parseInt(_this.jqThis.find(_this.seletor_fotos_all).html());

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
        if (atualiza == true) {
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
    	var _this = oValidacaoOffline;

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

        //v_GRD_Products
        _this.SelectPhotosGroupProduct();
    }
    , SelectPhotosGroupProduct: function () {        
    	var _this = oValidacaoOffline;
        try {
            oUtil.ShowLoader(true);
            var tableName = dbControl.v_GRD_Products.Name;
            var productsSameGroup = [];
            dbControl.SelectALL(tableName, function (result) {
                if (result == null || result == undefined || result.length == 0) {
                    oUtil.ShowModalError("", "Erro ao recuperar info " + tableName + " SelectPhotosGroupProduct");
                    return;
                }
                
                for (var i = 0; i < result.length; i++) {
                    var obj = result[i];                 
                    if (_this.objControl.Grupo == obj.Grupo && _this.objControl.ProductID != obj.ProductID) {
                        productsSameGroup.push(obj);
                    }
                    if (_this.objControl.Grupo == obj.Grupo) {
                        _this.oListaProductGroup.push(obj);
                    }
                }                
                if (productsSameGroup.length == 0) {
                    _this.RedirectUrlRetorno();
                } else {
                    _this.DeletePhotosProduct(productsSameGroup, _this.objControl.AlunoTurmaID);
                }
            });
        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo SelectPhotosGroupProduct erro: " + e);
        }
    }
    , DeletePhotosProduct: function (productsSameGroup, AlunoTurmaID) {
    	var _this = oValidacaoOffline;
        try {
            var tableName = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;
            var prodIds = [];
            var objToDelete = [];
            var qtdDelete = 0;

            //Percorro lista de produtos do mesmo grupo. Não contém o productid do produto selecionado
            for (var i = 0; i < productsSameGroup.length; i++) {
                //Adiciono no array o productid
                prodIds.push(productsSameGroup[i].ProductID);

                //Formato os valores para o delete.
                var obj = { ProductID: productsSameGroup[i].ProductID, AlunoTurmaID: AlunoTurmaID };
                                
                //Delete buscando os dados pelo índice ProductIDAlunoTurmaID. (Async)
                dbControl.DeleteByHintIndexComplex(tableName, "ProductIDAlunoTurmaID", obj, function (result) {
                    //Conto quantas vezes passou por aqui para identificar o fim do loop.
                    qtdDelete++;                
                    //Se retornar true, significa que a exclusão ocorreu com sucesso. 
                    if (result && qtdDelete >= productsSameGroup.length) {
                        //Executa cópia das fotos selecionadas para os outros productIDs
                        //_this.CopySelectPhotosGroupProduct(productsSameGroup, 0, productsSameGroup.length, 0, _this.oGRD_ORDER_PRODUCT_PHOTOS.length);                        
                        _this.CopySelectPhotosGroupProductArray(productsSameGroup);
                        return;
                    }
                });

            }
        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo DeletePhotosProduct erro: " + e);
        }
    }
    , CopySelectPhotosGroupProduct: function (productsSameGroup, indiceGeral, total, indicePhoto, totalPhotos) {
    	var _this = oValidacaoOffline;
        try {
            var tableName = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;
            if (indicePhoto == totalPhotos) {
                indiceGeral++;
                indicePhoto = 0;
            }
            if (indiceGeral == total) {
                //this.RedirectUrlRetorno();
                var indice = 0;
                var total = _this.oListaProductGroup.length;

                _this.AtualizaCartProducts(indice, total);
                return;
            }
            var objProd = productsSameGroup[indiceGeral];
            var obj = _this.oGRD_ORDER_PRODUCT_PHOTOS[indicePhoto];

            obj.ID = ((indiceGeral + 1) * totalPhotos) + (indicePhoto + 1);
            obj.ProductID = objProd.ProductID;
            dbControl.Insert(tableName, obj, function (result, indice) {
                if (result == false) {
                    oUtil.ShowModalError("", "Erro ao inserir registro info " + tableName + " CopySelectPhotosGroupProduct");
                    return;
                }
                indice++;
                _this.CopySelectPhotosGroupProduct(productsSameGroup, indiceGeral, total, indice, _this.oGRD_ORDER_PRODUCT_PHOTOS.length);
            }, indicePhoto);

        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo CopySelectPhotosGroupProduct erro: " + e);
        }
    }

    , clone: function (obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    //Esta função pega todas as fotos selecionadas para um grupo específico e grava para os productsIDs que estão no array productsSameGroup
    , CopySelectPhotosGroupProductArray: function (productsSameGroup) {        
    	var _this = oValidacaoOffline;
        try {
            var tableName = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;
            var totalPhotos = _this.oGRD_ORDER_PRODUCT_PHOTOS.length;
            var objArray = [];
                        
            //Carrego um array com todos os objetos que serão inseridos
            for (var i = 0; i < productsSameGroup.length; i++) {
                for (var y = 0; y < _this.oGRD_ORDER_PRODUCT_PHOTOS.length; y++) {                    
                    var obj = _this.clone(_this.oGRD_ORDER_PRODUCT_PHOTOS[y]);
                    obj.ProductID = productsSameGroup[i].ProductID;
                    obj.ID = ((i + 1) * totalPhotos) + (y + 1);
                    //console.log(obj)
                    objArray.push(obj);
                }
            }            
            //console.log(objArray);

            //Insiro em lote as fotos dos productsID do grupo
            dbControl.InsertArray(tableName, objArray, function (result, event, indice) {
                if (result == false) {
                    oUtil.ShowModalError("", "Erro ao inserir registro info " + tableName + " CopySelectPhotosGroupProductArray. " + event.target.error);
                    return;
                } else {
                    _this.AtualizaCartProducts(0, _this.oListaProductGroup.length);
                }
            }, 0);


        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo CopySelectPhotosGroupProductArray erro: " + e);
        }
    }
    , AtualizaCartProducts: function (indice, total) {        
    	_this = oValidacaoOffline;

        var user = oOffline.getCookie(cookie_user_name);
        user = JSON.parse(user);

        if (indice == total) {
            _this.RedirectUrlRetorno();
            return;
        }

        var ProdID = _this.oListaProductGroup[indice].ProductID;

        var objKey = {
            AlunoTurmaID: Number(_this.objControl.AlunoTurmaID),
            ProductID: Number(ProdID),
            UserID: Number(user.User_ID)
        };

        dbControl.SelectByIndexComplex(dbControl.GRD_CART_PRODUCT.Name, objKey, function (result) {
            if (result && result.length > 0) {

                result[0].QtdFoto = _this._fotos_selecionadas_qtd;
                dbControl.UpdateByIndexComplex(dbControl.GRD_CART_PRODUCT.Name, result[0], function (result, i) {
                    i++;
                    _this.AtualizaCartProducts(i, total);
                }, indice);
            }
            //AJUSTADO PARA IMPEDIR QUE SELECIONE OUTROS FOTOLIVROS. Leandro 13/07/2016
            else {
                var obj = {
                    AlunoTurmaID: Number(_this.objControl.AlunoTurmaID),
                    ProductID: Number(ProdID),
                    UserID: Number(user.User_ID),
                    QtdFoto: _this._fotos_selecionadas_qtd,
                    Qtd: 1
                };
                indice++;
                _this.AtualizaCartProducts(indice, total); //SE NAO TIVER NA CART_PRODUCT PASSO PRO PROXIMO SEM INSERIR
                /*
                dbControl.Insert(dbControl.GRD_CART_PRODUCT.Name, obj, function (result, i) {
                    i++;
                    _this.AtualizaCartProducts(i, total);
                }, indice);*/
            }
        });

    }
    , RedirectUrlRetorno: function () {
    	var _this = oValidacaoOffline;
        oUtil.ShowLoader(true);        
        var user = oOffline.getCookie(cookie_user_name);
        user = JSON.parse(user);

        var ProdID = _this.objControl.ProductID;

        var objKey = {
            AlunoTurmaID: Number(_this.objControl.AlunoTurmaID),
            ProductID: Number(ProdID),
            UserID: Number(user.User_ID)
        };

        if (_this.isFirstAcess) {
            document.location.href = _this.urlRetorno;
            return;
        }

        dbControl.SelectByIndexComplex(dbControl.GRD_CART_PRODUCT.Name, objKey, function (result) {
            if (result && result.length > 0) {
                result[0].QtdFoto = _this._fotos_selecionadas_qtd;
                dbControl.UpdateByIndexComplex(dbControl.GRD_CART_PRODUCT.Name, result[0], function (result) {
                    document.location.href = _this.urlRetorno;
                });
            }
            else {
                var obj = {
                    AlunoTurmaID: Number(_this.objControl.AlunoTurmaID),
                    ProductID: Number(ProdID),
                    UserID: Number(user.User_ID),
                    QtdFoto: _this._fotos_selecionadas_qtd,
                    Qtd: 1
                };
                dbControl.Insert(dbControl.GRD_CART_PRODUCT.Name, obj, function (result) {
                    document.location.href = _this.urlRetorno;
                });
            }
        });
        //document.location.href = _this.urlRetorno;
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
        var vImagens = oValidacaoOffline.oPhotos;

        var htmlCapa = '<div class="page" style="background-image: url(\'{$src}\');"></div>';
        var htmlImg = '<div class="page" style="background-image: url(\'{$src}\');"></div>';
        var htmlContracapa = '<div class="page" {$style}></div>';

        if (vImagens) {
            for (var i = 0; i < vImagens.length; i++) {
                var item = vImagens[i];
                _this.vImagens.push({
                    orientation: (item.Width >= item.Height ? 'thumb_h' : 'thumb_v'),
                    selected: (item.Selected ? " selecionado" : " nao-selecionado"),
                    name: item.Nome,
                    src: 'data:image/jpg;base64,' + item.RenderMain,
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

oOffline.verifyAcesso();

dbControl.CallbackOpenOnSuccess = function () {
	oValidacaoOffline.LoadInit();
}
