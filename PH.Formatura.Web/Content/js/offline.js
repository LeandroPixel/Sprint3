var oOffline = {
    cookie_offline_name: ""//"Login"
    , default_page_logged: ""//"/Offline/Alunos"
	, string_url_base_aplicacao: oInicial.BaseUrlAplicacao
	, string_url_api_tools_ping: '/api/Tools/ping'
    , intervalVerifyOnline: null
    , logout_online : ""

    , url_vefiry_User_is_logged: ""
    , timeToVerifyOffline: 60000
    , cookie_validacao_fotos: "offline_validacaoFotos"

	, string_ChaveSessionStorageDadosConclusao: 'dados_conclusao_pedido'

	, CallbackVerifyOnline: undefined //TODO: Comentário

    , Carregar: function (default_page_logged_offline, url_vefiryUserIsLogged, cookie_offline_name, logout_online) {
    	var _this = oOffline;
        _this.default_page_logged = default_page_logged_offline;
        _this.url_vefiry_User_is_logged = url_vefiryUserIsLogged;

        _this.string_url_api_tools_ping = _this.string_url_base_aplicacao + _this.string_url_api_tools_ping;

        _this.cookie_offline_name = cookie_offline_name;
        _this.logout_online = logout_online;
        
    }

    , CheckNetConnection: function () {
    	var _this = oOffline;
    	var re = false;
    	try {
    		$.ajax({
    			type: 'GET'
				, url: _this.string_url_api_tools_ping
				, async: false
    		})
				.done(function () {
    				re = true;
    			})
				.fail(function () {
					re = false;
				})
    		;
    	} catch (e) {
    	}
        return re;
    }
    , VerifyUpdateCacheOffLine: function () {
    	var _this = oOffline;
        // Crio variavel do objeto cache
        var appCache = window.applicationCache;
        
        window.addEventListener('load', function (e) {
            
            // Verifico evento de atualização de cache
            appCache.addEventListener('updateready', function (e) {
                // Se tiver atualização cache
                if (appCache.status == appCache.UPDATEREADY) {
                    try {
                        //oUtil.ShowProgress(true);                        
                        appCache.swapCache();                        
                        window.location.reload();
                    } catch (e) {
                        _this.ReloadPopCache();
                        //window.location.reload();
                    }
                    // Se confirmar janela navegador, recarrega página
                    //if (confirm('Existem atualizações para este site. Deseja carregar as atualizações?')) {                    

                    //} else {
                    //    alert('Você optou por usar arquivos desatualizados neste site.');
                    //}
                } else {
                    oUtil.ShowProgress(true);
                }
            }, false);

            // Verifico o evento carregamento da pagina
            //appCache.addEventListener('checking', function (e) {
            //    //oUtil.ShowProgress(true);
            //    //console.log("checking");
            //}, false);
            appCache.addEventListener('downloading', function (e) {
                oUtil.ShowProgress(true);
                //console.log("downloading");
            }, false);
            appCache.addEventListener('error', function (e) {
                oUtil.ShowProgress(false);
                var _this = oOffline
                _this.ReloadPopCache();
            }, false);
            appCache.addEventListener('cached', function (e) {
                oUtil.ShowProgress(false);
            }, false);
            appCache.addEventListener('progress', function (e) {
                if (e.lengthComputable) {
                    document.querySelector('#progressBar').MaterialProgress.setProgress(e.loaded / e.total * 100);
                    //console.log(Math.round(e.loaded / e.total * 100) + '%');
                }
            }, false);
        }, false);
    }
    , ReloadPopCache: function () {
        oUtil.ShowProgress(false);
        oUtil.ShowLoader(false);
        var modal = $("#div-update-cache");
        modal.find(".btn-ok").unbind("click");
        modal.find(".btn-ok").on("click", function (evento) { window.location.reload(); return false; });
        modal.modal();        
    }
    , verifyOnline: function () {
    	var _this = oOffline;
        var online = oOffline.CheckNetConnection();
        //console.log("online = " + online);
        _this.UpdateImage(online);
        if (oOffline.CallbackVerifyOnline != undefined) {
            oOffline.CallbackVerifyOnline(online);
        }
    }
    , UpdateImage: function (online) {
        var obj = $('#status_network');
        if (online == true) {
            obj.find(".network_on").removeClass("hidden");
            obj.find(".network_off").addClass("hidden");
        } else {
            obj.find(".network_on").addClass("hidden");
            obj.find(".network_off").removeClass("hidden");
        }
    }
    , getCookie: function (cname) {           
        return $.cookie(cname);
    }
    , setCookie: function (cname, cvalue, expDays) {        
        $.cookie(cname, cvalue, { expires: expDays }, { path: "/" });
    }
    , deleteCookie: function (name) {        
        $.removeCookie(name);
        $.removeCookie(name, { path: '' });
        $.removeCookie(name, { path: '/' });
        $.removeCookie(name, { path: oInicial.BaseUrlAplicacao });        
    }
    , verifyUserLogged: function () {
    	var _this = oOffline;
        cookieLogin = _this.getCookie(_this.cookie_offline_name);        
        return (cookieLogin != "" && cookieLogin != undefined);
    }
    , verifyAcesso: function () {
    	var _this = oOffline;

        if (oUtil.GetToken().AuthToken == "") {
        	var user = _this.getCookie(cookie_user_name);
            user = JSON.parse(user);
            token = user.Token;
        }

        
        if (!_this.verifyUserLogged()) {            
        	if (!_this.vefiryUserIsLogged()) {
        		var redirect = true;
        		if ((/\/Checkout\/Confirm/).test(location.pathname)) {        		
        			var oDadosConclusao = null;
        			try {
        				oDadosConclusao = JSON.parse(window.sessionStorage.getItem(_this.string_ChaveSessionStorageDadosConclusao));
        			} catch (e) {
        				oDadosConclusao = null;
        			}

        			if (oDadosConclusao != null) {
        				redirect = false;
        			}
        		}

        		if (redirect) document.location.href = oInicial.BaseUrlAplicacao + '/';
            }
        }
    }
    , vefiryUserIsLogged: function () {
    	var _this = oOffline;
    	var IsLogged = false;

    	try {
			$.ajax({
				url: _this.url_vefiry_User_is_logged,
				async: false,
				type: 'POST',
			})
				.done(function (poJSON, textStatus) {
					IsLogged = poJSON.IsLogged == undefined ? true : poJSON.IsLogged;
				})
				.fail(function (jqXHR, textStatus) {
					IsLogged = false;
				})
				.always(function (jqXHR, textStatus) {
					//loading
				})
    		;
    	} catch (e) {
    	}

        return IsLogged;
    }
    , Logout: function () {
    	var _this = oOffline;
    	if (_this.vefiryUserIsLogged()) {
    	    //console.log("logout online");
    	    document.location.href = _this.logout_online;
    	} else {
    	    //console.log("logout offline");
    	    oOffline.deleteCookie(oOffline.cookie_offline_name);
    	    document.location.href = baseUrl + oInicial.BaseUrlAplicacao + '/';            
        }
    }
    , RedirectUrlONorOFF: function (urlOn,urlOff) {
    	var _this = oOffline;
        if (_this.CheckNetConnection()) {
            document.location.href = urlOn;
        } else {
            document.location.href = urlOff;
        }        
    }
}

oOffline.Carregar(default_page_logged_offline, url_vefiryUserIsLogged, cookie_offline_name, logout_online);

jQuery(document).ready(function () {
    oOffline.VerifyUpdateCacheOffLine();
    oOffline.verifyOnline();
    oOffline.intervalVerifyOnline = setInterval(oOffline.verifyOnline, oOffline.timeToVerifyOffline);
});