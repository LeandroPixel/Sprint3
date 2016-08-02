var oPedidosPendentes = {
    //Objetos - Início
    jqThis: null
    , ListTipoPgto: []
    , StatusSync: [{ id: 1, name: "Pendente" }, { id: 2, name: "Sincronizado" }, { id: 3, name: "Erro" }]
    , Orders_Pending: []
    , oOrderComplete: null
    //Objetos - Fim

    //Eventos - Início
	, evento_click: 'click'
    //Eventos - Fim

    //Seletores - Início
	, seletor_geral: '.conteudo-geral'
    , bootstrap_table: '#table-pedidos-list'
    , btn_enviar_pedido: '.btn-enviar-pedido'
    //Seletores - Fim

    //variaveis
    , url_api_sync_pedido: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/api/Checkout/RegisterOrder"
    , cookie_user_name: ""

    //Métodos - Início    
	, Carregar: function (ListTipoPgto, cookie_user_name) {
	    var _this = this;	    
	    _this.ListTipoPgto = ListTipoPgto;
	    _this.cookie_user_name = cookie_user_name;	    
	    _this.jqThis = jQuery(_this.seletor_geral);
	    
	    if (_this.jqThis.length) {
	        _this.CarregarEventos();
	    }
	}
	, CarregarEventos: function () {
	    var _this = this;
	}
    , GetAlunoTurmaID: function (value, row) {        
        return row.DadosPgto.alunoTurmaId;
    }
    , GetOrdersPending: function (id) {
        var _this = this;
        var ret = null;
        for (var i = 0; i < _this.Orders_Pending.length; i++) {
            var obj = _this.Orders_Pending[i];
            if (id == obj.ID) {
                ret = obj;
                break;
            }  
        }
        return ret;
    }
    , TrataErroSync: function (data, orders_pending) {
        var _this = this;
        try {
            dataParsed = data;
            if (data.responseText != undefined) {
                dataParsed = JSON.parse(data.responseText);
            }
            
            var idErro = dataParsed.erro_id != undefined ? dataParsed.erro_id : (dataParsed.CodErro != undefined ? dataParsed.CodErro : "");
            var message = (dataParsed.Message != undefined ? dataParsed.Message : dataParsed.Mensagem);
            var date = new Date();            

            var erro = new pedidos_pendentes_error_cls(
                idErro
                , oUtil.FormatDate3(date)
                , message
                );            
            orders_pending.Erros.push(erro);
            orders_pending.NumTentativasSync++;
            orders_pending.StatusSync = _this.StatusSync[2].name;

            dbControl.UpdateByIndex(dbControl.Orders_Pending.Name, orders_pending.ID, orders_pending, function (result) {
                if (result != undefined && result == true) {
                    if (data.Sucesso == false) {
                        oUtil.ShowModalError("", message);
                    } else {
                        oUtil.ShowModalError("", "", data);
                    }
                } else {
                    oUtil.ShowModalError("", "Erro ao atualizar informacoes de erro");
                }
                var bootstrapTable = $(_this.bootstrap_table);                
                bootstrapTable.bootstrapTable('load', _this.Orders_Pending);
            })
        } catch (e) {
            oUtil.ShowModalError("", "Erro TrataErroSync " + e);
        }        
    }
    , CompleteSyncOrder: function (orders_pending) {
        var _this = this;
        orders_pending.NumTentativasSync++;
        orders_pending.StatusSync = _this.StatusSync[1].name;
        orders_pending.DataConclusaoSync = oUtil.FormatDate3(new Date());
        dbControl.UpdateByIndex(dbControl.Orders_Pending.Name, orders_pending.ID, orders_pending, function (result) {
            if (result != undefined && result == true) {                
                oUtil.DeleteInfoIndexDB(parseInt(orders_pending.DadosPgto.alunoTurmaId), _this.ShowMsgOkSyncPedido);
            } else {
                oUtil.ShowModalError("", "Erro ao processar sync");
            }
        })
    }
    
    , ShowMsgOkSyncPedido: function () {
        var _this = oPedidosPendentes;
        var msg_ok = "Pedido sincronizado com sucesso.";
        if (_this.oOrderComplete != null && _this.oOrderComplete != undefined && _this.oOrderComplete.code != undefined) {
            msg_ok += "<BR> Pedido número: " + _this.oOrderComplete.code;
        }
        oUtil.ShowModalGeral("<i class='material-icons ico-done'>done</i> ", msg_ok);
        var bootstrapTable = $(_this.bootstrap_table);
        bootstrapTable.bootstrapTable('load', _this.Orders_Pending);
        _this.oOrderComplete = null;        
    }
    , SyncOrder: function (id) {
        var _this = this;        
        if (!oOffline.CheckNetConnection()) {
            oUtil.ShowModalError("", "Não é possível sincronizar offline");
            return;
        }

        var objAux = _this.GetOrdersPending(id);
        if (objAux == null || objAux.DadosPgto == null) {
            oUtil.ShowModalError("", "Não foi possível recuperar as informações do pedido id: "+id);
            return;
        }
        _this.oOrderComplete = null;
        var objAjax = objAux.DadosPgto;
        oUtil.ShowLoader(true);
        $.ajax({
            url: _this.url_api_sync_pedido
            , data: JSON.stringify(objAjax)
        	, contentType: 'application/json'
            , method: "POST"
            , headers: oUtil.GetToken()
        }).fail(function (data, textStatus, jqXHR) {

            _this.TrataErroSync(data, objAux);

        }).done(function (data, textStatus, jqXHR) {            
            if (data.Sucesso == false) {                
                _this.TrataErroSync(data, objAux);                                           
            } else {
                _this.oOrderComplete = data.Order;
                _this.CompleteSyncOrder(objAux);
            }            
        }).always(function () {
            
        });
    }
    , AtivaBtnEnviarPedido: function (status) {
        if (status == "pendente" || status == "erro") {
            return true;
        } else {
            return false;
        }
    }
    , BtnEnviarPedido: function (value, row) {
        var _this = oPedidosPendentes;
        var acaoBtn = "#";
        var classDisabled = "mdl-button--disabled";        
        var status = row.StatusSync.toLowerCase();
        if (_this.AtivaBtnEnviarPedido(status)) {
            acaoBtn = "javascript:oPedidosPendentes.SyncOrder(" + row.ID + ")";
            classDisabled = "";
        }
        return "<a href='" + acaoBtn + "' status='"+status+"' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored " + classDisabled + " btn-enviar-pedido'>Enviar Pedido</a>";
    }
    , GetTipo: function (value, row) {        
        var _this = oPedidosPendentes;        
        var tipos = _this.ListTipoPgto;
        var tipo = "";
        var tipoID = row.DadosPgto.pagamento.tipoId;
        for (var i = 0; i < tipos.length; i++) {
            var obj = tipos[i];
            if (tipoID == tipos[i].id) {
                tipo = obj.desc;
            }
        }
        return tipo;
    }
    , GetValor: function (value, row) {        
        return row.DadosPgto.valorTotal;
    }
    //Métodos - Fim    
}

