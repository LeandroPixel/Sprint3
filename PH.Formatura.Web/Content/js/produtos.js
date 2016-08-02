oProdutos = {

    //Objetos - Início
    jqThis: null
    ,DadosProdutos : null
    //Objetos - Fim

    //Eventos - Início
	, evento_click: 'click'
    , evento_change: 'change'
    //Eventos - Fim

    //Seletores - Início
	, seletor_geral: '.conteudo-geral'
    , tbProdutos: '#tbProdutos'
    , chk_product: '.jqProduct'
    , btn_euquero: '.btn-eu-quero'
    , btn_euquero_header: '.btn-eu-quero-header'    
    , div_min_fotos_modal: "#div-min-fotos-modal"
    , div_max_fotos_modal: "#div-max-fotos-modal"
    , QtdMinFoto: "#QtdMinFoto"
    , QtdMaxFoto: "#QtdMaxFoto"
    , btn_validar_fotos: ".btn-validar-fotos"
    , produtoName: ".produtoName"
    , combo_pacote: "#combo-pacotes"
    , btn_incluir_itens: ".btn-incluir-itens"
    , ul_itens: ".ul-itens"
    , info_change_pacote: "#div-info-change-pacote-modal"
    , pacote_id_old: "#pacote-id-old"
    , btn_close_modal_change_pacote: "#div-info-change-pacote-modal .btn-close"
    , btn_zoom_img: ".zoom-img"
    , zoom_container: ".zoom-container"
    , btn_fechar_zoom_container: ".zoom-container .dvfechar"
    , btn_number: '.btn-number'
    , input_number: '.input-number'

    //variaveis
    , url_produtos_pacote: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/Produtos/ProdutosPacote"
    , string_url_api_save_cartproduct: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + '/api/Produtos/SaveCartProduct'
    , string_url_api_delete_cartproduct: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + '/api/Produtos/DeleteItemCartProduct'
    , string_url_api_delete_all_cartproduct: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + '/api/Produtos/DeleteAllItensCart'
    
    //, selectpicker
    
    //Seletores - Fim

    //variaveis        
    , cookie_user_name: cookie_user_name
    , urlCART: urlCART
    , objConfig: {}

    //Métodos - Início
	, Carregar: function (DadosProdutos) {
	    var _this = this;

	    _this.jqThis = jQuery(_this.seletor_geral);

	    _this.DadosProdutos = DadosProdutos;

	    if (_this.jqThis.length) {
	        _this.CarregarEventos();
	    }
	}
	, CarregarEventos: function () {
	    var _this = this;

	    _this.jqThis
			.on(_this.evento_click, _this.chk_product, function (e) { _this.SaveCartProduct(e); })
	    _this.jqThis
			.on(_this.evento_click, _this.btn_euquero, function (e) { _this.ValidaDadosProdutos() })
	    _this.jqThis
			.on(_this.evento_click, _this.btn_euquero_header, function (e) { _this.ValidaDadosProdutos() })
	    _this.jqThis
			.on(_this.evento_change, _this.combo_pacote, function (e) { _this.ChangePacote() })
	    _this.jqThis
			.on(_this.evento_click, _this.btn_incluir_itens, function (e) { _this.ExibeItensOcultos() })

	    $(_this.btn_close_modal_change_pacote).on(_this.evento_click, function (e) { _this.UndoSelect() });
	    _this.jqThis
			.on(_this.evento_click, _this.btn_zoom_img, function (e) { _this.ShowZoom(true, this) })

	    $(_this.btn_fechar_zoom_container).on(_this.evento_click, function (e) { _this.ShowZoom(false,this) })
	    $(_this.zoom_container).on(_this.evento_click, function (e) { _this.ShowZoom(false, this) })

	    _this.jqThis.on(_this.evento_click, _this.btn_number, function (evento) { _this.BtnNumberAddOrMinus(evento, this); })
	    _this.jqThis.on(_this.evento_focus, _this.input_number, function () { _this.BtnNumberFocus(this); })
	    _this.jqThis.on(_this.evento_change, _this.input_number, function () { _this.BtnNumberChange(this); })
	    _this.jqThis.on(_this.evento_keydown, _this.input_number, function (evento) { _this.BtnNumberKeyDown(evento); })
	    
	}
    , SaveCartProductItem: function (_this_) {
        var _this = this;        
        var cart_item = {};
        var url = "";
        var obj = $(_this_);
        var ProductID = obj.attr("data-product-id");        
        var qtd = parseInt(_this.jqThis.find("#txt_" + ProductID).val());
        var qtd_fotos = _this.jqThis.find("#qtd_fotos_" + ProductID).text();

        cart_item.AlunoTurmaID = Number(objConfig.aluno_turma_id);
        cart_item.BookID = 0;
        cart_item.ID = 0;
        cart_item.ProductID = Number(ProductID);
        cart_item.QtdFoto = Number(qtd_fotos);
        cart_item.UserID = Number(objConfig.user_id);
        cart_item.Qtd = Number(qtd);        
        
        if (qtd == 0) {
            url = _this.string_url_api_delete_cartproduct;
        }else{
            url = _this.string_url_api_save_cartproduct;
        }        

        jQuery.ajax({
            method: 'POST',
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(cart_item),
            headers: oUtil.GetToken(),                        
            beforeSend: function (jqXHR) {
                oUtil.ShowLoader(true);
            }
        })
            .done(function (poJSON) {

            })
            .fail(function (jqXHR, textStatus) {
                //console.log(jqXHR);
                _this.TrataErroCart(jqXHR, textStatus);
            })
            .always(function (jqXHR, textStatus) {
                oUtil.ShowLoader(false);
            })
    }
    , BtnNumberAddOrMinus: function (e, _this_) {        
        var _this = this;        
        e.preventDefault();        
        fieldName = $(_this_).attr('data-field');
        type = $(_this_).attr('data-type');
        prodID = $(_this_).attr('data-product-id');
        var input = _this.jqThis.find("#txt_" + prodID);
        var selectbox = _this.jqThis.find("#chk_" + prodID);
        var currentVal = parseInt(input.val());        
        if (!isNaN(currentVal)) {
            if (type == 'minus') {
                if (currentVal > input.attr('min')) {
                    input.val(currentVal - 1).change();
                }                
                if (parseInt(input.val()) == input.attr('min')) {
                    $(_this_).attr('disabled', true);
                }
            } else if (type == 'plus') {
                if (currentVal < input.attr('max')) {
                    input.val(currentVal + 1).change();
                }
                if (parseInt(input.val()) == input.attr('max')) {
                    $(_this_).attr('disabled', true);
                }
            }
        } else {
            input.val(0);
        }

        if (parseInt(input.val()) == 0) {
            selectbox.closest('label')[0].MaterialCheckbox.uncheck();
        } else if (parseInt(input.val()) > 0) {
            selectbox.closest('label')[0].MaterialCheckbox.check();
        }
    }
    , BtnNumberFocus: function (_this_) {
        $(_this_).data('oldValue', $(_this_).val());
    }
    , BtnNumberChange: function (_this_) {
        var _this = this;
        minValue = parseInt($(_this_).attr('min'));
        maxValue = parseInt($(_this_).attr('max'));
        valueCurrent = parseInt($(_this_).val());
        prodID = $(_this_).attr('data-product-id');
        name = $(_this_).attr('name');
        if (valueCurrent >= minValue) {
            $(".btn-number-" + prodID + "[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
        } else {
            oUtil.ShowModalError("", "O valor mínimo foi alcançado");
            //alert('Sorry, the minimum value was reached');
            $(_this_).val($(_this_).data('oldValue'));
        }
        if (valueCurrent <= maxValue) {
            $(".btn-number-" + prodID + "[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
        } else {
            oUtil.ShowModalError("", "O valor máximo foi alcançado");
            //alert('Sorry, the maximum value was reached');
            $(_this_).val($(_this_).data('oldValue'));
        }

        _this.SaveCartProductItem(_this_);
    }
    , BtnNumberKeyDown: function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }

    }
    , ShowZoom: function (b,obj) {
        var _this = this;        
        var zoomContainer = $(_this.zoom_container);
        if (b) {
            //recuperar a imagem            
            zoomContainer.find(".cont-img").html("<img src=" + $(obj).attr("img_zoom_path") + ">")
            zoomContainer.show();
        } else {
            zoomContainer.hide();
        }
    }
    , ExibeItensOcultos: function () {
        var _this = this;
        var classHidden = "hidden";
        _this.jqThis.find(_this.ul_itens).find("li").each(function (index) {
            var obj = $(this);            
            if (obj.hasClass(classHidden)) {
                obj.removeClass(classHidden);
            }            
        });
        _this.jqThis.find(_this.btn_incluir_itens).addClass(classHidden);
    }
    , ChangePacote: function () {
        var _this = this;        
        var pacoteID = _this.jqThis.find(_this.combo_pacote).selectpicker('val');
        var pacoteID_old = _this.jqThis.find(_this.pacote_id_old).val();
        var modal = $(_this.info_change_pacote);
        if (pacoteID == pacoteID_old) {
            _this.ChangePacoteDo(pacoteID, modal);
            return;
        }
        //verificar se tem algum produto selecionado
        var qtdItensSelect = _this.jqThis.find(_this.ul_itens).find("li "+_this.chk_product+":checked").length;        
        if (qtdItensSelect == 0) {
            _this.ChangePacoteDo(pacoteID, modal);
            return;
        }                
        
        modal.find(".btn-ok").unbind(_this.evento_click);
        modal.find(".btn-ok").on(_this.evento_click, function (evento) { _this.DeleteAllItensCart(pacoteID, modal); return false; });
        modal.modal();
    }
    , UndoSelect: function () {
        var _this = this;        
        _this.jqThis.find(_this.combo_pacote).val(_this.jqThis.find(_this.pacote_id_old).val());
        _this.jqThis.find(_this.combo_pacote).selectpicker('render');
    }
    , DeleteAllItensCart: function (pacoteID, modal) {
        var _this = this;
        modal.modal('hide');
        var obj = {
            UserID: objConfig.user_id
            ,AlunoTurmaID: objConfig.aluno_turma_id
        }        
        jQuery.ajax({
            method: 'POST',
            url: _this.string_url_api_delete_all_cartproduct,
            contentType: 'application/json',
            data: JSON.stringify(obj),
            headers: oUtil.GetToken(),
            beforeSend: function (jqXHR) {
                oUtil.ShowLoader(true);
            }
        })
            .done(function (poJSON) {
                _this.ChangePacoteDo(pacoteID, modal);
            })
            .fail(function (jqXHR, textStatus) {
                oUtil.ShowModalError("", "Erro ao remover os itens do carrinho");
            })
            .always(function (jqXHR, textStatus) {
                oUtil.ShowLoader(false);
            })
    }
    , ChangePacoteDo: function (pacoteID, modal) {
        var _this = this;
        modal.modal('hide');
        jQuery.ajax({
            method: 'POST',
            url: _this.url_produtos_pacote + "?pacoteID=" + pacoteID + "&alunoTurmaID_Cript=" + objConfig.aluno_turma_id_Cript2,
            beforeSend: function (jqXHR) {
                oUtil.ShowLoader(true);
            }
        })
            .done(function (poJSON) {
                if (poJSON.indexOf('PAGE_ERROR') == -1) {                    
                    
                    _this.jqThis.find(_this.ul_itens).html(poJSON);
                    _this.jqThis.find(_this.btn_incluir_itens).removeClass("hidden");
                    _this.jqThis.find(_this.pacote_id_old).val(pacoteID);
                    oUtil.RefactorMDL_JS();
                } else {
                    oUtil.ShowModalError("", "Erro ao carregar informações do pacote");
                }
            })
            .fail(function (jqXHR, textStatus) {
                oUtil.ShowModalError("", "Erro ao carregar informações do pacote");
            })
            .always(function (jqXHR, textStatus) {
                oUtil.ShowLoader(false);
            })
	}
    , ValidaDadosProdutos: function () {
        var _this = this;
        try {
            var totProdutos = _this.DadosProdutos.length;
            for (var i = 0; i < totProdutos; i++) {
                var obj = _this.DadosProdutos[i];
                var checked = _this.jqThis.find('#chk_' + obj.ProductID + ':checked').length > 0;
                if (checked == false) {
                    continue;
                }

                if (parseInt(obj.QtdMinFoto) == 0 && parseInt(obj.QtdMaxFoto) == 0) {
                    continue;
                }

                var qtdFotos = _this.jqThis.find('#qtd_fotos_' + obj.ProductID).html();                
                var urlValidacaoFotos = _this.jqThis.find('#urlValidacaoFotos_' + obj.ProductID).val();

                //verificar Qtd Min         
                if (parseInt(obj.QtdMinFoto) > 0) {
                    if (qtdFotos < parseInt(obj.QtdMinFoto)) {
                        var modal = $(_this.div_min_fotos_modal);
                        modal.find(_this.QtdMinFoto).html(obj.QtdMinFoto);
                        modal.find(_this.produtoName).html(obj.NomeProduto);
                        modal.find(_this.btn_validar_fotos).unbind(_this.evento_click);
                        modal.find(_this.btn_validar_fotos).on(_this.evento_click, function (evento) {
                            window.location = urlValidacaoFotos; return false;
                        });
                        modal.modal();
                        return;
                    }
                }

                //verificar Qtd Max         
                if (obj.QtdMaxFoto > 0) {
                    if (qtdFotos > parseInt(obj.QtdMaxFoto)) {
                        var modal = $(_this.div_max_fotos_modal);
                        modal.find(_this.QtdMaxFoto).html(obj.QtdMaxFoto);
                        modal.find(_this.produtoName).html(obj.NomeProduto);
                        modal.find(_this.btn_validar_fotos).unbind(_this.evento_click);
                        modal.find(_this.btn_validar_fotos).on(_this.evento_click, function (evento) {
                            window.location = urlValidacaoFotos; return false;
                        });
                        modal.modal();
                        return;
                    }
                }
            }
            sessionStorage.setItem("AlunoTurmaID_Cript2", objConfig.aluno_turma_id_Cript2);
            window.location = _this.urlCART;
        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo ValidaDadosProdutos erro: " + e);
        }        
    }
    , SaveCartProduct: function (e) {
        var _this = this;
        var cart_item = {};
        var url = "";
        var add = true;        

        cart_item.AlunoTurmaID = objConfig.aluno_turma_id;
        cart_item.BookID = 0;
        cart_item.ID = 0;
        cart_item.ProductID = Number($(e.target).attr("data-prod_id"));
        cart_item.Qtd = 1;
        cart_item.QtdFoto = 0;
        cart_item.UserID = objConfig.user_id;

        if ($(e.target).is(':checked')) {
            url = objConfig.url_save;
            add = true;
        }
        else {
            url = objConfig.url_delete;
            add = false;
        }

        var objMinus = _this.jqThis.find(".div-grupo-alterar-qtd .input-group .input-group-btn .btn-number-minus-" + cart_item.ProductID);        

        jQuery.ajax({
            method: 'POST',
            url: url,
            data: cart_item,
            headers: oUtil.GetToken(),

            beforeSend: function (jqXHR) {
                oUtil.ShowLoader(true);
            }
         })
            .done(function (poJSON) {
                var formVal = _this.jqThis.find("#txt_" + cart_item.ProductID);
                if (add) {
                    formVal.val(1);                    
                    objMinus.removeAttr('disabled');
                } else {                    
                    objMinus.attr('disabled', true);                    
                    formVal.val(0);
                }                                
            })
            .fail(function (jqXHR, textStatus) {
                console.log(jqXHR)
            })
            .always(function (jqXHR, textStatus) {
                oUtil.ShowLoader(false);
            })

    }
    , GotoValidation: function (url, prodID) {
        var _this = this;

        //if (!_this.jqThis.find('#chk' + prodID).is(':checked'))
        //    _this.jqThis.find('#chk' + prodID).click();

        window.location = url;
    }
    //Métodos - Fim    
}

jQuery(document).ready(function () {

    oProdutos.Carregar(DadosProdutos);

});
