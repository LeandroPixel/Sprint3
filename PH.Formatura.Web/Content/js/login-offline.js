var oLoginOffline = {
	//Objetos - Início
    jqThis: null
    , userOBJ: null
    , intervalVerifyOnline : null
	//Objetos - Fim

	//Strings - Início
	, string_url_base_aplicacao: oGeral.string_url_base_aplicacao || oInicial.BaseUrlAplicacao	
    , cookie_user_name: ""
    , string_informe_login_senha: 'Informe seu login e sua senha'
	, string_informe_login: 'Informe seu login'
	, string_informe_senha: 'Informe sua senha'
	//Strings - Fim

	//Eventos - Início
	, evento_click: 'click'
	, evento_load: 'load'
    , evento_keyup: 'keyup'
	//Eventos - Fim

	//Seletores - Início
	, seletor_geral: '.conteudo-login'
    , seletor_btn_entrar_nao_ativo: ".btn-entrar-offline"
    , seletor_tbx_login: '.tbx-login-offline'
	, seletor_tbx_password: '.tbx-password-offline'
	, seletor_span_erro_login: '.alert-danger-off'
	//Seletores - Fim

	//Métodos - Início
	, Carregar: function (cookie_user_name) {
		var _this = this;
        
		_this.jqThis = jQuery(_this.seletor_geral);

		_this.cookie_user_name = cookie_user_name;

		if (_this.jqThis.length) {
			_this.CarregarEventos();
		}
	}
	, CarregarEventos: function () {
		var _this = this;

		_this.jqThis
			.on(_this.evento_click, _this.seletor_btn_entrar_nao_ativo, function () { _this.ValidarLogin(); })
            .on(_this.evento_keyup, _this.seletor_tbx_login + ',' + _this.seletor_tbx_password, function (evento) { _this.LoginTratarKeyUp(evento); })
		;
	}
    , LoginTratarKeyUp: function (evento) {
        var _this = this;

        (evento.keyCode == 13) ? jQuery(_this.seletor_btn_entrar_nao_ativo).focus().trigger(_this.evento_click) : 0;
    }
    , ValidarLogin: function () {
        var _this = this;
        var objJq = _this.jqThis;
        var Erro = false;
        var Mensagem = '';
        objJq.find(_this.seletor_span_erro_login).hide();
        var Login = objJq.find(_this.seletor_tbx_login);
        var Password = objJq.find(_this.seletor_tbx_password);

        if (!Erro && Login.val().trim().length == 0 && Password.val().trim().length == 0) { Mensagem = _this.string_informe_login_senha; Login.focus(); Erro = true; }
        if (!Erro && Login.val().trim().length == 0) { Mensagem = _this.string_informe_login; Login.focus(); Erro = true; }
        if (!Erro && Password.val().trim().length == 0) { Mensagem = _this.string_informe_senha; Password.focus(); Erro = true; }

        if (Erro) {
            objJq.find(_this.seletor_span_erro_login).slideUp('fast', function () {
                $(this).text(Mensagem).slideDown('fast');
            });
            return;
        }
        _this.ValidaLoginByCookie(Login.val(), Password.val());
    }
    , ValidaLoginByCookie: function (Login, Password) {
        var _this = this;                
        if (_this.userOBJ.Senha.toUpperCase() != hex_md5(Password).toUpperCase() || _this.userOBJ.Email != Login) {
            _this.jqThis.find(_this.seletor_span_erro_login).slideUp('fast', function () {
                $(this).text("Login ou senha inválidos").slideDown('fast');
            });
            return;
        }
        var obj = JSON.stringify({ Senha: hex_md5(Password).toUpperCase(), Email: Login });
        oOffline.setCookie(oOffline.cookie_offline_name, obj, 1);
        //setTimeout("document.location.href = '" + baseUrl + "/Offline/Alunos'", 10000);
        document.location.href = oOffline.default_page_logged; //"'" + baseUrl + "/Offline/Alunos'";
        //console.log("OK prosseguir com o login");
    }
    ,verifyOnline2 : function (){       
        var _this = this;
        var objJq = _this.jqThis;
        var online = false;        
        //var obj = $('#status_network').find(".network_on");
        //if (obj.is(':visible') == true) {
        //    online = true;
        //}

        online = oOffline.CheckNetConnection();
        oOffline.UpdateImage(online);
        //if (oOffline.verifyUserLogged()) {
        //    return false;
        //}
        //console.log("online = " + online);        
        if (online == false) {
            var user = oOffline.getCookie(_this.cookie_user_name);
            if (user != "" && user != null && user != undefined) {
                if (oOffline.verifyUserLogged()) {
                    document.location.href = oOffline.default_page_logged;
                }
                _this.userOBJ = JSON.parse(user);
                objJq.find(_this.seletor_btn_entrar_nao_ativo).prop('disabled', false);
                objJq.find(_this.seletor_tbx_login).prop('disabled', true);
                objJq.find(_this.seletor_tbx_password).prop('disabled', false);
                var objValLogin = _this.jqThis.find(".tbx-login-offline").val();
                if (objValLogin == "") {
                    objJq.find(".tbx-login-offline").val(_this.userOBJ.Email);
                }                
            } else {
                objJq.find(_this.seletor_tbx_login).prop('disabled', true);
                objJq.find(_this.seletor_tbx_password).prop('disabled', true);
                objJq.find(_this.seletor_btn_entrar_nao_ativo).prop('disabled', true);
                objJq.find(_this.seletor_span_erro_login).html("<i class='material-icons ico-error'>error</i> Não é possível fazer o login offline.<BR>Não foram encontradas informações do último login.");
                objJq.find(_this.seletor_span_erro_login).show();
            }
            objJq.find(".login-modal").addClass("hidden");
            objJq.find(".login-modal-offline").removeClass("hidden");
        } else {                                                   
            objJq.find(".login-modal").removeClass("hidden");
            objJq.find(".login-modal-offline").addClass("hidden");
        }
    }    
	//Métodos - Fim
}

$(document).ready(function () {
    oLoginOffline.Carregar(cookie_user_name);
    oLoginOffline.verifyOnline2();
    oLoginOffline.intervalVerifyOnline = setInterval('oLoginOffline.verifyOnline2()', 5000);
});