oOffline.verifyAcesso();

jQuery(document).ready(function () {      
    oPedidosPendentes.Carregar(listTipoPgto, cookie_user_name);
});

oOffline.CallbackVerifyOnline = function (online) {
    if (online == true) {
        $(oPedidosPendentes.btn_enviar_pedido).each(function (index, element) {
            var _this = oPedidosPendentes;
            var obj = $(element);
            var status = obj.attr("status").toLowerCase();            
            if (_this.AtivaBtnEnviarPedido(status)) {
                obj.removeClass("mdl-button--disabled");
            }            
        });        
    } else {
        $(oPedidosPendentes.btn_enviar_pedido).each(function (index, element) {
            var obj = $(element);
            obj.addClass("mdl-button--disabled");         
        });
    }
}

dbControl.CallbackOpenOnSuccess = function () {
    var _this = oPedidosPendentes;

    //criar objeto para simular um pedido pendente    
    jQuery(document).ready(function () {        
        var user = oOffline.getCookie(_this.cookie_user_name);
        user = JSON.parse(user);      
        dbControl.SelectALL(dbControl.Orders_Pending.Name, function (result) {
            var info = [];
            if (result != null && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var obj = result[i];                    
                    if (obj.StatusSync.toLowerCase() != "sincronizado" && obj.DadosPgto.userId == user.User_ID) {
                        info.push(obj);
                    }
                }                
            }
            _this.Orders_Pending = info;            
            var bootstrapTable = $(oPedidosPendentes.bootstrap_table);
            bootstrapTable.bootstrapTable({ data: info });            
        });
    });
}