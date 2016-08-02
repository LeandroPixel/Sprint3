var oAlunoOffline = {
    //Objetos - Início
    jqThis: null    
    //Objetos - Fim

    //Eventos - Início
	, evento_click: 'click'
    //Eventos - Fim

    //Seletores - Início
	, seletor_geral: '.conteudo-geral'
    , bootstrap_table: '#table-alunos-list'
    //Seletores - Fim

    //variaveis        
    , url_view_photos: (oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao) + "/Offline/Produtos"
    , cookie_user_name: cookie_user_name
    , AlunoTurmaID: 0
    

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
	}        
    , BtnVisualizarFotos: function (value, row) {        
        var _this = oAlunoOffline;
        var id = "lnkGotoProducts" + row.AlunoTurmaID + "_" + row.BrandID;

        var data_values = "data-aluno_turma_id='" + row.AlunoTurmaID + "' data-user_id_vendedor='" + row.UserIDvENDEDOR + "' ";
        data_values += "data-aluno_id = '" + row.AlunoID + "' data-turma_id = '" + row.TurmaID + "' data-album_id='" + row.AlbumID + "'";
        data_values += "data-AlunoTurmaID_Cript = '" + row.AlbumID_Cript + "' data-nome_aluno = '" + row.NomeAluno + "' data-nome_turma = '" + row.NomeTurma + "'";

        return "<a onclick='oAlunoOffline.ShowProducts(\"" + id + "\")' id='" + id + "' " + data_values + " href='#' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored fontSizeOpt'>Projetos</a>";
    }
    , BtnRemoverAluno: function (value, row) {                     
        var html = "<div onclick='oAlunoOffline.ShowModalRemove(" + row.AlunoTurmaID + ")'>" +
                    //"  <i class='material-icons'>delete_forever</i> " +
                    "  <div class='btnRemover'></div> " +
                    "</div>";
        return html;        
    }
    , ShowModalRemove: function (AlunoTurmaID) {
        var _this = this;
        var modal = $("#div-remove-usuario");
        modal.find(".btn-ok").unbind(_this.evento_click);        
        modal.find(".btn-ok").on(_this.evento_click, function (evento) { _this.removeAlunoIndexDb(AlunoTurmaID); modal.modal('hide'); });
        modal.modal();        
    }
    , removeAlunoIndexDb: function (AlunoTurmaID) {
        var _this = this;        
        oUtil.ShowLoader(true);
        //_this.AlunoTurmaID = AlunoTurmaID;
        oUtil.DeleteInfoIndexDB(AlunoTurmaID, _this.removeAlunoOk);
    }
    , removeAlunoOk: function (AlunoTurmaID) {
        var _this = oAlunoOffline;
        _this.LoadAlunosIndexDB(true);        
        oUtil.ShowModalGeral("<i class='material-icons ico-done'>done</i> Remover Aluno sincronizado", "Aluno removido com sucesso");
        //var bootstrapTable = $(_this.bootstrap_table);
        //console.log(bootstrapTable);
        //console.log("_this.AlunoTurmaID = "+_this.AlunoTurmaID);
        //bootstrapTable.bootstrapTable('removeByUniqueId', _this.AlunoTurmaID);
    }
    , GetAlunosFromVendedor: function (data) {
        var _this = oAlunoOffline;
        var alunos = [];
        var total = data.length;
        var user = oOffline.getCookie(_this.cookie_user_name);
        user = JSON.parse(user);
        for (var i = 0; i < total; i++) {
            var obj = data[i];   
            if (obj.UserIDvENDEDOR == user.User_ID && obj.BrandID == user.Brand_ID) {                
                alunos.push(obj);
            }
        }
        return alunos;
    }
    , LoadAlunosIndexDB: function (reload) {
        if (reload == undefined) {
            reload = false;
        }
        var tableName = dbControl.v_GRD_ListaAlunos.Name;
        dbControl.SelectALL(tableName, function (result) {            
            var bootstrapTable = $(oAlunoOffline.bootstrap_table);
            var dados_aux = oAlunoOffline.GetAlunosFromVendedor(result);
            //bootstrapTable.bootstrapTable('removeAll');
            if (reload) {
                bootstrapTable.bootstrapTable('load', dados_aux);
            } else {
                bootstrapTable.bootstrapTable({ data: dados_aux });
            }
            //('load', randomData());

            //for (var i = 0; i < dados_aux.length; i++) {
            //    var id = "#lnkGotoProducts" + dados_aux[i].AlunoTurmaID + "_" + dados_aux[i].BrandID;

            //    $(id).bind("click", function (e) {
 
            //    });
            //}
        });
    }    

    , BtnDetalhes: function (value, row) {

        var onClick = "onclick=\"javascript:oAlunoOffline.ShowPop('" + row.NomeAluno + "','" + row.NomeTurma + "','" + row.EnderecoAluno + "','" + row.TelefoneAluno + "')\"";

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
    , ShowProducts: function (obj) {

        var aux = $("#" + obj);

        var aluno_turma_id = $(aux).closest("a").attr("data-aluno_turma_id");
        var user_id_vendedor = $(aux).closest("a").attr("data-user_id_vendedor");

        var aluno_id = $(aux).closest("a").attr("data-aluno_id");
        var turma_id = $(aux).closest("a").attr("data-turma_id");
        var album_id = $(aux).closest("a").attr("data-album_id");
        var alunoTurmaID_Cript = $(aux).closest("a").attr("data-AlunoTurmaID_Cript");
        var nome_aluno = $(aux).closest("a").attr("data-nome_aluno");
        var nome_turma = $(aux).closest("a").attr("data-nome_turma");

        //dbControl.DeleteAllRows(dbControl.vendedor_turma_aluno.Name, function () { });
        //dbControl.Insert(dbControl.vendedor_turma_aluno.Name, { ID: user_id_vendedor, AlunoTurmaID: aluno_turma_id, UserIdVendedor: user_id_vendedor }, function () { window.location = oAlunoOffline.url_view_photos; });
        var dados = {
            ID: user_id_vendedor,
            AlunoTurmaID: aluno_turma_id,
            UserIdVendedor: user_id_vendedor,
            AlunoID: aluno_id,
            TurmaID: turma_id,
            AlbumID: album_id,
            AlunoTurmaID_Cript: alunoTurmaID_Cript,
            NomeAluno: nome_aluno,
            NomeTurma: nome_turma,
            Origem: "OFFLINE"
        };
        sessionStorage.setItem("config_turma_aluno", JSON.stringify(dados));
        window.location = oAlunoOffline.url_view_photos;

    }
    //Métodos - Fim    
}

oOffline.verifyAcesso();

$.fn.bootstrapTable.locales['pt-BR'] = {
    formatNoMatches: function () {
        return 'Você não possui nenhum aluno sincronizado no modo off-line';
    }
}

jQuery(document).ready(function () {
    oAlunoOffline.Carregar();    
});

dbControl.CallbackOpenOnSuccess = function () {
    oAlunoOffline.LoadAlunosIndexDB();
}