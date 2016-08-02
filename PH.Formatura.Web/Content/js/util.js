String.prototype.toFixedWithoutRound = function (casas) {
	return parseFloat((Math.floor(parseFloat(this) * (Math.pow(10, casas))) / (Math.pow(10, casas))).toFixed(parseInt(casas)));
}

Number.prototype.toFixedWithoutRound = function (casas) {
	return parseFloat((Math.floor(parseFloat(this) * (Math.pow(10, casas))) / (Math.pow(10, casas))).toFixed(parseInt(casas)));
}
var oUtil = {
	jqThis: null

	, ValidarBloqueadorDePublicidade: function () {
		var _this = this;

		try {
			_this.jqThis.find('head').append('<script type="text/javascript" src="../content/js/advertisement.js" ></script>');

			if (!_this.jqThis.find('#teste-de-bloqueador-de-publicidade').length) {
				alert('Desative a extensão que bloqueia anúncios (adBlok, uBlok, adShield) para acessar o site sem erros');
			} else {
				_this.jqThis.find('#teste-de-bloqueador-de-publicidade').remove();
			}

			_this.jqThis.find('script[src="../content/js/advertisement.js"]').remove();
		} catch (e) {
			console.log(e.message);
		}
	}
	, toReal: function (Valor) {
		return (Valor.toFixedWithoutRound(2)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', 'R$ ');
	}
	, RefactorMDL_JS: function () {
		if ('classList' in document.createElement('div') && 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach) {
			document.documentElement.classList.add('mdl-js');
			componentHandler.upgradeAllRegistered();
		} else {
			componentHandler.upgradeElement = function () { };
			componentHandler.register = function () { };
		}
	}
	, SetCookie: function (cname, cvalue, exdays) {
		var _this = this;

		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = 'expires=' + d.toUTCString();
		document.cookie = cname + '=' + cvalue + '; ' + expires + '; domain=' + location.hostname + '; path=/';

	}
	, GetCookie: function (cname) {
		var _this = this;

		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
		}
		return "";
	}
	, RetornarSemana: function (Data) {
		var _this = this;
		var Semana;

		return (Data) ? new Date(Data).getWeek() : new Date().getWeek();
	}
	, Url_Parametro: function (sParemetro) {
		var _this = this;

		var paremetros = window.location.search.substr(1).split('&');

		for (var i = 0; i < paremetros.length; i++) {
			var p = paremetros[i].split('=');
			if (p[0] == sParemetro) {
				return decodeURIComponent(p[1]);
			}
		}
		return false;
	}, ShowLoader: function (b) {
		var _this = this;
		if (b == true) {
			//console.log("show");
			$(".mdl-spinner").addClass("is-active");
			$(".fader-loader").removeClass('hidden');
		} else {
			//console.log("hide");
			$(".mdl-spinner").removeClass("is-active");
			$(".fader-loader").addClass('hidden');
		}
	}, ShowLoaderWithCallback: function (b, callback, params) {
		var _this = this;
		if (b == true) {
			//console.log("show");
			$(".mdl-spinner").addClass("is-active");
			$(".fader-loader").removeClass('hidden');
		} else {
			//console.log("hide");
			$(".mdl-spinner").removeClass("is-active");
			$(".fader-loader").addClass('hidden');
		}
		callback(params);
	}
	, GetToken: function () {
		return { AuthType: "Token", AuthToken: token };
	}
    , ShowModalError: function (p_codError, p_MsgError, p_Data, titulo) {
        var _this = this;
    	var codError = p_codError;
    	var message = p_MsgError;
    	if (p_Data) {
    		var Erros = [];
    		var data;
    		var Redirect_Url;

    		if (p_Data.status == 401) {
    			Erros.push('Sua sessão expirou. Faça login novamente');
    			Redirect_Url = oInicial.BaseUrlAplicacao + '/User/Logout';
    		} else {
    			try {
    				data = JSON.parse(p_Data.responseText);
    			} catch (e) {
    			}

    			if (data && data.ModelState) {
    				for (var prop in data.ModelState) {
    					if (data.ModelState.hasOwnProperty(prop)) {
    						for (var i = 0; i < data.ModelState[prop].length; i++) {
    							Erros.push(data.ModelState[prop][i]);
    						}
    					}
    				}
    			}
    		}

    		if (Erros.length) {
    			oUtil.ShowModalGeral(titulo, Erros, Redirect_Url);
    			return;
    		} else {
    			if (data) {
    				codError = data.CodErro ? data.CodErro : "";
    				message = data.ExceptionMessage ? data.ExceptionMessage : (data.Mensagem ? data.Mensagem : data.Message);
    			} else {
    				codError = 0;
    				message = '';
    			}
    		}
    	}

    	var modal = $("#div-error-modal");
    	modal.find(".pCodError").show();
    	if (codError == "") {
    		modal.find(".pCodError").hide();
    	}
    	if (message == "") {
    		modal.find(".MsgErrorModal").html("Aconteceu um erro, favor tentar novamente.");
    	} else {
    		modal.find(".MsgErrorModal").html(message);
    	}
    	modal.find(".codErrorModal").html(codError);
    	_this.ShowLoader(false);
    	_this.ShowProgress(false);
    	modal.modal();
    }
    , ShowModalGeral: function (Title, vText, Redirect_Url) {
        var _this = this;
    	var Div = $('.div-modal-geral');

    	//Div.find('.modal-header .modal-title').empty();
    	//Div.find('.modal-body').empty();

    	var html = '<p>- {$texto}</p>';
    	var texto = '';

    	if (Title) { Div.find('.modal-header .modal-title').html(Title); }

    	if (vText && Array.isArray(vText)) {
    		for (var i = 0; i < vText.length; i++) {
    			texto += html.replace('{$texto}', vText[i] + (i != (vText.length - 1) ? ';' : '.'));
    		}
    		Div.find('.modal-body').html(texto);

    	} else if (vText && typeof (vText) == 'string') {
    		Div.find('.modal-body').html(html.replace('{$texto}', vText));
    	}
    	_this.ShowLoader(false);
    	_this.ShowProgress(false);
    	Div.modal();

    	if (Redirect_Url != undefined && Redirect_Url.length) {
    		Div.on('hide.bs.modal', function (e) {
    			e.preventDefault();
    			document.location.href = Redirect_Url;
    		});
    	}
    }
    , GetConfig : function(loader){
        return { configs: { loader: loader } };
    }
    , GetConfigAjaxBootstrapTable: function () {
        return { headers: oUtil.GetToken() };
    }
	, GetConfigDatePicker: function () {
		return {
			timepicker: false,
			minDate: 0,
			format: 'd/m/Y'
		};
	}
    , GetConfigDateTimePicker: function () {
    	return {
    		step: 30,
    		minDate: 0,
    		closeOnWithoutClick: true,
    		timepickerScrollbar: false,
    		scrollTime: false,
    		scrollInput: false,
    	    closeOnDateSelect: false
    	};
    }
    , FormatDate: function (date){
        var day = date.getDate();
        var monthIndex = date.getMonth() + 1;
        var year = date.getFullYear();
        return monthIndex + "-" + day + "-" + year;
    }
    , FormatDate2: function (date) {
        var _this = this;
        date = date.replace("T", " ");        
        var datejs = new Date(date);
        if (!oUtil.IsValidDate(datejs)) {
            datejs = new Date(date.replace(" ", "T"));
        }
        var day = datejs.getDate();
        var monthIndex = datejs.getMonth() + 1;
        var year = datejs.getFullYear();
        var hours = datejs.getHours();
        var minutes = datejs.getMinutes();
        if (day < 10) {
            day = "0" + day;
        }
        if (monthIndex < 10) {
            monthIndex = "0" + monthIndex;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }        
        return year + "/" + monthIndex + "/" + day + " " + hours + ":" + minutes;
    }
    , FormatDate3: function (date) {        
        var datejs = date;
        var day = datejs.getDate();
        var monthIndex = datejs.getMonth() + 1;
        var year = datejs.getFullYear();
        var hours = datejs.getHours();
        var minutes = datejs.getMinutes();
        if (day < 10) {
            day = "0" + day;
        }
        if (monthIndex < 10) {
            monthIndex = "0" + monthIndex;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return year + "-" + monthIndex + "-" + day + " " + hours + ":" + minutes;
    }    
    , FormatDateNow: function () {
        var date = new Date()
        var day = date.getDate();
        var monthIndex = date.getMonth() + 1;
        var year = date.getFullYear();
        return year + "-" + monthIndex + "-" + day + " " + date.getHours() + ":" + date.getMinutes();
    }
	, ValidarCMC7: function (typedValue) {
		var _this = this;

		if (typedValue === undefined || typedValue === null) {
			return false;
		}
		typedValue = typedValue.replace(/\s/g, "");
		if (!typedValue) {
			return false;
		}

		var pieces = {
			firstPiece: typedValue.substr(0, 7)
		  , secondPiece: typedValue.substr(8, 10)
		  , thirdPiece: typedValue.substr(19, 10)
		};


		var digits = {
			firstDigit: parseInt(typedValue.substr(7, 1))
		  , secondDigit: parseInt(typedValue.substr(18, 1))
		  , thirdDigit: parseInt(typedValue.substr(29, 1))
		};

		var calculatedDigits = {
			firstDigit: _this.module10(pieces.firstPiece)
		  , secondDigit: _this.module10(pieces.secondPiece)
		  , thirdDigit: _this.module10(pieces.thirdPiece)
		};

		if ((calculatedDigits.secondDigit != digits.firstDigit)
		  || (calculatedDigits.firstDigit != digits.secondDigit)
		  || (calculatedDigits.thirdDigit != digits.thirdDigit)) {
			return false;
		}
		return true;
	}
    , module10: function (str) {
    	var _this = this;

    	if (str === undefined || str === null) {
    		return 0;
    	}
    	var size = str.length - 1;
    	var result = 0;
    	var weight = 2;

    	for (var i = size; i >= 0; i--) {
    		total = str.substr(i, 1) * weight;
    		if (total > 9) {
    			result = result + 1 + (total - 10);
    		} else {
    			result = result + total;
    		}
    		if (weight == 1) {
    			weight = 2;
    		} else {
    			weight = 1;
    		}
    	}
    	var dv = 10 - _this.mod(result, 10);
    	if (dv == 10) {
    		dv = 0;
    	}
    	return dv;
    }
    , mod: function (dividend, divisor) {
    	return Math.round(dividend - (Math.floor(dividend / divisor) * divisor));
    }

	, validarCPF: function (user_cpf) {
		var _this = this;
		var cpf = user_cpf;

   

		if (cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" ||
		   cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" ||
		   cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" ||
		   cpf == "88888888888" || cpf == "99999999999") {
			return false;
		}

		soma = 0;
		for (i = 0; i < 9; i++)
			soma += parseInt(cpf.charAt(i)) * (10 - i);

		resto = 11 - (soma % 11);

		if (resto == 10 || resto == 11)
			resto = 0;
		if (resto != parseInt(cpf.charAt(9))) {
			return false;
		}
		soma = 0;

		for (i = 0; i < 10; i++)
			soma += parseInt(cpf.charAt(i)) * (11 - i);

		resto = 11 - (soma % 11);

		if (resto == 10 || resto == 11)
			resto = 0;

		if (resto != parseInt(cpf.charAt(10))) {
			return false;
		}

		return true;
	}


	, validaCNPJ: function (cnpj) {
		var _this = this;
		var retorno = false;

		var digito1, digito2;

		var numerosPadroesCalculo = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
		var somatorio = 0;
		var resultadoDivisao = 0;


		if (cnpj) {
			cnpj = cnpj.trim();
			cnpj = cnpj.replace(".", "");
			cnpj = cnpj.replace("/", "");
			cnpj = cnpj.replace("-", "");

			if (cnpj.length == 14) {
				for (var i = 0; i < 12; i++) {
					var numero;
					if (!isNaN(cnpj.charAt(i))) { numero = Number(cnpj.charAt(i)); } else { numero = -1 }
					somatorio = somatorio + (numerosPadroesCalculo[i] * numero);
				}

				resultadoDivisao = parseInt(somatorio % 11);

				if (parseInt(resultadoDivisao) < 2) { digito1 = "0"; } else { digito1 = (11 - resultadoDivisao).toString(); }

				numerosPadroesCalculo = [6].concat(numerosPadroesCalculo);

				somatorio = 0;

				for (var i = 0; i < 13; i++) {
					var numero;
					if (!isNaN(cnpj.charAt(i))) { numero = Number(cnpj.charAt(i)); } else { numero = -1 }
					somatorio = somatorio + (numerosPadroesCalculo[i] * numero);
				}

				resultadoDivisao = parseInt(somatorio % 11);

				if (parseInt(resultadoDivisao) < 2) { digito2 = "0"; } else { digito2 = (11 - resultadoDivisao).toString(); }

				retorno = (cnpj.substr(12, 2) == digito1 + digito2);
			}
		}

		return retorno;
	}
	, RedirectPost: function (sUrl, oParametros, sMetodo) {
		metodo = sMetodo || 'post';
		var form = document.createElement('form');
		form.setAttribute('method', metodo);
		form.setAttribute('action', sUrl);

		if (oParametros) {
			for (var key in oParametros) {
				if (oParametros.hasOwnProperty(key)) {
					var hiddenField = document.createElement('input');
					hiddenField.setAttribute('type', 'hidden');
					hiddenField.setAttribute('name', key);
					hiddenField.setAttribute('value', oParametros[key]);
					form.appendChild(hiddenField);
				}
			}
		}
		document.body.appendChild(form);
		form.submit();
	}
	, ValidarTelefone: function (Telefone) {
		var String_Telefone = Telefone.trim();
		var DDDsValidos = [
			'11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
			'21', '22', '24', // RJ
			'27', '28', // ES
			'31', '32', '33', '34', '35', '37', '38', // MG
			'41', '42', '43', '44', '45', '46', // PR
			'47', '48', '49', // SC
			'51', '53', '54', '55', // RS
			'61', // DF e GO
			'62', '64', // GO
			'63', // TO
			'65', '66', // MT
			'67', // MS
			'68', // AC
			'69', // RO
			'71', '73', '74', '75', '77', // BA
			'79', // SE
			'81', '87', // PE
			'82', // AL
			'83', // PB
			'84', // RN
			'85', '88', // CE
			'86', '89', // PI
			'91', '93', '94', // PA
			'92', '97', // AM
			'95', // RR
			'96', // AP
			'98', '99' // MA
		];

		if (String_Telefone.length > 0) {
			if (String_Telefone.length >= 10 && !isNaN(String_Telefone)) {
				var DDD = String_Telefone.substr(0, 2);
				var Telefone = String_Telefone.substring(2, String_Telefone.length);
				//SE FOR UM DDD E TELEFONE VÁLIDOS
				if ($.inArray(DDD, DDDsValidos) > -1 && $.inArray(Telefone.substr(0, 1), ['0', '1']) == -1) {
					return true;
				}
			}
		}
		return false;
	}
	, ValidarDataDDMMAAAA: function (Data, Divisor) {
		if (Data.trim().length) {
			var vData = Data.split(Divisor || '/');
			var Dia = vData[0];
			var Mes = vData[1];
			var Ano = vData[2];

			if (Dia.length == 2 && Mes.length == 2 && Ano.length == 4 && !isNaN(parseInt(Number(Dia))) && !isNaN(parseInt(Number(Mes))) && !isNaN(parseInt(Number(Ano)))) {
				return true;
			}
		}
		return false;
	}
    , SortByString: function (result, ascending, name) {
        var aux = 1;
        if (ascending == true) {//sort string ascending
            aux = -1;
        }                
        result = result.sort(function (a, b) {
            var nameA = escape(a[name].toLowerCase());
            nameB = escape(b[name].toLowerCase());
            if (nameA < nameB) 
                return aux;
            if (nameA > nameB)
                return (aux) * -1;
            return 0 //default return value (no sorting)
        });
        return result;
    }
    , SortByInt: function (result, ascending, name) {        
        result = result.sort(function (a, b) {       
            if (ascending == true) {//sort string ascending
                return (a[name] - b[name]);
            } else {
                return (b[name] - a[name]);
            }            
        });        
        return result;
    }
    , GetDadosToDeleteByAluno: function (result, aluno_turma_id, dadosToDelete, tableName) {
        var _this = this;
        try {
            if (result != undefined || result != null || result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var obj = result[i];
                    if (obj.AlunoTurmaID.toString() == aluno_turma_id.toString()) {
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
    , DeleteInfoIndexDB: function (AlunoTurmaID, fcallback) {
        var _this = this;
        var objAluno = null;
        var dadosToDelete = [];
        var photoIds = [];        
        var tableName = dbControl.v_GRD_ListaAlunos.Name;
        var indexName = "AlunoTurmaID";
        var obj = {
            AlunoTurmaID: AlunoTurmaID
        }
        dbControl.DeleteByHintIndexComplex(tableName, indexName, obj, function (result) {
            if (!_this.TrataRetExecIndexDB(result, "DeleteByHintIndexComplex", tableName, _this.Titulo_Modal)) {
                return;
            }
            tableName = dbControl.GRD_CART_PRODUCT.Name;
            dbControl.DeleteByHintIndexComplex(tableName, indexName, obj, function (result) {
                if (!_this.TrataRetExecIndexDB(result, "DeleteByHintIndexComplex", tableName, _this.Titulo_Modal)) {
                    return;
                }

                tableName = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;
                dbControl.DeleteByHintIndexComplex(tableName, indexName, obj, function (result) {
                    if (!_this.TrataRetExecIndexDB(result, "DeleteByHintIndexComplex", tableName, _this.Titulo_Modal)) {
                        return;
                    }
                    tableName = dbControl.GRD_AlunoTurma_Photos.Name;                    
                    dbControl.SelectByHintIndexComplex(tableName, indexName, obj, function (result) {                        
                        if (!_this.TrataRetExecIndexDB(result, "SelectByHintIndexComplex", tableName, _this.Titulo_Modal)) {
                            return;
                        }
                        var photoIds = [];
                        for (var i = 0; i < result.length; i++) {
                            var foto = result[i];
                            photoIds.push(foto.PhotoID);
                        }                        
                        dbControl.DeleteByHintIndexComplex(tableName, indexName, obj, function (result) {
                            if (!_this.TrataRetExecIndexDB(result, "DeleteByHintIndexComplex", tableName, _this.Titulo_Modal)) {
                                return;
                            }
                            _this.DeletePhotosAlbumIndexDB(photoIds, photoIds.length, fcallback);
                        });
                    });
                });                
            });
        });        
    }
    , DeletePhotosAlbumIndexDB: function (photoIds, totalFotos, fcallback) {
        var _this = this;
        try {            
            var tableName = dbControl.Photos_Album.Name;
            if (totalFotos == 0) {
                fcallback();
                return;
            }
            
            for (var i = 0; i < totalFotos; i++) {
                dbControl.DeleteByIndex(tableName, photoIds[i], function (result, indice) {
                    if (result == false) {
                        oUtil.ShowModalError("", "Erro metodo: DeleteByIndex -> t:" + tableName + " -> erro " + e);
                        return;
                    }
                    if (result == true) {
                        if ((indice + 1) == totalFotos) {
                            fcallback();
                        }
                    }
                }, i);
            }                
            
        } catch (e) {
            oUtil.ShowModalError("", "Erro no metodo: DeletePhotosAlbumIndexDB erro " + e + " trace " + trace);
        }        
    }    
    , TrataRetExecIndexDB: function (result, acao, tableName, Titulo_Modal) {
        var ok = !(result == null || result == false);
        if (ok == false) {
            oUtil.ShowLoader(false);            
            oUtil.ShowModalGeral(Titulo_Modal, "Erro " + tableName + " (" + acao + ")");
        }
        return ok;
    }
    , ShowProgress: function (b, valor) {
        var _this = this;
        if (valor == undefined) {
            valor = 0;
        }
        document.querySelector('#progressBar').MaterialProgress.setProgress(valor);
        if (b == true) {
            //console.log("show");            
            $(".cont-progress-bar").find(".step").html("");
            $(".fader-progress-bar").removeClass('hidden');
        } else {
            //console.log("hide");            
            $(".cont-progress-bar").find(".step").html("");
            $(".fader-progress-bar").addClass('hidden');
        }
    }

    , AddStepProgress: function (stepAtual, stepTotal) {
        var _this = this;
        $(".cont-progress-bar").find(".step").html(stepAtual + " de " + stepTotal);
        _this.UpdateProgressBar(0);
    }
    , UpdateProgressBar: function (val) {        
        document.querySelector("#progressBar").MaterialProgress.setProgress(val);
    }
    , IsValidDate: function (d) {
        if (Object.prototype.toString.call(d) === "[object Date]") {
            // it is a date
            if (isNaN(d.getTime())) {  // d.valueOf() could also work
                // date is not valid
                return false;
            }
            else {
                // date is valid
                return true;
            }
        }
        else {
            return false;
            // not a date
        }
    }
    , IsValidEmail: function (email) {

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);

    }

    , ValidarCPF_CNPJ: function (cpf_cnpj) {
        var _this = this;

        return (_this.validarCPF(cpf_cnpj) || _this.validaCNPJ(cpf_cnpj));
    }
    , FormatDateYYYYMMDD: function (string_data) { // DD/MM/YYYY -> YYYY/MM/DD
        return string_data.substring(6, 10) + string_data.substring(2, 6) + string_data.substring(0, 2);
    }
}