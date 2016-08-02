var oProdutosOffline = {
    //Objetos - Início
    jqThis: null
    ,Aluno: null
    , ORDER_PRODUCT_PHOTOS: []
    , cartProd: []
    , detail: new Array()
    , v_GRD_Products : []
    , pacoteID: 0
    , modal: null
    //Objetos - Fim

    //Eventos - Início
	, evento_click: 'click'
    , evento_change: 'change'
    //Eventos - Fim

    //Seletores - Início
	, seletor_geral: '.conteudo-geral'
    , tbProdutos: '#tbProdutos'
    , btn_euquero: '.btn-eu-quero'
    , btn_euquero_header: '.btn-eu-quero-header'
    , div_min_fotos_modal: "#div-min-fotos-modal"
    , div_max_fotos_modal: "#div-max-fotos-modal"
    , QtdMinFoto: "#QtdMinFoto"
    , QtdMaxFoto: "#QtdMaxFoto"
    , btn_validar_fotos: ".btn-validar-fotos"
    , produtoName: ".produtoName"
    , combo_pacote: "#combo-pacotes"
    , list_products: ".list-products"
    , btn_incluir_itens: ".btn-incluir-itens"
    , ul_itens: ".ul-itens"
    , pacote_id_old: "#pacote-id-old"
    , info_change_pacote: "#div-info-change-pacote-modal"
    , chk_product: '.jqProduct'
    , btn_close_modal_change_pacote: "#div-info-change-pacote-modal .btn-close"
    , btn_zoom_img: ".zoom-img"
    , zoom_container: ".zoom-container"
    , btn_fechar_zoom_container: ".zoom-container .dvfechar"
    , btn_number: '.btn-number'
    , input_number: '.input-number'
    //Seletores - Fim

    //variaveis        
    , url_view_alunos: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/Offline/Alunos"
    , url_produtos: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) +'/Offline/Produtos'
    , cookie_user_name: cookie_user_name
    , urlCART: urlCART
    , user_id_vendedor: ""
    , aluno_turma_id: ""
    , url_valicacao_fotos: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/Offline/ValidacaoFotos"
    , turmaID: 0
    , pacotes : []
    , pacoteSelected: null


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
           .on(_this.evento_click, _this.btn_euquero, function (e) { _this.ValidaDadosProdutos(); })
	    _this.jqThis
			.on(_this.evento_click, _this.btn_incluir_itens, function (e) { _this.ExibeItensOcultos() })
	    $(_this.btn_close_modal_change_pacote).on(_this.evento_click, function (e) { _this.UndoSelect() });
	    _this.jqThis
			.on(_this.evento_change, _this.combo_pacote, function (e) { _this.ChangePacote() })
	    _this.jqThis
           .on(_this.evento_click, _this.btn_euquero_header, function (e) { _this.ValidaDadosProdutos(); })
	    _this.jqThis
			.on(_this.evento_click, _this.btn_zoom_img, function (e) { _this.ShowZoom(true, this) })

	    $(_this.btn_fechar_zoom_container).on(_this.evento_click, function (e) { _this.ShowZoom(false, this) })
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

        cart_item.AlunoTurmaID = Number(_this.aluno_turma_id);
        cart_item.BookID = 0;
        cart_item.ID = 0;
        cart_item.ProductID = Number(ProductID);
        cart_item.QtdFoto = Number(qtd_fotos);
        cart_item.UserID = Number(_this.user_id_vendedor);
        cart_item.Qtd = Number(qtd);
                
                
        var tableName = dbControl.GRD_CART_PRODUCT.Name;        
        if (qtd == 0) {                        
            dbControl.DeleteByIndexComplex(tableName, cart_item, function () { oProdutosOffline.ReloadCartProd(); });
            //$("#qtd_fotos_" + ProductID).html(0);            
        } else {
            //$("#qtd_fotos_" + ProductID).html(qtd_fotos);
            dbControl.SelectByIndexComplex(tableName, cart_item, function (result) {                
                if (result && result.length == 0) {                    
                    dbControl.Insert(tableName, cart_item, function () { oProdutosOffline.ReloadCartProd() });
                } else {                               
                    dbControl.UpdateByIndexComplex(tableName, cart_item, function () { oProdutosOffline.ReloadCartProd() })
                }
            });
        }                        
    }
    , BtnNumberAddOrMinus: function (e, _this_) {
        var _this = this;
        e.preventDefault();
        fieldName = $(_this_).attr('data-field');
        type = $(_this_).attr('data-type');
        prodID = $(_this_).attr('data-product-id');
        var input = _this.jqThis.find("#txt_" + prodID);
        var selectbox = _this.jqThis.find("#chk_" + prodID);
        if (selectbox.length == 0) {
            selectbox = _this.jqThis.find("#chk" + prodID);
        }
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
    , ShowZoom: function (b, obj) {
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

        _this.pacoteID = 0;
        _this.modal = null;
        
        if (pacoteID == pacoteID_old) {            
            _this.ChangePacoteDo(pacoteID, modal);
            return;
        }
        //verificar se tem algum produto selecionado
        var qtdItensSelect = _this.jqThis.find(_this.ul_itens).find("li " + _this.chk_product + ":checked").length;        
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
                
        var tableName = "GRD_CART_PRODUCT"
        var indexName = "AlunoTurmaID";        
        var obj = {            
            AlunoTurmaID: _this.aluno_turma_id
        }
        dbControl.DeleteByHintIndexComplex(tableName, indexName, obj, function (result) {
            if (result == false) {
                oUtil.ShowModalError("", "Erro ao deletar produtos");
                return;
            }            
            _this.pacoteID = pacoteID;
            _this.modal = modal;            
            _this.GetProdutos(_this.cartProd, _this.ORDER_PRODUCT_PHOTOS, _this.detail, _this.ChangePacoteDo);            
        });        
    }
    , GetPacoteByID: function (id) {
        var _this = this;
        var pacote;
        for (var i = 0; i < _this.pacotes.length; i++) {
            var obj = _this.pacotes[i];
            if (obj.ID == id) {
                pacote = obj;
                break;
            }
        }
        return pacote;
    }
    , ChangePacoteDo: function (pacoteID, modal) {
        var _this = oProdutosOffline;        
        if (pacoteID == undefined) {            
            pacoteID = _this.pacoteID;
        }
        if (modal == undefined) {            
            modal = _this.modal;
        }        

        modal.modal('hide');

        var pacote = _this.GetPacoteByID(pacoteID);        
        _this.pacoteSelected = pacote;
        _this.jqThis.find(_this.list_products).html("");
        //return;
        //inserir ou atualizar na tabela GRD_Aluno_Pacote        
        var tableName = "GRD_Aluno_Pacote";
        var obj = {
            "GRD_AlunoTurmaID": _this.aluno_turma_id
            , "GRD_PacoteID": _this.pacoteSelected.ID
            , "Created": new Date()
            , "LastModified": new Date()
        };
        dbControl.SelectByIndex(tableName, _this.aluno_turma_id, function (result) {
            if (result == false) {
                oUtil.ShowModalError("", "Erro ao buscar o pacote default");
                return;
            }
            if (result != null) {
                dbControl.UpdateByIndex(tableName, _this.aluno_turma_id, obj, function () {
                    if (result == false) {
                        oUtil.ShowModalError("", "Erro ao atualizar pacote default");
                        return;
                    }
                    _this.MontaTableProducts(_this.cartProd, _this.detail);
                })
            }else{
                dbControl.Insert(tableName, obj, function (result) {
                    if (result == false) {
                        oUtil.ShowModalError("", "Erro ao registrar pacote default");
                        return;
                    }
                    _this.MontaTableProducts(_this.cartProd, _this.detail);
                })
            }
        })                
    }
    //, InsertOrUpdatePacoteUser()
    , GetProductConfig: function (productID) {
        var _this = this;
        try {
            var objRet = null;
            for (var i = 0; i < _this.v_GRD_Products.length; i++) {
                var obj = _this.v_GRD_Products[i];
                if (obj.ProductID == productID) {
                    objRet = obj;
                    break;
                }
            }
            return objRet;
        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo GetProductConfig erro: " + e);
        }        
    }
    , ValidaDadosProdutos: function () {
        var _this = this;
        try {
            var totProdutos = _this.cartProd.length;
            for (var i = 0; i < totProdutos; i++) {
                var obj = _this.GetProductConfig(_this.cartProd[i]);
                var checked = _this.jqThis.find('.chk_' + obj.ProductID + ':checked').length > 0;                
                if (checked == false) {
                    continue;
                }

                if (parseInt(obj.QtdMinFoto) == 0 && parseInt(obj.QtdMaxFoto) == 0) {
                    continue;
                }

                var qtdFotos = parseInt(_this.jqThis.find('#qtd_fotos_' + obj.ProductID).html());
                
                //verificar Qtd Min         
                if (parseInt(obj.QtdMinFoto) > 0) {
                    if (qtdFotos < parseInt(obj.QtdMinFoto)) {
                        var modal = $(_this.div_min_fotos_modal);
                        modal.find(_this.QtdMinFoto).html(obj.QtdMinFoto);
                        modal.find(_this.produtoName).html(obj.NomeProduto);
                        modal.find(_this.btn_validar_fotos).unbind(_this.evento_click);
                        modal.find(_this.btn_validar_fotos).on(_this.evento_click, function (evento) {
                            _this.ViewProducts(obj.ProductID, obj.QtdMaxFoto, obj.QtdMinFoto, obj.PercentualDescarte, "'" + obj.NomeProduto + "'", obj.ProductConfigID, "'" + obj.Grupo + "'");
                            return false;
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
                            _this.ViewProducts(obj.ProductID, obj.QtdMaxFoto, obj.QtdMinFoto, obj.PercentualDescarte, "'" + obj.NomeProduto + "'", obj.ProductConfigID, "'" + obj.Grupo + "'");
                            return false;
                        });
                        modal.modal();
                        return;
                    }
                }
            }

            window.location = _this.urlCART;
        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo ValidaDadosProdutos erro: " + e);
        }        
    }
    , GetAlunoDados: function (alunoTurmaID) {
        var _this = this;                
        var tableName = dbControl.v_GRD_ListaAlunos.Name;
        dbControl.SelectALL(tableName, function (result) {
            if (result != null && result.length == 0) {
                return;
            }            
            for (var i = 0; i < result.length; i++) {
                var obj = result[i];
                if (obj.AlunoTurmaID == alunoTurmaID) {                    
                    _this.Aluno = obj;                    
                }                
            }            
        });
    }
    , ViewProducts: function (ProductID, QtdMaxFoto, QtdMinFoto, PercentualDescarte, NomeProduto, ProductConfigID, Grupo, isFirstAcess) {
        var _this = this;
        if (isFirstAcess == undefined) {
            isFirstAcess = false;
        }
        var oParametros = {
            AlbumID: _this.Aluno.AlbumID
            , AlunoTurmaID: _this.Aluno.AlunoTurmaID
            , AlunoTurmaID_Cript: _this.Aluno.AlunoTurmaID_Cript
            , ProductID: ProductID
            , QtdMaxFoto: QtdMaxFoto
            , QtdMinFoto: QtdMinFoto
            , PercentualDescarte: PercentualDescarte
            , NomeProduto: NomeProduto
            , ProductConfigID: ProductConfigID
            , Grupo: Grupo
            , url_retorno: _this.url_produtos
            , isFirstAcess: isFirstAcess
        }        
        sessionStorage.setItem(oOffline.cookie_validacao_fotos, JSON.stringify(oParametros))        
        document.location.href = _this.url_valicacao_fotos;
    }
    , RedirectSelecaoFotosAlbum: function () {
        var _this = this;                
        dbControl.SelectALL(dbControl.v_GRD_Products.Name, function (result) {            
            for (var i = 0; i < result.length; i++) {
                var obj = result[i];
                if (obj.ExibirListaProdutos && obj.Grupo.toUpperCase() == "FOTOLIVRO") {                    
                    _this.ViewProducts(obj.ProductID, obj.QtdMaxFoto, obj.QtdMinFoto, obj.PercentualDescarte, obj.NomeProduto , obj.ProductConfigID, obj.Grupo, true);
                } 
            }
        });
    }
    , GetFotosSelecionadas: function (ORDER_PRODUCT_PHOTOS, AlunoTurmaID, ProductID) {
        var _this = this;
        dbControl.SelectALL(dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name, function (result) {
            var qtdFotos = 0;            
            if (result != null && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var obj = result[i];                    
                    if (obj.AlunoTurmaID == AlunoTurmaID && obj.OrderID == null) {
                        ORDER_PRODUCT_PHOTOS.push(obj);
                    }
                }                
            }            
            if (ORDER_PRODUCT_PHOTOS.length == 0) {
                _this.RedirectSelecaoFotosAlbum();
            } else {            
                _this.GetProdutos(_this.cartProd, ORDER_PRODUCT_PHOTOS, _this.detail);
            }            
        });
    }
    , GetProdutos: function (cartProd, ORDER_PRODUCT_PHOTOS, detail, fcallback) {
        var _this = this;
        //Verifico produtos já selecionados previamente e as fotos de cada produto
        dbControl.SelectALL(dbControl.GRD_CART_PRODUCT.Name, function (result) {            
            if (result.length == 0) {                
                cartProd: [];
                detail: new Array();
                _this.cartProd = [];
                _this.detail = new Array();
            }
            for (var i = 0; i < result.length; i++) {
                if (result[i].AlunoTurmaID == Number(oProdutosOffline.aluno_turma_id) && result[i].UserID == Number(oProdutosOffline.user_id_vendedor)) {
                    cartProd.push(Number(result[i].ProductID));                    
                    var fotos_selecionadas = 0;
                    for (var j = 0; j < ORDER_PRODUCT_PHOTOS.length; j++) {
                        var obj = ORDER_PRODUCT_PHOTOS[j];                                                
                        if (obj.ProductID == result[i].ProductID) {
                            fotos_selecionadas++;
                        }
                    }                    
                    detail[Number(result[i].ProductID)] = { fotos_selecionadas: fotos_selecionadas, Qtd: result[i].Qtd };
                }
            }            
            if (fcallback == undefined) {
                _this.GetInfoPacotes();
            }else{
                fcallback();
            }
            
            //_this.MontaTableProducts(_this.cartProd, _this.detail)
        });
    }
    , GetInfoPacotes: function () {
        var _this = this;
        var Pacotes = [];
        var TurmaPacote = [];
        var pacotesTurma = [];
        var indexName = "GRD_TurmaID";
        var tableName = "GRD_Turma_Pacote";
        obj = {
            "GRD_TurmaID": _this.turmaID
        }        
        //recuperando pacotes da turma
        dbControl.SelectByHintIndexComplex(tableName, indexName, obj, function (result) {            
            if (result != null && result.length > 0) {
                pacotesTurma = result;
                oUtil.SortByInt(pacotesTurma, true, "Ordem");
            }                        
            tableName = "GRD_Pacote";
            //recuperando todos os pacotes validos
            dbControl.SelectALL(tableName, function (result) {                
                if (result == null || result.length == 0) {
                    oUtil.ShowModalError("", "Erro ao carregar Pacotes");
                    return;
                }
                var pacotesValidos = [];
                for (var i = 0; i < result.length; i++) {
                    var obj = result[i];
                    if (obj.IsEnabled) {
                        pacotesValidos.push(obj);
                    }
                }                
                //Associando os pacotes com validos com os pacotes da turma caso seja necessário
                if (pacotesTurma.length > 0) {
                    for (var i = 0; i < pacotesTurma.length; i++) {
                        var pacoteTurma = pacotesTurma[i];                        
                        for (var j = 0; j < pacotesValidos.length; j++) {
                            var obj = pacotesValidos[j];                            
                            if (obj.ID == pacoteTurma.GRD_PacoteID) {
                                Pacotes.push(obj);
                            }
                        }
                    }                 
                } else {
                    Pacotes = oUtil.SortByInt(pacotesValidos, true, "Ordem");                                       
                }                

                //recuperando produtos dos pacotes
                tableName = "GRD_Pacote_Products";
                dbControl.SelectALL(tableName, function (result) {                    
                    if (result == null || result.length == 0) {
                        oUtil.ShowModalError("", "Erro ao recuperar produtos dos pacotes");
                        return;
                    }
                    for (var i = 0; i < Pacotes.length; i++) {
                        var pacote = Pacotes[i];
                        pacote.Products = [];
                        for (var j = 0; j < result.length; j++) {
                            var obj = result[j];
                            if (obj.GRD_PacoteID == pacote.ID) {
                                pacote.Products.push(obj);
                            }
                        }
                    }                    
                    _this.pacotes = Pacotes;

                    //Recuperando pacote selecionado pelo usuário
                    tableName = "GRD_Aluno_Pacote";
                    dbControl.SelectByIndex(tableName, _this.aluno_turma_id, function (result) {
                        if (result != false && result != null && result != undefined) {
                            for (var i = 0; i < _this.pacotes.length; i++) {
                                var obj = _this.pacotes[i];
                                if (obj.ID == result.GRD_PacoteID) {
                                    _this.pacoteSelected = obj;
                                    break;
                                }
                            }                            
                            _this.MontaComboPacotes();
                        } else {
                            //update GRD_Aluno_Pacote
                            _this.pacoteSelected = _this.pacotes[0];
                            tableName = "GRD_Aluno_Pacote";
                            var obj = {
                                "GRD_AlunoTurmaID":  _this.aluno_turma_id
                                ,"GRD_PacoteID": _this.pacoteSelected.ID
                                ,"Created": new Date()
                                ,"LastModified": new Date()
                            };
                            dbControl.Insert(tableName, obj, function (result) {
                                if (result == false) {
                                    oUtil.ShowModalError("", "Erro ao registrar pacote default");
                                    return;
                                }
                                _this.MontaComboPacotes();
                            })
                        }                                                
                    });
                });                           
        });
        });
    }
    , MontaComboPacotes: function () {
        var _this = this;
        var combo = _this.jqThis.find(_this.combo_pacote);
        for (var i = 0; i < _this.pacotes.length; i++) {
            var obj = _this.pacotes[i];            
            combo.append("<option value=" + obj.ID + " " + (_this.pacoteSelected.ID == obj.ID ? "selected='selected'" : "") + ">" + obj.Nome + "</option>");
        }        
        combo.selectpicker('refresh');
        _this.MontaTableProducts(_this.cartProd, _this.detail);
    }
    , ReloadCartProd: function () {
        var _this = this;
        dbControl.SelectALL(dbControl.GRD_CART_PRODUCT.Name, function (result) {
            _this.cartProd = [];
            for (var i = 0; i < result.length; i++) {
                var obj = result[i];
                if (obj.AlunoTurmaID == Number(oProdutosOffline.aluno_turma_id) && obj.UserID == Number(oProdutosOffline.user_id_vendedor)) {
                    _this.cartProd.push(Number(result[i].ProductID));
                }
            }
            //console.log(_this.cartProd.length);
        })
    }
    , ListaItens: function (detail, cartProd, showItem, result, divProdutosUl) {
        var _this = this;
                for (var i = 0; i < result.length; i++) {
            var item = result[i];
            if (!item.ExibirListaProdutos) {
                continue;
            }

            aux = _this.GetHtmlItem(item, i, detail, cartProd, showItem);
            divProdutosUl.append(aux);
            $("#chk" + item.ProductID).bind("click", function (e) {
                oProdutosOffline.SelectProduct(e);
            });
        }
    }
    , GetHtmlItem: function (item, i, detail, cartProd, showItem) {        
        var checked = (cartProd.indexOf(item.ProductID) >= 0 ? "checked" : "");
        var exibir = (item.ExibirListaProdutos ? "" : "style='display:none;'");
        var dts = detail[item.ProductID];
                        var qtd = dts != null ? parseInt(dts.Qtd) : 0;
        var classRequired = "";
        var appPath = (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao);
        var thumb = appPath == "/" ? item.ImgThumb : appPath + item.ImgThumb;
        var main = appPath == "/" ? item.ImgMain : appPath + item.ImgMain;
        var minQtd = 0;
        var disabledMin = qtd == minQtd ? "disabled=disabled" : "";

                        //if (result[i].ProductID == 3688 || result[i].ProductID == 3690) {
                        //    result[i].ProdutoObrigatorio = true;
                        //}

        if (item.ProdutoObrigatorio == true) {
                            classRequired = 'jqChkRequiredProduct';                            
                            if (qtd > 0) { checked = "checked" }
                        }
                        
        aux = '<li class="li-product-' + item.ProductID + ' '+ (showItem || checked != "" ? "" : "hidden") + '" > ' +
                '<div class="zoom-img" img_zoom_path="'+main+'"> ' +
                    '<i class="material-icons">zoom_in</i> ' +
                '</div>' +
                '<img class="thumb-img" src="' + thumb + '" /> ' +
                '<div class="infos"> ' +
                    '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="chk' + item.ProductID + '"> ' +
                        '<input type="checkbox" id="chk' + item.ProductID + '" data-product-qtd="' + qtd + '" data-product-id="' + item.ProductID + '" ' + checked + ' class="mdl-checkbox__input jqProduct ' + classRequired + ' chk_' + item.ProductID + '"   />' +
                        '<span class="mdl-checkbox__label">' +
                            '<strong>' + item.NomeProduto + '</strong>' +
                        '</span>' +
                    '</label>' +
                    '<div class="txt-fotos-selecionadas">' +
                         (item.QtdMaxFoto > 0 ? ('Fotos Selecionadas: <span id="qtd_fotos_' + item.ProductID + '">' + (checked == "checked" ? detail[item.ProductID].fotos_selecionadas.toString() : "0")) : '') + '</span>' +
                    '</div>' +
                    '<div class="info-inferior">' + 
                        '<div class="cont-btn-visualizar">' +
                            (item.QtdMaxFoto > 0 ? "<a href=\"javascript:oProdutosOffline.ViewProducts(" + item.ProductID + "," + item.QtdMaxFoto + "," + item.QtdMinFoto + "," + item.PercentualDescarte + ",'" + item.NomeProduto + "'," + item.ProductConfigID + ",'" + item.Grupo + "')\"  target=\"_self\" class=\"ancora-acao ancora-acao-visualizar ancora-acao-btn\" title=\"Visualizar\">Selecionar Fotos</a>" : "") +
                        '</div>' +
                        '<div class="div-grupo-alterar-qtd"> ' +
                        '   <div class="input-group"> ' +
                        '       <span class="input-group-btn"> ' + 
                        '           <button type="button" class="btn btn-danger btn-number btn-number-'+item.ProductID+' btn-number-minus-'+item.ProductID+'" data-product-id="'+item.ProductID+'" data-type="minus" data-field="quant[2]" '+disabledMin+'>'+
                        '               <span class="glyphicon glyphicon-minus"></span>' + 
                        '           </button> ' + 
                        '       </span>' + 
                        '       <input type="text" name="quant[2]" class="form-control input-number jqQtdProduct" id="txt_'+item.ProductID+'" data-product-id="'+item.ProductID+'" value="'+qtd+'" min="'+minQtd+'" max="1000" > ' +
                        '       <span class="input-group-btn"> ' + 
                        '           <button type="button" class="btn btn-success btn-number btn-number-'+item.ProductID+'" data-product-id="'+item.ProductID+'" data-type="plus" data-field="quant[2]"> ' +
                        '               <span class="glyphicon glyphicon-plus"></span> ' + 
                        '           </button> ' + 
                        '       </span> ' + 
                        '    </div> ' + 
                        '</div> ' +
                    '</div> ' +
                '</div>' +
                '</li>';        
        return aux;
    }
    , MontaTableProducts: function (cartProd, detail) {
        var _this = this;
        //Loop na tabela de produtos para listagem
        dbControl.SelectALL(dbControl.v_GRD_Products.Name, function (result) {
            var _this = oProdutosOffline;
            var aux = "";
            var divProdutos = _this.jqThis.find(_this.list_products);
            if (result.length == 0) {
                divProdutos.html("<span style='text-align: center;'>Nenhum dado encontrado</span>");
                        }
                        else {
                _this.v_GRD_Products = result;                
                result = oUtil.SortByString(result, true, "NomeProduto");
                divProdutos.append("<ul class='ul-itens'><ul/>");
                var divProdutosUl = _this.jqThis.find(".ul-itens");

                //listar primeiros os itens que pertencem ao pacote
                var showItem = true;
                var produtosPacote = [];                
                for (var i = 0; i < _this.pacoteSelected.Products.length; i++) {
                    var obj = _this.pacoteSelected.Products[i];
                    for (var j = 0; j < result.length; j++) {
                        var objProd = result[j];
                        if (obj.ProductID == objProd.ProductID) {
                            produtosPacote.push(objProd);
                            break;
                        }
                    }
                        }

                _this.ListaItens(detail, cartProd, showItem, produtosPacote, divProdutosUl);

                var produtosRestantes = [];
                showItem = false;
                for (var i = 0; i < result.length; i++) {
                    var obj = result[i];
                    var existePacote = false;
                    for (var j = 0; j < produtosPacote.length; j++) {
                        var objProd = produtosPacote[j];
                        if (obj.ProductID == objProd.ProductID) {                            
                            existePacote = true;
                            break;
                        }
                    }
                    if (!existePacote) {
                        produtosRestantes.push(obj);
                    }
                }

                //listar os itens que não pertencem ao pacote             
                _this.ListaItens(detail, cartProd, showItem, produtosRestantes, divProdutosUl);

                _this.jqThis.find(_this.pacote_id_old).val(_this.pacoteSelected.ID);
    
                divProdutos.append("<div class='clear'></div> " +
                    "<button class='mdl-button mdl-js-button mdl-js-ripple-effect btn-default-border-rounded btn-rounded-product btn-incluir-itens'>Incluir Itens</button>");

                //executar scripts produtos obrigatorios                
                oProdutosOffline.CallSelectRequiredProducts();
                oUtil.RefactorMDL_JS();
                _this.jqThis.find(_this.btn_incluir_itens).removeClass("hidden");
            }

        });
    }
    , CallSelectRequiredProducts: function () {
        var _this = this;
        _this.jqThis.find('.jqChkRequiredProduct').each(function () {
            var oThis = $(this);
            var qtd = parseInt(oThis.attr("data-product-qtd"));            
            if (qtd == 0) {
                oThis.attr("data-product-qtd", 1);
                oThis.click();
            }
            oThis.attr('disabled', 'disabled');
        });        

    }
    , SelectProduct: function (e, qtdDefault) {
        var product_id = $(e.target).attr("data-product-id");
        var product_qtd = qtdDefault != undefined ? qtdDefault : parseInt($(e.target).attr("data-product-qtd"));
        if (product_qtd == 0) {
            product_qtd = 1;
        }

        dbControl.SelectALL(dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name, function (result) {

            var qtd_fotos = 0;
            if (!result)
                return;

            for (var i = 0; i < result.length; i++) {
                if (result[i].AlunoTurmaID == Number(oProdutosOffline.aluno_turma_id) && result[i].ProductID == product_id && result[i].OrderID == null) {
                    qtd_fotos++;
                }
            }
            $("#qtd_fotos_" + product_id).html(qtd_fotos);

            var objCart = {};
            objCart.AlunoTurmaID = Number(oProdutosOffline.aluno_turma_id);
            objCart.BookID = 0;
            objCart.ID = 1;
            objCart.ProductID = Number(product_id);
            objCart.Qtd = product_qtd;
            objCart.QtdFoto = qtd_fotos;
            objCart.UserID = Number(oProdutosOffline.user_id_vendedor);

            var objKey = {};
            objKey.AlunoTurmaID = Number(oProdutosOffline.aluno_turma_id);
            objKey.ProductID = Number(product_id);
            objKey.UserID = Number(oProdutosOffline.user_id_vendedor);            
            var formVal = oProdutosOffline.jqThis.find("#txt_" + product_id);
            var objMinus = oProdutosOffline.jqThis.find(".div-grupo-alterar-qtd .input-group .input-group-btn .btn-number-minus-" + product_id);
            
            if ($(e.target).is(':checked')) {
                dbControl.SelectByIndexComplex(dbControl.GRD_CART_PRODUCT.Name, objKey, function (result) {

                    if (result && result.length == 0) {
                        dbControl.Insert(dbControl.GRD_CART_PRODUCT.Name, objCart, function () {
                            formVal.val(1);
                            objMinus.removeAttr('disabled');
                            oProdutosOffline.ReloadCartProd()
                        });
                    }                    
                });
                
            }
            else {
                //$("#qtd_fotos_" + product_id).html(0);
                dbControl.DeleteByIndexComplex(dbControl.GRD_CART_PRODUCT.Name, objKey, function () {
                    objMinus.attr('disabled', true);
                    formVal.val(0);
                    oProdutosOffline.ReloadCartProd();
                });
            }

        });
    }
    //Métodos - Fim    
}

