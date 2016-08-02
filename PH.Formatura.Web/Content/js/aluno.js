var oAluno = {
    //Objetos - Início
    jqThis: null
    , ListStatus: null
    , ListSinc: []
    //Objetos - Fim

    //Eventos - Início
	, evento_click: 'click'
    //Eventos - Fim

    //Seletores - Início
	, seletor_geral: '.conteudo-geral'
    , bootstrap_table: '#table-alunos-list'
    , div_dados_agendamento: '#div-dados-agendamento'
    , btn_close: '.btn-close'
    , btn_ok: '.btn-ok'
    , progressBar: '#progressBar'
    //Seletores - Fim

    //variaveis    
    , url_api_agendamento: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/api/Agendamento/Agendar"
    , url_api_change_status: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/api/Agendamento/ChangeStatus"
    , url_view_photos: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/Produtos"
    , url_api_aluno_sync: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/api/Alunos/Sync"
    , cookie_user_name: null
    , indexDBON: false
    , Titulo_Modal: ''
    , TotalProcessosSync: 3

    //Métodos - Início
	, Carregar: function (ListStatus, cookie_user_name) {
	    var _this = this;

	    _this.jqThis = jQuery(_this.seletor_geral);
	    _this.ListStatus = ListStatus;

	    if (_this.jqThis.length) {
	        _this.CarregarEventos();
	    }
	    _this.cookie_user_name = cookie_user_name;
	    //_this.LoadDatePicker();
	}
	, CarregarEventos: function () {
	    var _this = this;
	    var bootstrapTable = _this.jqThis.find(_this.bootstrap_table);
	    bootstrapTable.on('post-body.bs.table', function (data) {
	        _this.LoadDatePicker();
	    });
	    bootstrapTable.on('load-success.bs.table', function (data) {	        
	        _this.VerifyIfUserIsSynced();
	    });

	    $(window).resize(function () {
	        _this.WindowResize();
	    });
	}
    , Data_Agendamento: function (value, row) {
        var alunoID = row.AlunoID;
        var id = "datapicker_" + alunoID;
        var html = "<div id='" + id + "' class='div-input-date-picker'> " +
                        "<input onfocus='blur();' class='input-datepicker form-control datetimepicker date-agendamento-" + row.AlunoTurmaID + " fontSizeOpt' type='text' value_old='$Data' value='$Data' StatusIDAgendamento=" + row.StatusIDAgendamento + " VendedorID='" + row.VendedorID + "'AlunoTurmaID='" + row.AlunoTurmaID + "'>  " +
                        "<button class='mdl-button mdl-js-button mdl-button--icon btn-data-picker' onclick=javascript:oAluno.ShowDataPickerAgendamento('" + id + "')> " +
                            "<i class='material-icons'>more_horiz</i> " +
                        "</button> " +
                        "</div>";        

        if (value != null && value != undefined && value != "") {
            var data = oUtil.FormatDate2(value);
            html = html.replace("$Data", data);
            html = html.replace("$Data", data);
            //return "<input class='input-datepicker form-control' type='text' value='" + oUtil.FormatDateBR(value) + "'>";
            return html;
        } else {
            html = html.replace("$Data", "Agendar");
            html = html.replace("$Data", "Agendar");
            return html;
        }
    }
    , LoadDatePicker: function () {
        var _this = this;
        var oDatepicker = _this.jqThis.find('.datetimepicker');
        config = oUtil.GetConfigDateTimePicker();
        config.onSelectDate = function (dp, $input) {            
            return _this.ChangeDate(dp, $input);
        }
        config.onClose = function (dp, $input) {
            return _this.ChangeDate(dp, $input);
        }        
        oDatepicker.datetimepicker(config);        
    }
    , PopAgendamentoCancelar: function (AlunoTurmaID, value_old) {
        var _this = this;
        var input = _this.jqThis.find('.date-agendamento-' + AlunoTurmaID);
        input.val(value_old);
        var modal = $(_this.div_dados_agendamento);
        modal.modal('hide');
    }
    , PopAgendamentoOk: function (new_value, vendedorID, alunoTurmaID, $input, StatusIDAgendamento) {
        var _this = this;
        var modal = $(_this.div_dados_agendamento);
        modal.modal('hide');
        $input.attr("StatusIDAgendamento","-1");
        oAluno.DoChangeDate(new_value, vendedorID, alunoTurmaID, $input, StatusIDAgendamento);
    }
    , ChangeDate: function (dp, $input) {
        var vendedorID = $input.attr("VendedorID");
        var alunoTurmaID = $input.attr("AlunoTurmaID");
        var value_old = $input.attr("value_old");
        var StatusIDAgendamento = $input.attr("StatusIDAgendamento");
        var new_value = $input.val();
        if (value_old != new_value) {
            if (StatusIDAgendamento == 7) {
                var modal = $(_this.div_dados_agendamento);
                modal.find(_this.btn_close).unbind(_this.evento_click);
                modal.find(_this.btn_close).on(_this.evento_click, function (evento) { _this.PopAgendamentoCancelar(alunoTurmaID, value_old); return false; });
                modal.find(_this.btn_ok).unbind(_this.evento_click);
                modal.find(_this.btn_ok).on(_this.evento_click, function (evento) { _this.PopAgendamentoOk(new_value, vendedorID, alunoTurmaID, $input, StatusIDAgendamento); return false; });
                modal.modal();
                return true;
            }
            oAluno.DoChangeDate(new_value, vendedorID, alunoTurmaID, $input, StatusIDAgendamento);
            return false;
        } else {
            return true;
        }
    }
    , DoChangeDate: function (date, vendedorID, alunoTurmaID, $input, StatusIDAgendamento) {
        var _this = this;
        info = { data: date, vendedorID: vendedorID, alunoTurmaID: alunoTurmaID };
        
        $.ajax({
            type: 'POST',
            url: _this.url_api_agendamento,
            data: JSON.stringify(info),
            headers: oUtil.GetToken(),
            contentType: 'application/json',
            beforeSend: function () {
                oUtil.ShowLoader(true);
            }
        })
			.done(function (poJSON) {
			    var Titulo_Modal = 'Aluno';
			    if (poJSON.Sucesso) {
			        $input.attr("value_old", date);			        
			        if (poJSON.Obj.Status != StatusIDAgendamento) {			            
			            var combo_status = _this.jqThis.find('.alter-status-' + alunoTurmaID);
			            nameStatus = _this.GetNameStatus(poJSON.Obj.Status);
			            combo_status.html(_this.ReturnDropStatus(nameStatus, poJSON.Obj.Status, vendedorID, alunoTurmaID, true));
			        }
			        var datapicker = _this.jqThis.find('#datapicker_' + alunoTurmaID + ' .datetimepicker');
			        datapicker.datetimepicker('toggle');
			        oUtil.ShowModalGeral("<i class='material-icons ico-done'>done</i> " + Titulo_Modal, poJSON.Mensagem);			        
			    }
			})
			.fail(function (jqXHR, textStatus) {
			    oUtil.ShowModalError("", "", jqXHR, 'Aluno');
			})
			.always(function (jqXHR, textStatus) {
			    oUtil.ShowLoader(false);
			})
        ;
    }
    , GetNameStatus: function (Status) {
        var _this = this;
        var name = null;
        for (var i = 0; i < _this.ListStatus.length; i++) {
            var obj = _this.ListStatus[i];
            if (obj.ID == Status) {
                name = obj.Descricao;
                break;
            }
        }
        return name;
    }
    , ShowDataPickerAgendamento: function (id) {
        var _this = this;
        var datapicker = _this.jqThis.find('#' + id + ' .datetimepicker');
        datapicker.datetimepicker('show');
    }
//    , BtnVisualizarFotos: function (value, row) {
//        return "<a href='" + oAluno.url_view_photos + "?a=" + value + "' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored'>Produtos</a>";
    //    }
    , BtnVisualizarFotos: function (value, row) {
        var _this = oAluno;
        var id = "lnkGotoProducts" + row.AlunoTurmaID + "_" + row.BrandID;

        var data_values = "data-aluno_turma_id='" + row.AlunoTurmaID + "' data-user_id_vendedor='" + row.UserIDvENDEDOR + "' ";
        data_values += "data-aluno_id = '" + row.AlunoID + "' data-turma_id = '" + row.TurmaID + "'";        

        return "<a id='" + id + "' " + data_values + " onclick=\"javascript:{oAluno.OpenProducts(" + row.AlunoTurmaID + "," + row.UserIDvENDEDOR + "," + row.AlunoID + "," + row.TurmaID + ",'" + value + "','" + row.NomeAluno + "','" + row.NomeTurma + "')}\" href='#' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored fontSizeOpt'>Projetos</a>";
    }

    , Status: function (value, row) {
        var vendedorID = row.VendedorID;
        var alunoTurmaID = row.AlunoTurmaID;
        return oAluno.ReturnDropStatus(value, row.StatusIDAgendamento, vendedorID, alunoTurmaID);
    }
    , ReturnDropStatus: function (nameStatus, idStatus, vendedorID, alunoTurmaID, reload) {
        if (reload == undefined) {
            reload = false;
        }
        var html = "      <button class='btn btn-default dropdown-toggle fontSizeOpt' type='button' id='dropdownMenu_" + alunoTurmaID + "' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'> " +
                    "        " + nameStatus +
                    "        <span class='caret'></span> " +
                    "      </button> " +
                    "      <ul class='dropdown-menu' aria-labelledby='dropdownMenu_" + alunoTurmaID + "'> " +
                            oAluno.ReturnStatusOptions(idStatus, vendedorID, alunoTurmaID) +
                    "      </ul> ";
        if (reload == false) {
            return "<div class='dropdown alter-status-"+ alunoTurmaID +"'> " +
                    html + 
                    "</div> ";
        }else{
            return html;
        }
    }
    , ReturnStatusOptions: function (statusAtual, vendedorID, alunoTurmaID) {
        var html = "";
        for (var i = 0; i < oAluno.ListStatus.length; i++) {
            var obj = oAluno.ListStatus[i];
            if (statusAtual != obj.ID) {
                html += "<li><a href='javascript:oAluno.DoChangeStatus(" + obj.ID + "," + vendedorID + "," + alunoTurmaID + ")'>" + obj.Descricao + "</a></li>";
            }
        }
        return html;
    }
    , DoChangeStatus: function (statusID, vendedorID, alunoTurmaID) {
        var _this = this;
        info = { statusID: statusID, vendedorID: vendedorID, alunoTurmaID: alunoTurmaID };
        $.ajax({
            type: 'POST',
            url: _this.url_api_change_status,
            data: JSON.stringify(info),
            headers: oUtil.GetToken(),
            contentType: 'application/json',
            beforeSend: function () {
                oUtil.ShowLoader(true);
            }
        })
			.done(function (poJSON) {
			    var Titulo_Modal = 'Aluno';
			    if (poJSON.Sucesso) {
			        oUtil.ShowModalGeral("<i class='material-icons ico-done'>done</i> " + Titulo_Modal, poJSON.Mensagem);
			        var bootstrapTable = _this.jqThis.find(_this.bootstrap_table);
			        bootstrapTable.bootstrapTable('refresh', null)
			    }
			})
			.fail(function (jqXHR, textStatus) {
			    oUtil.ShowModalError("", "", jqXHR, 'Aluno');
			})
			.always(function (jqXHR, textStatus) {
			    oUtil.ShowLoader(false);
			})
        ;
    }
    , BtnSync: function (value, row) {

        var _this = this;
        var texto = "SINCRONIZAR";
        var classe = "CustomButtom";

        if (oAluno.ListSinc[row.AlunoTurmaID] != undefined && oAluno.ListSinc[row.AlunoTurmaID] == "SINCRONIZADO") {
            texto = oAluno.ListSinc[row.AlunoTurmaID];
            classe = "CustomButtomSync";
        }

        var html = "<button id='btn-sync-" + row.AlunoTurmaID + "' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect " + classe + "' " +
                    " onclick=javascript:oAluno.SyncOffline(" + row.AlunoID + "," + row.TurmaID + "," + row.VendedorID + "," + row.AlunoTurmaID + "," + row.AlbumID + ")> " +
                    texto + "<!--<i class='material-icons'>file_download</i> -->" +
                    "</button> ";
        return html;
    }
    , GetTablesToSync: function () {
        var tablesDominio = [];
        tablesDominio.push({
            Name: dbControl.v_GRD_TabelaPreco.Name
            , LastSync: dbControl.v_GRD_TabelaPreco.LastSync            
        })
        tablesDominio.push({
            Name: dbControl.v_GRD_Products.Name
            , LastSync: dbControl.v_GRD_Products.LastSync            
        })
        tablesDominio.push({
            Name: dbControl.GRD_AlunoTurma_Photos.Name
            , LastSync: dbControl.GRD_AlunoTurma_Photos.LastSync            
        })
        tablesDominio.push({
            Name: dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name
            , LastSync: dbControl.GRD_ORDER_PRODUCT_PHOTOS.LastSync            
        })
        tablesDominio.push({
            Name: dbControl.GRD_CART_PRODUCT.Name
            , LastSync: dbControl.GRD_CART_PRODUCT.LastSync            
        })
        tablesDominio.push({
            Name: dbControl.Photos_Album.Name
            , LastSync: dbControl.Photos_Album.LastSync
        })
        tablesDominio.push({
            Name: dbControl.GRD_Pacote.Name
            , LastSync: dbControl.GRD_Pacote.LastSync
        })
        tablesDominio.push({
            Name: dbControl.GRD_Pacote_Products.Name
            , LastSync: dbControl.GRD_Pacote_Products.LastSync
        })
        tablesDominio.push({
            Name: dbControl.GRD_Turma_Pacote.Name
            , LastSync: dbControl.GRD_Turma_Pacote.LastSync
        })
        tablesDominio.push({
            Name: dbControl.GRD_Aluno_Pacote.Name
            , LastSync: dbControl.GRD_Aluno_Pacote.LastSync
        })
        return tablesDominio;
    }

    , OpenProducts: function (aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma) {
        var _this = this;
        _this.VerifyDadosIndexDB(aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma)
    }

    , ShowPopRemoveDadosIndexDB: function (aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma) {
        var _this = this;
        var modal = $("#div-dados-sync");
        modal.find(".btn-ok").unbind(_this.evento_click);
        modal.find(".btn-ok").on(_this.evento_click, function (evento) { _this.GetDadosToDeleteIndexDB(aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma); return false; });
        modal.modal();
    }
    , GetDadosToDeleteByAluno: function (result, aluno_turma_id, dadosToDelete, tableName) {
        var _this = this;
        try {
            if (result != undefined || result != null || result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var obj = result[i];
                    if (obj.AlunoTurmaID == aluno_turma_id) {
                        dadosToDelete.push({
                            dado: obj,
                            NameTable: tableName
                        });
                    }
                }
            }
        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo: GetDadosToDeleteByAluno erro " + e);
        }        
    }
    , DeleteDadosIndexDB: function (aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, dadosToDelete, photoIds, indiceGeral, totalToDelete, nome_aluno, nome_turma) {
        var _this = this;        
        try {
            //deletar as fotos             
            var totalFotos = photoIds.length;
            var tableName = dbControl.Photos_Album.Name;            
            if (totalFotos > 0) {
                for (var i = 0; i < totalFotos; i++) {                    
                    dbControl.DeleteByIndex(tableName, photoIds[i], function (result, indice) {
                        if (result == false) {
                            oUtil.ShowModalError("", "Erro metodo: DeleteByIndex -> t:" + tableName + " -> erro " + e);
                            return;
                        }
                        if (result == true) {
                            if ((indice + 1) == totalFotos) {
                                _this.DeleteDadosIndexDB(aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, dadosToDelete, [], indiceGeral, totalToDelete, nome_aluno, nome_turma);
                            }
                        }
                    }, i);
                }
                return;
            }

            if (totalToDelete == (indiceGeral)) {                
                _this.OpenProductsDO(aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma);
                return;
            }
                        
            var obj = dadosToDelete[indiceGeral];            
            switch (obj.NameTable.toLowerCase()) {
                case "v_grd_listaalunos":                    
                    var table = dbControl[obj.NameTable].Name;
                    dbControl.DeleteByIndexComplex(table, obj.dado, function (result) {
                        if (result == false) {
                            oUtil.ShowModalError("", "Erro metodo: DeleteByIndexComplex -> t:" + table);
                            return;
                        }                        
                        indiceGeral++;
                        _this.DeleteDadosIndexDB(aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, dadosToDelete, [], indiceGeral, totalToDelete, nome_aluno, nome_turma);
                    });
                    return;
                    break;
                case "grd_alunoturma_photos":                    
                    var table = dbControl[obj.NameTable].Name;
                    dbControl.DeleteByIndex(table, obj.dado.ID, function (result) {
                        if (result == false) {
                            oUtil.ShowModalError("", "Erro metodo: DeleteByIndex -> t:" + table);
                            return;
                        }
                        indiceGeral++;
                        _this.DeleteDadosIndexDB(aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, dadosToDelete, [], indiceGeral, totalToDelete, nome_aluno, nome_turma);
                    });
                    return;
                    break;
                case "grd_order_product_photos":                    
                    var table = dbControl[obj.NameTable].Name;
                    dbControl.DeleteByIndexComplex(table, obj.dado, function (result) {
                        if (result == false) {
                            oUtil.ShowModalError("", "Erro metodo: DeleteByIndexComplex -> t:" + table);
                            return;
                        }
                        indiceGeral++;
                        _this.DeleteDadosIndexDB(aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, dadosToDelete, [], indiceGeral, totalToDelete, nome_aluno, nome_turma);
                    });
                    return;
                    break;
                case "grd_cart_product":
                    //console.log("delete GRD_CART_PRODUCT");
                    var table = dbControl[obj.NameTable].Name;
                    dbControl.DeleteByIndexComplex(table, obj.dado, function (result, indice) {
                        if (result == false) {
                            oUtil.ShowModalError("", "Erro metodo: DeleteByIndexComplex -> t:" + table);
                            return;
                        }
                        indiceGeral++;
                        _this.DeleteDadosIndexDB(aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, dadosToDelete, [], indiceGeral, totalToDelete, nome_aluno, nome_turma);
                    });
                    return;
                    break;
                default:
                    throw "Tabela nao implementada para delecao " + obj.NameTable;
                    return;
                    break;
            }
        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo: DeleteDadosIndexDB erro " + e);
        }        
    }
    , GetDadosToDeleteIndexDB: function (aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma) {
        var _this = this;
        try {
            oUtil.ShowLoader(true);
            var dadosToDelete = [];
            var photoIds = [];
            var tableName = dbControl.v_GRD_ListaAlunos.Name;
            dbControl.SelectALL(tableName, function (result) {
                _this.GetDadosToDeleteByAluno(result, aluno_turma_id, dadosToDelete, tableName);
                tableName = dbControl.GRD_AlunoTurma_Photos.Name;
                dbControl.SelectALL(tableName, function (result) {
                    _this.GetDadosToDeleteByAluno(result, aluno_turma_id, dadosToDelete, tableName);
                    for (var i = 0; i < dadosToDelete.length; i++) {
                        var obj = dadosToDelete[i];
                        if (obj.NameTable == tableName) {
                            photoIds.push(obj.dado.PhotoID);
                        }
                    }

                    tableName = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;
                    dbControl.SelectALL(tableName, function (result) {
                        _this.GetDadosToDeleteByAluno(result, aluno_turma_id, dadosToDelete, tableName);
                        tableName = dbControl.GRD_CART_PRODUCT.Name;
                        dbControl.SelectALL(tableName, function (result) {
                            _this.GetDadosToDeleteByAluno(result, aluno_turma_id, dadosToDelete, tableName);
                            _this.DeleteDadosIndexDB(aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, dadosToDelete, photoIds, 0, dadosToDelete.length, nome_aluno, nome_turma);
                        })
                    })
                })
            });
        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo: GetDadosToDeleteIndexDB erro " + e);
        }         
    }

    , EhDoAluno: function (result, aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma) {
        var _this = this;
        try {
            var achou = false;
            if (result == undefined || result == null || result.length == 0) {
                return achou;
            }
            for (var i = 0; i < result.length; i++) {
                var obj = result[i];
                if (obj.AlunoTurmaID == aluno_turma_id) {
                    achou = true
                    break;
                }
            }
            if (achou) {
                _this.ShowPopRemoveDadosIndexDB(aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma);
            }
            return achou;
        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo: EhDoAluno erro " + e);
        }        
    }

    , VerifyDadosIndexDB: function (aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma) {
        var _this = this;
        try {
            var tableName = dbControl.v_GRD_ListaAlunos.Name;
            dbControl.SelectALL(tableName, function (result) {
                if (_this.EhDoAluno(result, aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma)) {
                    return;
                }

                tableName = dbControl.GRD_AlunoTurma_Photos.Name;
                dbControl.SelectALL(tableName, function (result) {
                    if (_this.EhDoAluno(result, aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma)) {
                        return;
                    }

                    tableName = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;
                    dbControl.SelectALL(tableName, function (result) {
                        if (_this.EhDoAluno(result, aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma)) {
                            return;
                        }

                        tableName = dbControl.GRD_CART_PRODUCT.Name;
                        dbControl.SelectALL(tableName, function (result) {
                            if (_this.EhDoAluno(result, aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma)) {
                                return;
                            }
                            _this.OpenProductsDO(aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma);
                        })
                    })
                })
            });
        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo: VerifyDadosIndexDB erro " + e);
        }        
    }

    , OpenProductsDO: function (aluno_turma_id, user_id_vendedor, aluno_id, turma_id, id, nome_aluno, nome_turma) {
        var dados = {
            ID: user_id_vendedor,
            AlunoTurmaID: aluno_turma_id,
            UserIdVendedor: user_id_vendedor,
            AlunoID: aluno_id,
            TurmaID: turma_id,
            AlunoTurmaID_Cript: id,
            NomeAluno: nome_aluno,
            NomeTurma: nome_turma,
            Origem: "ONLINE"
        };
        sessionStorage.setItem("config_turma_aluno", JSON.stringify(dados));
        window.location = oAluno.url_view_photos + "?a=" + id;
    }

    , SyncOffline: function (AlunoID, TurmaID, VendedorID, AlunoTurmaID, AlbumID) {
        var _this = this;
        var alunos = [];
        alunos.push({
            AlunoID: AlunoID,
            TurmaID: TurmaID,
            VendedorID: VendedorID,
            AlunoTurmaID: AlunoTurmaID,
            AlbumID: AlbumID
        });
        
        var SyncAluno = {
            Alunos: alunos
            , Tabelas: _this.GetTablesToSync()
        }

        $.ajax({
            type: 'POST',
            url: _this.url_api_aluno_sync,
            data: JSON.stringify(SyncAluno),
            headers: oUtil.GetToken(),
            contentType: 'application/json',
            beforeSend: function () {
                oUtil.ShowProgress(true);                
                oUtil.AddStepProgress(1, _this.TotalProcessosSync);                              
            },
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                //Upload progress
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        //Do something with upload progress                        
                        oUtil.UpdateProgressBar(percentComplete * 100);                        
                    }
                }, false);
                //Download progress
                xhr.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        //Do something with download progress                        
                        if (percentComplete < 1) {                            
                            oUtil.AddStepProgress(2, _this.TotalProcessosSync);                            
                        }                        
                        oUtil.UpdateProgressBar(percentComplete * 100);                        
                    }
                }, false);
                return xhr;
            },

        })
			.done(function (poJSON) {
			    _this.Titulo_Modal = 'Aluno';			    
			    if (poJSON == null || poJSON == undefined || poJSON.length == 0) {
			        oUtil.ShowModalGeral(_this.Titulo_Modal, "Erro ao sincronizar os dados (dados não encontrados)");
			        return;
			    }
			    //salvar informações no indexdb		
			    oUtil.UpdateProgressBar(0);			    
			    oUtil.AddStepProgress(3, _this.TotalProcessosSync);			    
			    oAluno.SaveIndexedDBAlunos(poJSON, 0, SyncAluno.Alunos.length);			    
			})
			.fail(function (jqXHR, textStatus) {
			    oUtil.ShowProgress(false);
			    oUtil.ShowModalError("", "", jqXHR, 'Aluno');
			})
			.always(function (jqXHR, textStatus) {
			    //oUtil.ShowLoader(false);
			})
        ;
    }

    , SaveIndexedDBAlunos: function (poJSON, indice, total) {
        var _this = oAluno;

        try {            
            var nextTable = dbControl.v_GRD_TabelaPreco.Name;
            if (total == 0) {
                _this.SaveIndexedDBPrecos(poJSON, 0, poJSON[nextTable].length);
                return;
            }
            var tableName = dbControl.v_GRD_ListaAlunos.Name;            
            var obj = poJSON[tableName][indice];

            dbControl.SelectByIndexComplex(tableName, obj, function (result) {
                var existe = (result != null && result != undefined && result.length > 0);
                if (existe) {
                    dbControl.UpdateByIndexComplex(tableName, obj, function (result) {
                        if (!_this.TrataRetExecIndexDB(result, "update", tableName, _this.Titulo_Modal)) {
                            return;
                        }
                        indice++;
                        (indice < total) ?
                        _this.SaveIndexedDBAlunos(poJSON, indice, total) :
                        _this.SaveIndexedDBPrecos(poJSON, 0, poJSON[nextTable].length);
                    });
                    return;
                }

                dbControl.Insert(tableName, obj, function (result) {
                    if (!_this.TrataRetExecIndexDB(result, "insert", tableName, _this.Titulo_Modal)) {
                        return;
                    }
                    indice++;
                    (indice < total) ?
                    _this.SaveIndexedDBAlunos(poJSON, indice, total) :
                    _this.SaveIndexedDBPrecos(poJSON, 0, poJSON[nextTable].length);
                });
            });
        } catch (e) {
            _this.TrataErroSaveIndexedDB(_this.Titulo_Modal, tableName, e);
        }
    }

    , SaveIndexedDBPrecos: function (poJSON, indice, total) {
        var _this = oAluno;
        try {
            oUtil.UpdateProgressBar(15);            
            var nextTable = dbControl.v_GRD_Products.Name;
            if (total == 0) {
                _this.SaveIndexedDBProducts(poJSON, 0, poJSON[nextTable].length);
                return;
            }
            var tableName = dbControl.v_GRD_TabelaPreco.Name;
            //var obj = poJSON[tableName][indice];

            dbControl.DeleteAllRows(tableName, function (result) {
                if (!_this.TrataRetExecIndexDB(result, "DeleteAllRows", tableName, _this.Titulo_Modal)) {
                    return;
                }
                dbControl.InsertArray(tableName, poJSON[tableName], function (result) {
                    if (!_this.TrataRetExecIndexDB(result, "InsertArray", tableName, _this.Titulo_Modal)) {
                        return;
                    }
                    _this.SaveIndexedDBProducts(poJSON, 0, poJSON[nextTable].length);
                });
            });
        } catch (e) {
            _this.TrataErroSaveIndexedDB(_this.Titulo_Modal, tableName, e);
        }
    }
    , SaveIndexedDBProducts: function (poJSON, indice, total) {
        var _this = oAluno;
        try {
            oUtil.UpdateProgressBar(38.5);            
            var nextTable = dbControl.GRD_AlunoTurma_Photos.Name;
            if (total == 0) {
                _this.SaveIndexedDBAlunoTurmaPhotos(poJSON, 0, poJSON[nextTable].length)
                return;
            }
            var tableName = dbControl.v_GRD_Products.Name;
            dbControl.DeleteAllRows(tableName, function (result) {
                if (!_this.TrataRetExecIndexDB(result, "DeleteAllRows", tableName, _this.Titulo_Modal)) {
                    return;
                }
                dbControl.InsertArray(tableName, poJSON[tableName], function (result) {
                    if (!_this.TrataRetExecIndexDB(result, "InsertArray", tableName, _this.Titulo_Modal)) {
                        return;
                    }
                    _this.SaveIndexedDBAlunoTurmaPhotos(poJSON, 0, poJSON[nextTable].length);
                });
            });
        } catch (e) {
            _this.TrataErroSaveIndexedDB(_this.Titulo_Modal, tableName, e);
        }
    }
    , SaveIndexedDBAlunoTurmaPhotos: function (poJSON, indice, total) {
        var _this = oAluno;
        try {
            oUtil.UpdateProgressBar(47);            
            var nextTable = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;
            if (total == 0) {
                _this.SaveIndexedDBOrderProductPhotos(poJSON, 0, poJSON[nextTable].length)
                return;
            }
            var tableName = dbControl.GRD_AlunoTurma_Photos.Name;
            var objArray =  poJSON[tableName];
            var obj = objArray[indice];            
            var indexName = "AlunoTurmaID";
                        
            dbControl.DeleteByHintIndexComplex(tableName, indexName, obj, function (result) {
                if (!_this.TrataRetExecIndexDB(result, "DeleteByHintIndexComplex", tableName, _this.Titulo_Modal)) {
                    return;
                }                        
                dbControl.InsertArray(tableName, objArray, function (result) {
                    if (!_this.TrataRetExecIndexDB(result, "InsertArray", tableName, _this.Titulo_Modal)) {
                        return;
                    }
                    _this.SaveIndexedDBOrderProductPhotos(poJSON, 0, poJSON[nextTable].length);
                });
            });                    
            
        } catch (e) {
            _this.TrataErroSaveIndexedDB(_this.Titulo_Modal, tableName, e);
        }
    }    
    , SaveIndexedDBOrderProductPhotos: function (poJSON, indice, total, skipDelete) {
        var _this = oAluno;
        try {
            oUtil.UpdateProgressBar(55.5);            
            if (skipDelete == undefined) {
                skipDelete = false;
            }
            var nextTable = dbControl.GRD_CART_PRODUCT.Name;
            var tableName = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;

            if (total == 0) {
                _this.SaveIndexedDBCartProducts(poJSON, 0, poJSON[nextTable].length);
                return;
            }

            var objArray = poJSON[tableName];
            var obj = objArray[indice];            
            var indexName = "AlunoTurmaID";

            dbControl.DeleteByHintIndexComplex(tableName, indexName, obj, function (result) {
                if (!_this.TrataRetExecIndexDB(result, "DeleteByHintIndexComplex", tableName, _this.Titulo_Modal)) {
                    return;
                }
                dbControl.InsertArray(tableName, objArray, function (result) {
                    if (!_this.TrataRetExecIndexDB(result, "InsertArray", tableName, _this.Titulo_Modal)) {
                        return;
                    }
                    _this.SaveIndexedDBCartProducts(poJSON, 0, poJSON[nextTable].length);
                });
            });            
        } catch (e) {
            _this.TrataErroSaveIndexedDB(_this.Titulo_Modal, tableName, e);
        }
    }    
    , SaveIndexedDBCartProducts: function (poJSON, indice, total, skipDelete) {
        var _this = oAluno;
        try {
            oUtil.UpdateProgressBar(64);            
            if (skipDelete == undefined) {
                skipDelete = false;
            }
            var nextTable = dbControl.Photos_Album.Name;
            var tableName = dbControl.GRD_CART_PRODUCT.Name;
            var objArray = poJSON[tableName];
            var obj = objArray[indice];
            var indexName = "AlunoTurmaID";
            if (total == 0) {
                _this.SaveIndexedDBPhotosAlbum(poJSON, 0, poJSON[nextTable].length)
                return;
            }

            dbControl.DeleteByHintIndexComplex(tableName, indexName, obj, function (result) {
                if (!_this.TrataRetExecIndexDB(result, "DeleteByHintIndexComplex", tableName, _this.Titulo_Modal)) {
                    return;
                }
                dbControl.InsertArray(tableName, objArray, function (result) {
                    if (!_this.TrataRetExecIndexDB(result, "InsertArray", tableName, _this.Titulo_Modal)) {
                        return;
                    }
                    _this.SaveIndexedDBPhotosAlbum(poJSON, 0, poJSON[nextTable].length);
                });
            });
        } catch (e) {
            _this.TrataErroSaveIndexedDB(_this.Titulo_Modal, tableName, e);
        }
    }
    , SaveIndexedDBPhotosAlbum: function (poJSON, indice, total) {
        var _this = oAluno;
        try {
            oUtil.UpdateProgressBar(72.5);
            var nextTable = dbControl.GRD_Pacote.Name;
            if (total == 0) {
                _this.SaveIndexedDBGRD_Pacote(poJSON, 0, poJSON[nextTable].length);
                //_this.CompleteSaveIndexedDB(_this.Titulo_Modal);
                return;
            }
            var tableName = dbControl.Photos_Album.Name;
            var obj = poJSON[tableName][indice];

            dbControl.SelectByIndex(tableName, obj.PhotoID, function (result) {
                var existe = (result != null && result != undefined);
                if (existe) {
                    dbControl.UpdateByIndex(tableName, obj.PhotoID, obj, function (result) {
                        if (!_this.TrataRetExecIndexDB(result, "update", tableName, _this.Titulo_Modal)) {
                            return;
                        }
                        indice++;
                        (indice < total) ? _this.SaveIndexedDBPhotosAlbum(poJSON, indice, total) : _this.SaveIndexedDBGRD_Pacote(poJSON, 0, poJSON[nextTable].length);/*_this.CompleteSaveIndexedDB(_this.Titulo_Modal)*/;
                    });
                    return;
                }
                dbControl.Insert(tableName, obj, function (result) {
                    if (!_this.TrataRetExecIndexDB(result, "insert", tableName, _this.Titulo_Modal)) {
                        return;
                    }
                    indice++;
                    (indice < total) ? _this.SaveIndexedDBPhotosAlbum(poJSON, indice, total) : _this.SaveIndexedDBGRD_Pacote(poJSON, 0, poJSON[nextTable].length);/*_this.CompleteSaveIndexedDB(_this.Titulo_Modal)*/;
                });
            });
        } catch (e) {
            _this.TrataErroSaveIndexedDB(_this.Titulo_Modal, tableName, e);
        }
    }
    , SaveIndexedDBGRD_Pacote: function (poJSON, indice, total) {
        var _this = oAluno;
        try {
            oUtil.UpdateProgressBar(81);                        
            var nextTable = dbControl.GRD_Pacote_Products.Name;
            if (total == 0) {
                _this.SaveIndexedDBGRD_Pacote_Products(poJSON, 0, poJSON[nextTable].length);
                return;
            }            
            var tableName = dbControl.GRD_Pacote.Name;            
            dbControl.DeleteAllRows(tableName, function (result) {                
                if (!_this.TrataRetExecIndexDB(result, "DeleteAllRows", tableName, _this.Titulo_Modal)) {
                    return;
                }
                dbControl.InsertArray(tableName, poJSON[tableName], function (result) {                    
                    if (!_this.TrataRetExecIndexDB(result, "InsertArray", tableName, _this.Titulo_Modal)) {
                        return;
                    }
                    _this.SaveIndexedDBGRD_Pacote_Products(poJSON, 0, poJSON[nextTable].length);                    
                });
            });
        } catch (e) {
            _this.TrataErroSaveIndexedDB(_this.Titulo_Modal, tableName, e);
        }
    }
    , SaveIndexedDBGRD_Pacote_Products: function (poJSON, indice, total) {
        var _this = oAluno;
        try {
            oUtil.UpdateProgressBar(89.5);
            var nextTable = dbControl.GRD_Turma_Pacote.Name;
            if (total == 0) {
                _this.SaveIndexedDBGRD_Turma_Pacote(poJSON, 0, poJSON[nextTable].length)
                return;
            }
            var tableName = dbControl.GRD_Pacote_Products.Name;
            dbControl.DeleteAllRows(tableName, function (result) {
                if (!_this.TrataRetExecIndexDB(result, "DeleteAllRows", tableName, _this.Titulo_Modal)) {
                    return;
                }
                dbControl.InsertArray(tableName, poJSON[tableName], function (result) {
                    if (!_this.TrataRetExecIndexDB(result, "InsertArray", tableName, _this.Titulo_Modal)) {
                        return;
                    }
                    _this.SaveIndexedDBGRD_Turma_Pacote(poJSON, 0, poJSON[nextTable].length);
                });
            });
        } catch (e) {
            _this.TrataErroSaveIndexedDB(_this.Titulo_Modal, tableName, e);
        }
    }
    , SaveIndexedDBGRD_Turma_Pacote: function (poJSON, indice, total) {
        var _this = oAluno;
        try {
            oUtil.UpdateProgressBar(93);
            var nextTable = dbControl.GRD_Aluno_Pacote.Name;
            if (total == 0) {                
                _this.SaveIndexedDBGRD_Aluno_Pacote(poJSON, 0, poJSON[nextTable].length)
                return;
            }
            var tableName = dbControl.GRD_Turma_Pacote.Name;
            dbControl.DeleteAllRows(tableName, function (result) {
                if (!_this.TrataRetExecIndexDB(result, "DeleteAllRows", tableName, _this.Titulo_Modal)) {
                    return;
                }
                dbControl.InsertArray(tableName, poJSON[tableName], function (result) {
                    if (!_this.TrataRetExecIndexDB(result, "InsertArray", tableName, _this.Titulo_Modal)) {
                        return;
                    }                    
                    _this.SaveIndexedDBGRD_Aluno_Pacote(poJSON, 0, poJSON[nextTable].length);
                });
            });
        } catch (e) {
            _this.TrataErroSaveIndexedDB(_this.Titulo_Modal, tableName, e);
        }
    }
    , SaveIndexedDBGRD_Aluno_Pacote: function (poJSON, indice, total) {
        var _this = oAluno;
        try {
            oUtil.UpdateProgressBar(95);            
            if (total == 0) {                
                _this.CompleteSaveIndexedDB(_this.Titulo_Modal);
                return;
            }
            var tableName = dbControl.GRD_Aluno_Pacote.Name;
            dbControl.DeleteAllRows(tableName, function (result) {
                if (!_this.TrataRetExecIndexDB(result, "DeleteAllRows", tableName, _this.Titulo_Modal)) {
                    return;
                }
                dbControl.InsertArray(tableName, poJSON[tableName], function (result) {
                    if (!_this.TrataRetExecIndexDB(result, "InsertArray", tableName, _this.Titulo_Modal)) {
                        return;
                    }                    
                    _this.CompleteSaveIndexedDB(_this.Titulo_Modal);
                });
            });
        } catch (e) {
            _this.TrataErroSaveIndexedDB(_this.Titulo_Modal, tableName, e);
        }
    }
    
    , TrataErroSaveIndexedDB: function (Titulo_Modal, tableName, acao, erro) {        
        oUtil.ShowModalGeral(Titulo_Modal, "Erro ao sincronizar os dados " + tableName + " erro: " + erro);
    }
    , TrataRetExecIndexDB: function (result, acao, tableName, Titulo_Modal) {
        var ok = !(result == null || result == false);
        if (ok == false) {            
            oUtil.ShowModalGeral(Titulo_Modal, "Erro " + tableName + " (" + acao + ")");
        }
        return ok;
    }
    , VerifyIfUserIsSynced: function () {
        var _this = oAluno;
        if (_this.indexDBON == false) {
            //oUtil.ShowProgress(false);
            oUtil.ShowLoader(false);
            return;
        }        
        var tableName = dbControl.v_GRD_ListaAlunos.Name;
        dbControl.SelectALL(tableName, function (result) {
            if (result != null && result.length > 0) {
                var user = oOffline.getCookie(oAluno.cookie_user_name);
                user = JSON.parse(user);
                for (var i = 0; i < result.length; i++) {
                    var obj = result[i];                    
                    if (obj.UserIDvENDEDOR == user.User_ID && obj.BrandID == user.Brand_ID) {                        
                        _this.jqThis.find($("#btn-sync-" + obj.AlunoTurmaID))
                            .removeClass("CustomButtom")
                            .addClass("CustomButtomSync")
                            .text("SINCRONIZADO");

                        _this.ListSinc[obj.AlunoTurmaID] = "SINCRONIZADO";
                    }
                }
            }
            //oUtil.ShowProgress(false);
            oUtil.ShowLoader(false);
        });
    }
    , CompleteSaveIndexedDB: function (Titulo_Modal) {        
        var _this = this;
        oUtil.UpdateProgressBar(100);        
        oUtil.ShowModalGeral("<i class='material-icons ico-done'>done</i> " + Titulo_Modal, "Dados sincronizados com sucesso");
        _this.VerifyIfUserIsSynced();
    }
    , BtnDetalhes: function (value, row) {

        var onClick = "onclick=\"javascript:oAluno.ShowPop('" + row.NomeAluno + "','" + row.NomeTurma + "','" + row.EnderecoAluno + "','" + row.TelefoneAluno + "')\"";

        var html = "<div class='boxDetalhes'>" +
                        "<div class='dvLnk'>" +
                            "<a href='#'" + onClick + "><span class='glyphicon glyphicon-zoom-in' aria-hidden='true'></span></a></div>" +
                        "<div class='dvBoxConteudo'><div class='dvNome'><span class='spNome'>" + value + " </span></div><div class='dvDetalhes'>Ver Detalhes</div> " +
                        "<div class='clear'></div>" +
                    "</div>";


        return html;

    }
    , ShowPop: function (nome, turma, endereco, telefone) {

        var _this = this;
        var Div = $('.div-modal-geral');

        var texto = "<table class='tabelaDetalhes'><tr><th>NOME</td><td>" + nome + "</td></tr>" +
                    "<tr><th>TURMA</td><td>" + turma + "</td></tr>" +
                    "<tr><th>ENDEREÇO</td><td>" + endereco + "</td></tr>" +
                    "<tr><th>TELEFONE</td><td>" + telefone + "</td></tr>" +
                    "</table>"

        Div.find('.modal-body').html(texto);

        oUtil.ShowLoader(false);
        oUtil.ShowProgress(false);
        Div.modal();

        
    }
    , WindowResize: function () {

        var w = $(window).width();
        var _this = this;
        
        if (w <= 1100) {
            _this.jqThis.find(_this.bootstrap_table + "[data-field='QtdFotos']").attr("data-visible", "false");
        }
        else {
            _this.jqThis.find(_this.bootstrap_table + "[data-field='QtdFotos']").attr("data-visible", "true");
        }

    }

    //Métodos - Fim    
}

jQuery(document).ready(function () {
    oUtil.ShowLoader(true);    
    oAluno.Carregar(ListStatus, cookie_user_name);    
});

dbControl.CallbackOpenOnSuccess = function () {    
    oAluno.indexDBON = true;
    jQuery(document).ready(function () {
        oAluno.VerifyIfUserIsSynced();
    });
}