oOffline.verifyAcesso();

jQuery(document).ready(function () {    
    oProdutosOffline.Carregar();
});

dbControl.CallbackOpenOnSuccess = function () {    
    //var tableVend = dbControl.vendedor_turma_aluno.Name;    
    //var cartProd = [];
    //var detail = new Array();
    //var ORDER_PRODUCT_PHOTOS = [];
    var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno")); //objeto definido na tela de aluno offline

    if (dados == undefined || isNaN(dados.AlunoTurmaID))
    {
        alert("Não foi possivel verificar o aluno. Você será direcionado para a seleção de alunos.");
        document.location = oProdutosOffline.url_view_alunos;
    }
    else {

        oProdutosOffline.aluno_turma_id = Number(dados.AlunoTurmaID);
        oProdutosOffline.user_id_vendedor = Number(dados.UserIdVendedor);
        oProdutosOffline.GetAlunoDados(oProdutosOffline.aluno_turma_id);
        oProdutosOffline.turmaID = parseInt(dados.TurmaID);
    }
    
    oProdutosOffline.GetFotosSelecionadas(oProdutosOffline.ORDER_PRODUCT_PHOTOS, dados.AlunoTurmaID);
    
    /*
    dbControl.SelectALL(tableVend, function (result) {
        if (result.length == 0) {
            alert("Não foi possivel verificar o aluno. Você será direcionado para a seleção de alunos.");
            document.location = oProdutosOffline.url_view_alunos;
        }
        else {
            oProdutosOffline.aluno_turma_id = result[0].AlunoTurmaID;
            oProdutosOffline.user_id_vendedor = result[0].UserIdVendedor;
            oProdutosOffline.GetAlunoDados(oProdutosOffline.aluno_turma_id)
        }
    });*/   

}