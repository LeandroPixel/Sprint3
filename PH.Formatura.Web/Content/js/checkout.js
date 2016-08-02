var oCheckout = {
    //Objetos - Início
    jqThis: null
	, jqPedidoPgtoChequeQtdAtual: 0
	, jqDivModalAlteracaoEntrega: null
	, EmRequisicaoApiCEP: false
    , ListaProdutos: [] //Tabela de produtos
    , ListaProdIDs: [] // IDs dos produtos
    , ListaPrecos: [] // Lista de preço dos produtos]
    , ListaFotosProducts: [] //Lista de fotos por produto
    , OrigemOnlineOffline: "" //Origem dos dados ( ONLINE | OFFLINE )
    , FormaPgto: { Nome: "cartao-credito", Type: 1, Group: 2 } //Cartão de credito
    , OrderID: 0
	, vItensInfoPrimordiaisSessionStorage: ['config_turma_aluno']
	, objDadosPedido: null
    //Objetos - Fim

    //Strings - Início
    //, string_url_base_aplicacao: oInicial.BaseUrlAplicacao
	, string_url_api_get_address_by_cep: '/api/Checkout/GetAddressByCep'
    , string_url_api_get_address_aluno: '/api/Alunos/Detail'
    , string_url_alunos_online: '/Alunos'
	, string_url_alunos_offline: '/Offline/Alunos'
    , string_url_api_get_list_products: '/api/Checkout/GetListProducts'
    , string_url_api_save_cartproduct: '/api/Produtos/SaveCartProduct'
    , string_url_api_delete_cartproduct: '/api/Produtos/DeleteItemCartProduct'
    , string_url_selecao_fotos_online: '/Agendamento/ValidacaoFotos/?a='
    , string_url_selecao_fotos_offline: '/Offline/ValidacaoFotos'
    , string_url_api_get_lista_precos: '/api/Checkout/GetListProductsPrice'
    , string_url_api_register_order: '/api/Checkout/RegisterOrder'
    , string_url_confirm_page: '/Checkout/Confirm'
    , string_url_produtos_online: '/Produtos'
    , string_url_produtos_offline: '/Offline/Produtos'
    , string_url_checkout: '/Checkout'
	, string_class_is_invalid: 'is-invalid'
	, string_class_is_valid: 'is-valid'
	, string_is_dirty: 'is-dirty'
	, string_intervalo_animacao: 400
	, string_forma_pgto: 'forma-pgto'
	, string_replicar: 'replicar'
    , cookie_user_name: cookie_user_name
    , string_pgto_cartao: "cartao-credito"
    , string_pgto_boleto: "boleto"
    , string_pgto_cheque: "cheque"
    , string_pgto_dinheiro: "dinheiro"
	, string_validacaoconclusao_cpf_informado_invalido: 'O CPF informado é inválido'
	, string_validacaoconclusao_cnpj_informado_invalido: 'O CNPJ informado é inválido'
	, string_validacaoconclusao_cpf_cnpj_invalido: 'O documento (CPF/CNPJ) informado é inválido'
	, string_validacaoconclusao_cpf_cnpj_vazio: 'Informe um documento (CPF/CNPJ) para a emissão da nota fiscal'
	, string_validacaoconclusao_nenhum_produto_selecionado: 'Selecione ao menos 1(um) produto com quantidade maior que 0 (zero)'
	, string_validacaoconclusao_cartao_qtd_0: 'Selecione a quantidade de parcelas no cartão'
	, string_validacaoconclusao_cartao_numero_nao_informado: 'Informe o número do cartão de crédito'
	, string_validacaoconclusao_cartao_nome_nao_informado: 'Informe o nome impresso no cartão de crédito'
	, string_validacaoconclusao_cartao_validade_nao_informada: 'Informe a validade do cartão de crédito'
	, string_validacaoconclusao_cartao_validade_invalida: 'A validade do cartão de crédito é inválida'
	, string_validacaoconclusao_cartao_cvv_nao_informado: 'Informe o código de segurança do cartão de crédito'
	, string_validacaoconclusao_cartao_cvv_invalido: 'O código de segurança do cartão de crédito é inválido'
	, string_validacaoconclusao_cartao_offline: 'Pagamento com cartão de crédito não disponível offline'
	, string_validacaoconclusao_boleto_qtd_0: 'Selecione a quantidade de parcelas no boleto'
	, string_validacaoconclusao_cheque_qtd_parcelas_nao_selecionada: 'Selecione a quantidade de parcelas no cheque'
	, string_validacaoconclusao_cheque_cpf_invalido: 'O CPF informado na {$parcela}ª parcela do cheque é inválido'
	, string_validacaoconclusao_cheque_cpf_nao_informado: 'Informe um CPF para a {$parcela}ª parcela do cheque'
	, string_validacaoconclusao_cheque_valor_invalido: 'O valor informado na {$parcela}ª parcela do cheque é inválido'
	, string_validacaoconclusao_cheque_valor_nao_informado: 'Informe um valor para a {$parcela}ª parcela do cheque'
	, string_validacaoconclusao_cheque_telefone_invalido: 'O telefone informado na {$parcela}ª parcela do cheque é inválido'
	, string_validacaoconclusao_cheque_telefone_nao_informado: 'Informe um telefone para a {$parcela}ª parcela do cheque'
	, string_validacaoconclusao_cheque_vencimento_invalido: 'O vencimento informado na {$parcela}ª parcela do cheque é inválido'
	, string_validacaoconclusao_cheque_vencimento_nao_informado: 'Informe um vencimento para a {$parcela}ª parcela do cheque'
	, string_validacaoconclusao_cheque_emitente_nao_informado: 'Informe um emitente para a {$parcela}ª parcela do cheque'
	, string_validacaoconclusao_cheque_cmc7_invalido: 'O código CMC7 informado na {$parcela}ª parcela do cheque é inválido'
    , string_validacaoconclusao_cheque_cmc7_duplicado: 'O código CMC7 informado na {$parcela}ª parcela já existe em outra parcela'
	, string_validacaoconclusao_cheque_cmc7_nao_informado: 'Informe um código CMC7 para a {$parcela}ª parcela do cheque'
	, string_validacaoconclusao_cheque_somatorio_invalido: 'O somatório dos valores dos cheques não confere com o total da compra'
	, string_validacaoconclusao_dinheiro_check_nao_selecionado: 'Confirme o recebimento do dinheiro em espécie'
	, string_ChaveSessionStorageDadosConclusao: 'dados_conclusao_pedido'

    , string_validacao_comprador_cpf_cnpj: 'Informe o CPF/CNPJ do comprador'
    , string_validacao_comprador_endereco: 'Informe o endereço completo do comprador'
    , string_validacao_comprador_nome: 'Informe o nome do comprador'
    , string_validacao_comprador_email: 'Informe o email do comprador'

    //Strings - Fim

    //Eventos - Início
	, evento_click: 'click'
	, evento_change: 'change'
	, evento_keyup: 'keyup'
	, evento_keydown: 'keydown'
	, evento_blur: 'blur'
	, evento_focus: 'focus'
    //Eventos - Fim

    //Seletores - Início
	, seletor_geral: '.conteudo-geral'
	, seletor_radios_pedido_pgto_cartao_radio_cartao: '.radioDadosPedidoPgtoCartao'
	, seletor_radio_pedido_pgto_cartao_radio_cartao_1: '#radioDadosPedidoPgtoCartao1'
	, seletor_radio_pedido_pgto_cartao_radio_cartao_2: '#radioDadosPedidoPgtoCartao2'
	, seletor_div_pedido_pgto_cartao1: '.divDadosPedidoPgtoCartao1'
	, seletor_div_pedido_pgto_cartao2: '.divDadosPedidoPgtoCartao2'
	, seletor_ancora_pedido_forma_pgto: '.ancora-pedido-forma-pgto'
	, seletor_ancora_pedido_forma_pgto_ativo: '.ancora-pedido-forma-pgto.is-active'
	, seletor_select_pedido_pgto_cheque_qtd: '#dadosPedidoPgtoChequeQtd'
	, seletor_div_pedido_pgto_cheque: '#forma-pgto-tab-cheque'
	, seletor_div_pedido_pgto_cheque_child: '.divDadosPedidoPgtoCheque'
	, seletor_btn_alterar_endereco_entrega: '.btn-alterar-endereco-entrega'
	, seletor_div_modal_alteracao_entrega: '.div-modal-alteracao-entrega'
	, seletor_form_alteracao_endereco_entrega: '#form-alteracao-endereco-entrega'
	, seletor_input_alteracao_endereco_entrega_cep: '#form-alteracao-endereco-entrega .tbxCep'
	, seletor_btn_alteracao_endereco_entrega_nao_sei_meu_cep: '#form-alteracao-endereco-entrega .btn-alteracao-endereco-entrega-nao-sei-meu-cep'
	, seletor_input_alteracao_endereco_entrega_destinatario: '#form-alteracao-endereco-entrega .tbxDestinatario'
	, seletor_input_alteracao_endereco_entrega_logradouro: '#form-alteracao-endereco-entrega .tbxLogradouro'
	, seletor_input_alteracao_endereco_entrega_numero: '#form-alteracao-endereco-entrega .tbxNumero'
	, seletor_input_alteracao_endereco_entrega_complemento: '#form-alteracao-endereco-entrega .tbxComplemento'
	, seletor_input_alteracao_endereco_entrega_bairro: '#form-alteracao-endereco-entrega .tbxBairro'
	, seletor_input_alteracao_endereco_entrega_cidade: '#form-alteracao-endereco-entrega .tbxCidade'
	, seletor_select_alteracao_endereco_entrega_estado: '#form-alteracao-endereco-entrega .sbxEstado'
	, seletor_div_checkout_transacao_fade_offline: '#div-checkout-transacao-fade-offline'
	, seletor_dados_pedido_nfe_cpf_cnpj: '#dadosPedidoNfeCpfCnpj'
	, seletor_div_dados_pedido_nfe_cpf_cnpj: '.div-dados-pedido-nfe-cpf-cnpj'
	, seletor_btn_confirmar_alteracao_endereco_entrega: '.btn-confirmar-alteracao-endereco-entrega'
	, seletor_dados_pedido_endereco_destinatario: '.dados-pedido-endereco-destinatario'
	, seletor_dados_pedido_endereco_completo: '.dados-pedido-endereco-completo'
	, seletor_dados_pedido_endereco_cep: '.dados-pedido-endereco-cep'
	, seletor_hiddenPedidoEnderecoDestinatario: '.hiddenPedidoEnderecoDestinatario'
	, seletor_hiddenPedidoEnderecoLogradouro: '.hiddenPedidoEnderecoLogradouro'
	, seletor_hiddenPedidoEnderecoNumero: '.hiddenPedidoEnderecoNumero'
	, seletor_hiddenPedidoEnderecoComplemento: '.hiddenPedidoEnderecoComplemento'
	, seletor_hiddenPedidoEnderecoBairro: '.hiddenPedidoEnderecoBairro'
	, seletor_hiddenPedidoEnderecoMunicipio: '.hiddenPedidoEnderecoMunicipio'
	, seletor_hiddenPedidoEnderecoEstado: '.hiddenPedidoEnderecoEstado'
	, seletor_hiddenPedidoEnderecoCEP: '.hiddenPedidoEnderecoCEP'
	, seletor_msg_erro_validacao_alteracao_endereco_entrega: '.msg-erro-validacao-alteracao-endereco-entrega'
	, seletor_hiddenPedidoFormaPgto: '.hiddenPedidoFormaPgto'
	, seletor_div_dadosPedidoPgtoChequeCMC7: '.div-dadosPedidoPgtoChequeCMC7'
	, seletor_tbxDadosPedidoPgtoChequeCMC7: '.tbxDadosPedidoPgtoChequeCMC7'
	, seletor_dadosPedidoPgtoChequeCMC7bloco1Input1: '.dadosPedidoPgtoChequeCMC7bloco1Input1'
	, seletor_dadosPedidoPgtoChequeCMC7bloco1Input2: '.dadosPedidoPgtoChequeCMC7bloco1Input2'
	, seletor_dadosPedidoPgtoChequeCMC7bloco2Input1: '.dadosPedidoPgtoChequeCMC7bloco2Input1'
	, seletor_dadosPedidoPgtoChequeCMC7bloco2Input2: '.dadosPedidoPgtoChequeCMC7bloco2Input2'
	, seletor_dadosPedidoPgtoChequeCMC7bloco2Input3: '.dadosPedidoPgtoChequeCMC7bloco2Input3'
	, seletor_dadosPedidoPgtoChequeCMC7bloco3Input1: '.dadosPedidoPgtoChequeCMC7bloco3Input1'
	, seletor_dadosPedidoPgtoChequeCMC7bloco3Input2: '.dadosPedidoPgtoChequeCMC7bloco3Input2'
	, seletor_dadosPedidoPgtoChequeCMC7bloco3Input3: '.dadosPedidoPgtoChequeCMC7bloco3Input3'
	, seletor_dadosPedidoPgtoChequeCMC7Completo_$: '.dadosPedidoPgtoChequeCMC7Completo_'
	, seletor_dadosPedidoPgtoChequeCMC7Completo: '.dadosPedidoPgtoChequeCMC7Completo'
	, seletor_dadosPedidoPgtoCartaoParcelas: '#dadosPedidoPgtoCartao1Parcelas'
	, seletor_dadosPedidoPgtoCartao1Numero: '#dadosPedidoPgtoCartao1Numero'
	, seletor_dadosPedidoPgtoCartao1Nome: '#dadosPedidoPgtoCartao1Nome'
	, seletor_dadosPedidoPgtoCartao1Validade: '#dadosPedidoPgtoCartao1Validade'
	, seletor_dadosPedidoPgtoCartao1CVV: '#dadosPedidoPgtoCartao1CVV'
    , seletor_tabela_produtos: '#tb_produtos'
    , btn_number: '.btn-number'
    , input_number: '.input-number'

	, seletor_datepicker: '.datetimepicker'
	, seletor_btn_concluir_compra: '#btn-concluir-compra'
	, seletor_formPedido: '#formPedido'
    , seletor_spn_qtd_fotos: '#spn_'
    , seletor_txt_qtd_item: '#txt_'
    , seletor_chk_item: '#chk_'
    , seletor_chk_all: '.jqCheckProduct'
    , seletor_qtd_item: '.jqQtdProduct'
    , seletor_valor_total: '#spn_valortotal'
    , seletor_dadosPedidoPgtoBoletoQtdParcelas: '#dadosPedidoPgtoBoletoQtdParcelas'
    , seletor_parcelas_cheque: '#dadosPedidoPgtoChequeQtd'
    , seletor_link_fotos: '#lnkfotos'
	, seletor_hiddenPedidoValorTotal: '#dadosPedidoValorTotal'
	, seletor_dadosPedidoPgtoChequeCPF: '.dadosPedidoPgtoChequeCPF'
	, seletor_dadosPedidoPgtoChequeValor: '.dadosPedidoPgtoChequeValor'
	, seletor_dadosPedidoPgtoChequeTelefone: '.dadosPedidoPgtoChequeTelefone'
	, seletor_dadosPedidoPgtoChequeVencimento: '.dadosPedidoPgtoChequeVencimento'
	, seletor_dadosPedidoPgtoChequeEmitente: '.dadosPedidoPgtoChequeEmitente'
	, seletor_span_valor_dinheiro_especie_recebido: '.span-valor-dinheiro-especie-recebido'
	, seletor_span_msg_erro_cmc7: '.span-msg-erro-cmc7'
	, seletor_dadosPedidoCheckRecebimento: '#dadosPedidoCheckRecebimento'
	, seletor_spanValorParcelasBoleto: '#spanValorParcelasBoleto'
	, seletor_spanValorParcelasCartao: '#spanValorParcelasCartao'

    , seletor_hiddenPedidoCompradorCpfCnpj: '.hiddenPedidoCompradorCpfCnpj'
    , seletor_hiddenPedidoCompradorNome: '.hiddenPedidoCompradorNome'
    , seletor_hiddenPedidoCompradorDDD: '.hiddenPedidoCompradorDDD'
    , seletor_hiddenPedidoCompradorTelefone: '.hiddenPedidoCompradorTelefone'
    , seletor_hiddenPedidoCompradorEmail: '.hiddenPedidoCompradorEmail'

	, seletor_dados_pedido_comprador_nome: '.tbxNome'
	, seletor_dados_pedido_comprador_CpfCnpj: '.tbxCpfCnpj'
	, seletor_dados_pedido_comprador_DDD: '.tbxDDD'
    , seletor_dados_pedido_comprador_email: '.tbxEmail'
    , seletor_dados_pedido_comprador_telefone: '.tbxTelefone'
    , seletor_dados_pedido_comprador_data_nascimento: '#data_nascimento_comprador'

    , seletor_dados_pedido_comprador: '.dados-pedido-comprador'
    , seletor_dados_pedido_comprador_completo: '.dados-pedido-comprador-completo'
    , seletor_dados_pedido_comprador_cep: '.dados-pedido-comprador-cep'

	, seletor_hiddenPedidoCompradorDestinatario: '.hiddenPedidoCompradorDestinatario'
	, seletor_hiddenPedidoCompradorLogradouro: '.hiddenPedidoCompradorLogradouro'
	, seletor_hiddenPedidoCompradorNumero: '.hiddenPedidoCompradorNumero'
	, seletor_hiddenPedidoCompradorComplemento: '.hiddenPedidoCompradorComplemento'
	, seletor_hiddenPedidoCompradorBairro: '.hiddenPedidoCompradorBairro'
	, seletor_hiddenPedidoCompradorMunicipio: '.hiddenPedidoCompradorMunicipio'
	, seletor_hiddenPedidoCompradorEstado: '.hiddenPedidoCompradorEstado'
	, seletor_hiddenPedidoCompradorCEP: '.hiddenPedidoCompradorCEP'
    , seletor_hiddenPedidoCompradorDataNascimento: '.hiddenPedidoCompradorDataNascimento'

    , seletor_dados_comprador: '.jqComprador'
    , seletor_dados_entrega: '.jqEntrega'
    , seletor_btn_alterar_comprador_entrega: '#btn-alterar-comprador-entrega'
    , seletor_tipo_destinatario_comprador: '.hidden_tipo_destinatario_comprador'
    , seletor_titulo_box_dados: '.jqTituloBoxDados'
    , seletor_btn_data_nascimento: '#btnDataNascimento'
    , seletor_campo_observacao: '#txtObservacao'

    //Seletores - Fim

    //Métodos - Início
	, ValidarInformacoesPrimordiaisSessionStorage: function () {
	    var Redirect = false;

	    if (!window.sessionStorage) {
	        Redirect = true;
	    } else {
	        $.each(oCheckout.vItensInfoPrimordiaisSessionStorage, function (eIndice, eElemento) {
	            if (sessionStorage.getItem(eElemento) == null) { Redirect = true; }
	        });
	    }
	    if (Redirect) {
	        //TODO: MELHORAR COMUNICAÇÃO
	        if (oCheckout.OrigemOnlineOffline == 'ONLINE') {

	        }
	        else {

	        }
	        alert('Sua sessão não possui algumas informações importantes.\nVocê será redirecionado para listagem de alunos.');
	        document.location.href = (oCheckout.OrigemOnlineOffline == 'ONLINE' ? oCheckout.string_url_alunos_online : oCheckout.string_url_alunos_offline);
	    }

	}
	, Carregar: function () {
	    var _this = this;

	    _this.string_url_base_aplicacao = oInicial.BaseUrlAplicacao;
	    //NORMATIRAZAR STRINGS
	    _this.string_url_api_get_address_by_cep = _this.string_url_base_aplicacao + _this.string_url_api_get_address_by_cep;
	    _this.string_url_api_get_address_aluno = _this.string_url_base_aplicacao + _this.string_url_api_get_address_aluno;
	    _this.string_url_api_get_list_products = _this.string_url_base_aplicacao + _this.string_url_api_get_list_products;
	    _this.string_url_api_save_cartproduct = _this.string_url_base_aplicacao + _this.string_url_api_save_cartproduct;
	    _this.string_url_api_delete_cartproduct = _this.string_url_base_aplicacao + _this.string_url_api_delete_cartproduct;
	    _this.string_url_selecao_fotos_online = _this.string_url_base_aplicacao + _this.string_url_selecao_fotos_online;
	    _this.string_url_selecao_fotos_offline = _this.string_url_base_aplicacao + _this.string_url_selecao_fotos_offline;
	    _this.string_url_api_get_lista_precos = _this.string_url_base_aplicacao + _this.string_url_api_get_lista_precos;
	    _this.string_url_api_register_order = _this.string_url_base_aplicacao + _this.string_url_api_register_order;
	    _this.string_url_alunos = _this.string_url_base_aplicacao + _this.string_url_alunos;
	    _this.string_url_confirm_page = _this.string_url_base_aplicacao + _this.string_url_confirm_page;
	    _this.string_url_produtos_online = _this.string_url_base_aplicacao + _this.string_url_produtos_online;
	    _this.string_url_produtos_offline = _this.string_url_base_aplicacao + _this.string_url_produtos_offline;
	    _this.string_url_alunos_online = _this.string_url_base_aplicacao + _this.string_url_alunos_online;
	    _this.string_url_alunos_offline = _this.string_url_base_aplicacao + _this.string_url_alunos_offline;
	    _this.string_url_checkout = _this.string_url_base_aplicacao + _this.string_url_checkout;
	    //FIM NORMATIRAZAR STRINGS

	    oUtil.ShowLoader(true);

	    _this.jqThis = $(_this.seletor_geral);
	    _this.jqDivModalAlteracaoEntrega = $(_this.seletor_div_modal_alteracao_entrega);

	    if (_this.jqThis.length >= 0) {
	        _this.LimparSessionStorageDadosConclusao();
	        _this.CarregarEventos();
	        _this.CarregarDatePicker();

	    }

	}
	, LimparSessionStorageDadosConclusao: function () {
	    var _this = this;

	    window.sessionStorage.removeItem(_this.string_ChaveSessionStorageDadosConclusao);
	}
	, CarregarEventos: function () {
	    var _this = this;

	    _this.jqThis
			.on(_this.evento_click, _this.seletor_ancora_pedido_forma_pgto, function () { _this.TratarTrocaOpcoesPgto(); })
			.on(_this.evento_change, _this.seletor_radios_pedido_pgto_cartao_radio_cartao, function (evento) { _this.TratarTrocaOpcoesCartao(evento); })
			.on(_this.evento_change, _this.seletor_select_pedido_pgto_cheque_qtd, function () { _this.CalculaValorTotal(); _this.TratarTrocaOpcoesChequeQtd($(this)); })
			.on(_this.evento_click, _this.seletor_btn_alterar_endereco_entrega, function () { _this.AbrirModalAlteracaoDadosEntrega("destinatario"); return false; })
			.on(_this.evento_blur, _this.seletor_dados_pedido_nfe_cpf_cnpj, function (evento) { evento.preventDefault(); _this.ValidarNfeCPF(); })
			.on(_this.evento_click, _this.seletor_btn_concluir_compra, function () { _this.ValidarConclusaoCompra(); return false; })
			.on(_this.evento_change, _this.seletor_dadosPedidoPgtoChequeCPF, function () { _this.TratarPreenchimentoChequeCPF($(this)); })
			.on(_this.evento_change, _this.seletor_dadosPedidoPgtoChequeTelefone, function () { _this.TratarPreenchimentoChequeTelefone($(this)); })
			.on(_this.evento_change, _this.seletor_dadosPedidoPgtoChequeVencimento + '.' + _this.string_replicar, function () { _this.TratarPreenchimentoChequeVencimento($(this)); })
			.on(_this.evento_change, _this.seletor_dadosPedidoPgtoChequeEmitente + '.' + _this.string_replicar, function () { _this.TratarPreenchimentoChequeEmitente($(this)); })
			.on(_this.evento_keyup, _this.seletor_tbxDadosPedidoPgtoChequeCMC7, function (evento) { evento.preventDefault(); _this.TratarPreenchimentoChequeCMC7(evento, $(this)); })
            .on(_this.evento_change, _this.seletor_dadosPedidoPgtoCartaoParcelas, function () { _this.CalculaValorTotal(); return false; })
            .on(_this.evento_change, _this.seletor_dadosPedidoPgtoBoletoQtdParcelas, function () { _this.CalculaValorTotal(); return false; })
			.on(_this.evento_keydown, function (evento) { _this.TratarKeyDown(evento, $(this)); })
            .on(_this.evento_click, function (evento) { _this.TratarKeyDown(evento, $(this)); })
		    .on(_this.evento_click, _this.btn_number, function (evento) { _this.BtnNumberAddOrMinus(evento, this); })
            .on(_this.evento_focus, _this.input_number, function () { _this.BtnNumberFocus(this); })
            .on(_this.evento_change, _this.input_number, function () { _this.BtnNumberChange(this); })
            .on(_this.evento_keydown, _this.input_number, function (evento) { _this.BtnNumberKeyDown(evento); })
            .on(_this.evento_click, _this.seletor_btn_alterar_comprador_entrega, function () { _this.AbrirModalAlteracaoDadosEntrega("comprador"); return false; })
	    ;

	    $(_this.seletor_btn_data_nascimento).on(_this.evento_click, function (e) { _this.ShowDataPicker(); e.preventDefault(); });
	    $(_this.seletor_dados_pedido_comprador_CpfCnpj).on(_this.evento_change, function (e) { _this.ValidarCPF_CNPJ(); });
	    $(_this.seletor_dados_pedido_comprador_email).on(_this.evento_change, function (e) { _this.ValidaEmailComprador(); });

	    _this.jqDivModalAlteracaoEntrega
			.on(_this.evento_keyup, _this.seletor_input_alteracao_endereco_entrega_cep, function (evento) { evento.preventDefault(); _this.TratarPreenchimentoCEP(evento, $(this)); })
			.on(_this.evento_click, _this.seletor_btn_confirmar_alteracao_endereco_entrega, function (evento) { evento.preventDefault(); _this.ValidarFormularioAlteracaoEnderecoEntrega(); })
	    ;
	}
	, ToogleTypeInputCpfCnpj: function (Type, evento) {
	    var _this = this;

	    var Tipo = Type || 'text';

	    _this.jqThis.find(_this.seletor_dados_pedido_nfe_cpf_cnpj).attr('type', Tipo);

	    //_this.jqThis.find(_this.seletor_dados_pedido_nfe_cpf_cnpj).focus();
	}
	, TratarPreenchimentoChequeCPF: function (jqElemento) {
	    var _this = this;

	    var String_CPF = jqElemento.val().trim();
	    jqElemento.val(String_CPF);

	    if (String_CPF.length == 0) {
	        jqElemento.closest('div').removeClass(_this.string_class_is_valid);
	        return;
	    }

	    if (String_CPF.length != 11 && String_CPF.length != 14) {
	        jqElemento.closest('div').removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
	        return;
	    }

	    if (String_CPF.length == 11) { //CPF
	        if (!oUtil.validarCPF(String_CPF)) {
	            jqElemento.closest('div').removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
	            return;
	        }
	        if (jqElemento.hasClass(_this.string_replicar)) {
	            _this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeCPF).val(String_CPF).closest('div').removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid + ' ' + _this.string_is_dirty);
	        }
	        jqElemento.closest('div').removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid);
	        return;
	    }

	    if (String_CPF.length == 14) { //CPNJ
	        if (!oUtil.validaCNPJ(String_CPF)) {
	            jqElemento.closest('div').removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
	            return;
	        }
	        if (jqElemento.hasClass(_this.string_replicar)) {
	            _this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeCPF).val(String_CPF).closest('div').removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid + ' ' + _this.string_is_dirty);
	        }
	        jqElemento.closest('div').removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid);
	        return;
	    }

	}
	, TratarPreenchimentoChequeTelefone: function (jqElemento) {
	    var _this = this;

	    var String_Telefone = jqElemento.val().trim();
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
	        jqElemento.val(String_Telefone);
	        if (String_Telefone.length >= 10 && !isNaN(String_Telefone)) {
	            var DDD = String_Telefone.substr(0, 2);
	            var Telefone = String_Telefone.substring(2, String_Telefone.length);
	            //SE FOR UM DDD E TELEFONE VÁLIDOS
	            if ($.inArray(DDD, DDDsValidos) > -1 && $.inArray(Telefone.substr(0, 1), ['0', '1']) == -1) {
	                if (jqElemento.hasClass(_this.string_replicar)) {
	                    _this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeTelefone).val(String_Telefone).closest('div').removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid + ' ' + _this.string_is_dirty);
	                }
	                jqElemento.closest('div').removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid);
	            }
	            else {
	                jqElemento.closest('div').removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
	            }
	        }
	        else {
	            jqElemento.closest('div').removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
	        }
	    } else {
	        jqElemento.closest('div').removeClass(_this.string_class_is_valid);
	    }
	}
	, TratarPreenchimentoChequeEmitente: function (jqElemento) {
	    var _this = this;

	    var String_Emitente = jqElemento.val().trim();

	    if (String_Emitente.length > 0) {
	        jqElemento.val(String_Emitente);
	        if (String_Emitente.length >= 4) {
	            if (jqElemento.hasClass(_this.string_replicar)) {
	                _this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeEmitente).val(String_Emitente).closest('div').removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid + ' ' + _this.string_is_dirty);
	            }
	            jqElemento.closest('div').removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid);
	        }
	        else {
	            jqElemento.closest('div').removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
	        }
	    } else {
	        jqElemento.closest('div').removeClass(_this.string_class_is_valid);
	    }
	}
	, TratarKeyDown: function (evento, jqElemento) {
	    var _this = this;

	    //SE A TECLA PRESSIONADA FOR ENTER
	    if (evento.keyCode == 13) {
	        evento.preventDefault();
	        _this.jqThis.find(_this.seletor_btn_concluir_compra).trigger(_this.evento_click);
	        return false;
	    };
	    return true;
	}
	, TratarPreenchimentoChequeVencimento: function (elemento) {
	    var _this = this;

	    var DataEscolhida = elemento.val().trim();
	    if (DataEscolhida.length) {
	        var vDataEscolhida = DataEscolhida.split('/');
	        var Dia = parseInt(vDataEscolhida[0]);
	        var Mes = parseInt(vDataEscolhida[1]);
	        var Ano = parseInt(vDataEscolhida[2]);
	        var Data = new Date(Ano, Mes - 1, Dia);
	        //var Data = new Date(Mes + '/' + Dia + '/' + Ano);

	        var Inputs = _this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeVencimento).not(elemento);

	        var dia = '';
	        var mes = '';
	        var ano = '';
	        var data = '';

	        $.each(Inputs, function (eachIndice, eachElemento) {
	            Data.setMonth(Data.getMonth() + 1);

	            dia = Data.getDate().toString();
	            mes = (Data.getMonth() + 1).toString();
	            ano = Data.getFullYear().toString();
	            dia = (dia.length == 1 ? '0' : '') + dia;
	            mes = (mes.length == 1 ? '0' : '') + mes;
	            data = dia + '/' + mes + '/' + ano;

	            $(eachElemento).val(data);
	        });
	    }
	}
	, AtualizarTotalCheckout: function (Total) {
	    var _this = this;

	    _this.jqThis.find(_this.seletor_span_valor_dinheiro_especie_recebido).text(oUtil.toReal(Total));
	    _this.jqThis.find(_this.seletor_hiddenPedidoValorTotal).val(Total);

	}
	, ValidarConclusaoCompra: function (evento, elemento) {
	    var _this = this;
	    var Form = $(_this.seletor_formPedido).serializeObject();

	    var prodID = "";
	    var qtdFotos = 0;
	    var mensagem = "";
	    var continua = true;
	    var ListaProdutosSelecionados = [];
	    var ErrosValidacaoConclusao = [];
	    var QtdProdutosSelecionados = 0;
	    var qtd = 0;

	    var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno"));

	    _this.jqThis.find(_this.seletor_chk_all + ":checked").each(function () {
	        prodID = $(this).attr("data-product-id");
	        qtd = _this.jqThis.find(oCheckout.seletor_txt_qtd_item + prodID.toString()).val();

	        qtdFotos = _this.jqThis.find(_this.seletor_spn_qtd_fotos + prodID).text();
	        if (isNaN(qtdFotos) || Number(qtdFotos) == 0) {
	            for (var i = 0; i < _this.ListaProdutos.length; i++) {
	                if (_this.ListaProdutos[i].ProductID == Number(prodID) && _this.ListaProdutos[i].ExibirCarrinho && _this.ListaProdutos[i].QtdMinFoto > 0) {
	                    continua = false;
	                    mensagem = "Falta selecionar foto(s) para o produto '" + _this.ListaProdutos[i].NomeProduto + "'. Você será direcionado para a seleção de fotos.";
	                    break;
	                }
	            }
	        }

	        if (!isNaN(qtd) && Number(qtd) > 0) {

	            ListaProdutosSelecionados.push({
	                ProdID: Number(prodID),
	                Qtd: Number(qtd)
	            });
	        }

	        if (!continua)
	            return false;
	    });

	    if (!continua) {
	        alert(mensagem);
	        _this.jqThis.find("a[id='" + _this.seletor_link_fotos + prodID + "']").trigger(_this.evento_click);

	        return false;
	    }

	    //ValidarConclusaoCompraSelecaoDeProdutos
	    for (var i = 0; i < ListaProdutosSelecionados.length; i++) {
	        try {
	            valor = parseInt($(ListaProdutosSelecionados[i]).closest('tr').find(_this.seletor_qtd_item).val());
	        } catch (e) {
	            valor = 0;
	        }
	        QtdProdutosSelecionados += valor;
	    }
	    if (QtdProdutosSelecionados == 0) {
	        ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_nenhum_produto_selecionado);
	    }
	    //

	    //ValidarConclusaoCompraPreenchimentoCpfCnpj
	    if (Form.dadosPedidoNfeCpfCnpj.length > 0) {
	        switch (Form.dadosPedidoNfeCpfCnpj.length) {
	            case 11:
	                if (!oUtil.validarCPF(Form.dadosPedidoNfeCpfCnpj)) {
	                    ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cpf_informado_invalido);
	                }
	                break;
	            case 14:
	                if (!oUtil.validaCNPJ(Form.dadosPedidoNfeCpfCnpj)) {
	                    ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cnpj_informado_invalido);
	                }
	                break;
	            default:
	                ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cpf_cnpj_invalido);
	                break;
	        }
	    } else {
	        ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cpf_cnpj_vazio);
	    }
	    //

	    //*ValidarConclusaoCompraDadosEndereco
	    //

	    //*ValidarConclusaoCompraOpcaoFrete
	    //

	    //ValidarConclusaoCompraFormaPgto
	    switch (_this.FormaPgto.Nome) {
	        case _this.string_pgto_cartao: //"cartao-credito":
	            if (oOffline.CheckNetConnection()) {
	                var QtdParcelas = 0;
	                if (Form.dadosPedidoPgtoCartao1Parcelas.length > 0 && !isNaN(Form.dadosPedidoPgtoCartao1Parcelas)) {
	                    QtdParcelas = parseInt(Form.dadosPedidoPgtoBoletoQtdParcelas);
	                }
	                if (QtdParcelas == 0) {
	                    ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cartao_qtd_0);
	                }

	                if (Form.dadosPedidoPgtoCartao1Numero.length == 0) {
	                    ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cartao_numero_nao_informado);
	                }
	                if (Form.dadosPedidoPgtoCartao1Nome.length == 0) {
	                    ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cartao_nome_nao_informado);
	                }
	                if (Form.dadosPedidoPgtoCartao1Validade.length == 0) {
	                    ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cartao_validade_nao_informada);
	                }
	                else {
	                    if (Form.dadosPedidoPgtoCartao1Validade.length != 7 || _this.jqThis.find(_this.seletor_dadosPedidoPgtoCartao1Validade).closest('div').hasClass(_this.string_class_is_invalid)) {
	                        ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cartao_validade_invalida);
	                    }
	                }
	                if (Form.dadosPedidoPgtoCartao1CVV.length == 0) {
	                    ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cartao_cvv_nao_informado);
	                } else {
	                    if (_this.jqThis.find(_this.seletor_dadosPedidoPgtoCartao1CVV).closest('div').hasClass(_this.string_class_is_invalid)) {
	                        ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cartao_cvv_invalido);
	                    }
	                }
	            } else {
	                ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cartao_offline);
	            }
	            break;
	        case _this.string_pgto_boleto: //"boleto":
	            var QtdParcelas = 0;
	            if (Form.dadosPedidoPgtoBoletoQtdParcelas.length > 0 && !isNaN(Form.dadosPedidoPgtoBoletoQtdParcelas)) {
	                QtdParcelas = parseInt(Form.dadosPedidoPgtoBoletoQtdParcelas);
	            }
	            if (QtdParcelas == 0) {
	                ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_boleto_qtd_0);
	            }
	            break;
	        case _this.string_pgto_cheque: //"cheque":
	            var Elementos = _this.jqThis.find(_this.seletor_div_pedido_pgto_cheque_child + ':visible');

	            if (Elementos.length == 0) {
	                ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_qtd_parcelas_nao_selecionada);
	            } else {
	                var Cmc7array = [];
	                $.each(Elementos, function (eIndice, eElemento) {
	                    jqElemento = $(this);
	                    DadosChequeParcela = parseInt(jqElemento.attr('parcela'));
	                    jqElementoChequeCpfCnpj = jqElemento.find(_this.seletor_dadosPedidoPgtoChequeCPF);
	                    jqElementoChequeValor = jqElemento.find(_this.seletor_dadosPedidoPgtoChequeValor);
	                    jqElementoChequeTelefone = jqElemento.find(_this.seletor_dadosPedidoPgtoChequeTelefone);
	                    jqElementoChequeDataVencimento = jqElemento.find(_this.seletor_dadosPedidoPgtoChequeVencimento);
	                    jqElementoChequeEmitente = jqElemento.find(_this.seletor_dadosPedidoPgtoChequeEmitente);
	                    jqElementoChequeCmc7 = jqElemento.find(_this.seletor_dadosPedidoPgtoChequeCMC7Completo);

	                    if (jqElementoChequeCpfCnpj.val().length == 0) {
	                        ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_cpf_nao_informado.replace('{$parcela}', DadosChequeParcela.toString()));
	                    } else {
	                        if (jqElementoChequeCpfCnpj.closest('div').hasClass(_this.string_class_is_invalid)) {
	                            ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_cpf_invalido.replace('{$parcela}', DadosChequeParcela.toString()));
	                        }
	                    }

	                    if (jqElementoChequeValor.val().length == 0) {
	                        ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_valor_nao_informado.replace('{$parcela}', DadosChequeParcela.toString()));
	                    } else {
	                        if (isNaN(Number(jqElementoChequeValor.val()))) {
	                            ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_valor_invalido.replace('{$parcela}', DadosChequeParcela.toString()));
	                        }
	                    }

	                    if (jqElementoChequeTelefone.val().length == 0) {
	                        ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_telefone_nao_informado.replace('{$parcela}', DadosChequeParcela.toString()));
	                    } else {
	                        if (!oUtil.ValidarTelefone(jqElementoChequeTelefone.val())) {
	                            ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_telefone_invalido.replace('{$parcela}', DadosChequeParcela.toString()));
	                        }
	                    }

	                    if (jqElementoChequeDataVencimento.val().length == 0) {
	                        ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_vencimento_nao_informado.replace('{$parcela}', DadosChequeParcela.toString()));
	                    } else {
	                        if (!oUtil.ValidarDataDDMMAAAA(jqElementoChequeDataVencimento.val())) {
	                            ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_vencimento_invalido.replace('{$parcela}', DadosChequeParcela.toString()));
	                        }
	                    }

	                    if (jqElementoChequeEmitente.val().length == 0) {
	                        ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_emitente_nao_informado.replace('{$parcela}', DadosChequeParcela.toString()));
	                    }


	                    if (jqElementoChequeCmc7.val().length == 0) {
	                        ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_cmc7_nao_informado.replace('{$parcela}', DadosChequeParcela.toString()));
	                    } else {
	                        var cm7val = jqElementoChequeCmc7.val();
	                        if (Cmc7array.indexOf(cm7val) == -1) {
	                            Cmc7array.push(cm7val);
	                            if (!oUtil.ValidarCMC7(cm7val)) {
	                                ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_cmc7_invalido.replace('{$parcela}', DadosChequeParcela.toString()));
	                            }
	                        } else {
	                            ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_cmc7_duplicado.replace('{$parcela}', DadosChequeParcela.toString()));
	                        }
	                    }
	                });
	                if (!_this.ValidarSomaParcelasCheque()) {
	                    ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_cheque_somatorio_invalido);
	                }
	            }
	            break;
	        case _this.string_pgto_dinheiro: //"dinheiro":
	            if (!_this.jqThis.find(_this.seletor_dadosPedidoCheckRecebimento).is(':checked')) {
	                ErrosValidacaoConclusao.push(_this.string_validacaoconclusao_dinheiro_check_nao_selecionado);
	            }
	            break;
	        default:
	            break;
	    }
	    //

	    //Verificar se lista de erros contem algum indice e informar os erros ao usuário
	    if (ErrosValidacaoConclusao.length > 0) {
	        oUtil.ShowModalGeral('Ops! Verifique os seguintes itens e tente novamente', ErrosValidacaoConclusao);
	        return false;
	    }
	    //

	    var DadosCpfCnpj = _this.jqThis.find(_this.seletor_dados_pedido_nfe_cpf_cnpj).val();
	    var DadosVendedorID = (JSON.parse(oUtil.GetCookie('user_offline'))).User_ID;
	    var DadosValorTotal = Number(_this.jqThis.find(_this.seletor_hiddenPedidoValorTotal).val());
	    var DadosAlunoTurmaID = dados.AlunoTurmaID;

	    var Endereco_Title = _this.jqThis.find(_this.seletor_hiddenPedidoEnderecoLogradouro).val();
	    var Endereco_ZipCode = _this.jqThis.find(_this.seletor_hiddenPedidoEnderecoCEP).val();
	    var Endereco_Destinatario = _this.jqThis.find(_this.seletor_hiddenPedidoEnderecoDestinatario).val();
	    var Endereco_AddressLine = _this.jqThis.find(_this.seletor_hiddenPedidoEnderecoLogradouro).val();
	    var Endereco_AddressNumber = _this.jqThis.find(_this.seletor_hiddenPedidoEnderecoNumero).val();
	    var Endereco_AddressComplement = _this.jqThis.find(_this.seletor_hiddenPedidoEnderecoComplemento).val();
	    var Endereco_Neighbourhood = _this.jqThis.find(_this.seletor_hiddenPedidoEnderecoBairro).val();
	    var Endereco_City = _this.jqThis.find(_this.seletor_hiddenPedidoEnderecoMunicipio).val();
	    var Endereco_State = _this.jqThis.find(_this.seletor_hiddenPedidoEnderecoEstado).val();
	    var Endereco_Country = 'BR';

	    var DadosCartaoCreditoNumero = _this.jqThis.find(_this.seletor_dadosPedidoPgtoCartao1Numero).val();
	    var DadosCartaoCreditoNome = _this.jqThis.find(_this.seletor_dadosPedidoPgtoCartao1Nome).val();
	    var DadosCartaoCreditoValidadeMes = _this.jqThis.find(_this.seletor_dadosPedidoPgtoCartao1Validade).val().split('/')[0];
	    var DadosCartaoCreditoValidadeAno = _this.jqThis.find(_this.seletor_dadosPedidoPgtoCartao1Validade).val().split('/')[1];
	    var DadosCartaoCreditoCVV = _this.jqThis.find(_this.seletor_dadosPedidoPgtoCartao1CVV).val();

	    var Endereco_Comprador_Title = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorLogradouro).val();
	    var Endereco_Comprador_ZipCode = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorCEP).val();
	    var Endereco_Comprador_AddressLine = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorLogradouro).val();
	    var Endereco_Comprador_AddressNumber = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorNumero).val();
	    var Endereco_Comprador_AddressComplement = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorComplemento).val();
	    var Endereco_Comprador_Neighbourhood = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorBairro).val();
	    var Endereco_Comprador_City = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorMunicipio).val();
	    var Endereco_Comprador_State = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorEstado).val();
	    var Endereco_Comprador_Country = 'BR';

	    var dados_comprador_cpf_cnpj = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorCpfCnpj).val();
	    var dados_comprador_nome = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorNome).val();
	    var dados_comprador_ddd = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorDDD).val();
	    var dados_comprador_telefone = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorTelefone).val();
	    var dados_comprador_email = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorEmail).val();
	    var dados_comprador_data_nascimento = _this.jqThis.find(_this.seletor_hiddenPedidoCompradorDataNascimento).val();
	    dados_comprador_data_nascimento = oUtil.FormatDateYYYYMMDD(dados_comprador_data_nascimento);

	    var Observacao = _this.jqThis.find(_this.seletor_campo_observacao).val();

	    if (dados_comprador_cpf_cnpj.length == 0)
	        ErrosValidacaoConclusao.push(_this.string_validacao_comprador_cpf_cnpj);

	    if (dados_comprador_nome.length == 0)
	        ErrosValidacaoConclusao.push(_this.string_validacao_comprador_nome);

	    if (dados_comprador_nome.length == 0)
	        ErrosValidacaoConclusao.push(_this.string_validacao_comprador_email);

	    if (Endereco_Comprador_Title.length == 0)
	        ErrosValidacaoConclusao.push(_this.string_validacao_comprador_endereco);

	    if (Endereco_Comprador_AddressLine.length == 0)
	        ErrosValidacaoConclusao.push(_this.string_validacao_comprador_endereco);

	    if (Endereco_Comprador_AddressNumber.length == 0)
	        ErrosValidacaoConclusao.push(_this.string_validacao_comprador_endereco);

	    if (Endereco_Comprador_AddressComplement.length == 0)
	        ErrosValidacaoConclusao.push(_this.string_validacao_comprador_endereco);

	    if (Endereco_Comprador_Neighbourhood.length == 0)
	        ErrosValidacaoConclusao.push(_this.string_validacao_comprador_endereco);

	    if (Endereco_Comprador_City.length == 0)
	        ErrosValidacaoConclusao.push(_this.string_validacao_comprador_endereco);

	    if (Endereco_Comprador_State.length == 0)
	        ErrosValidacaoConclusao.push(_this.string_validacao_comprador_endereco);

	    //Verificar se lista de erros contem algum indice e informar os erros ao usuário
	    if (ErrosValidacaoConclusao.length > 0) {
	        oUtil.ShowModalGeral('Ops! Verifique os seguintes itens e tente novamente', ErrosValidacaoConclusao);
	        return false;
	    }
	    //

	    var DadosEndereco = new checkout_classes_Endereco(Endereco_Title, Endereco_Destinatario, Endereco_ZipCode, Endereco_AddressLine, Endereco_AddressNumber, Endereco_AddressComplement, Endereco_Neighbourhood, Endereco_City, Endereco_State, Endereco_Country);
	    var DadosComprador = new checkout_dados_comprador(dados_comprador_cpf_cnpj, dados_comprador_nome, dados_comprador_email, dados_comprador_ddd, dados_comprador_telefone, dados_comprador_data_nascimento, Endereco_Title, Endereco_Destinatario, Endereco_ZipCode, Endereco_AddressLine, Endereco_AddressNumber, Endereco_AddressComplement, Endereco_Neighbourhood, Endereco_City, Endereco_State, Endereco_Country);


	    var vDadosProdutos = [];
	    var vListPhotoId = [];

	    //for (var i = 0; i < ListaProdutosSelecionados.length; i++) {
	    //	//$(ListaProdutosSelecionados[i])
	    //	vDadosProdutos.push(new checkout_classes_DadosProdutos());
	    //}

	    var vDadosCheque = [];
	    var DadosQtdParcelas = 0;

	    switch (_this.FormaPgto.Nome) {
	        case _this.string_pgto_cartao: //"cartao-credito":
	            DadosQtdParcelas = parseInt(_this.jqThis.find(_this.seletor_dadosPedidoPgtoCartaoParcelas).val());
	            break;
	        case _this.string_pgto_boleto: //"boleto":
	            DadosQtdParcelas = parseInt(_this.jqThis.find(_this.seletor_dadosPedidoPgtoBoletoQtdParcelas).val());
	            break;
	        case _this.string_pgto_cheque: //"cheque":
	            DadosQtdParcelas = parseInt(_this.jqThis.find(_this.seletor_parcelas_cheque).val());

	            var Elementos = _this.jqThis.find(_this.seletor_div_pedido_pgto_cheque_child + ':visible');
	            var DadosChequeParcela = 0;
	            var DadosChequeCmc7 = '';
	            var DadosChequeCpfCnpj = '';
	            var DadosChequeEmitente = '';
	            var DadosChequeTelefone = '';
	            var DadosChequeValor = 0.00;
	            var DadosChequeDataVencimento = '';

	            $.each(Elementos, function (eIndice, eElemento) {
	                jqElemento = $(this);
	                DadosChequeParcela = parseInt(jqElemento.attr('parcela'));
	                DadosChequeCmc7 = jqElemento.find(_this.seletor_dadosPedidoPgtoChequeCMC7Completo).val();
	                DadosChequeCpfCnpj = jqElemento.find(_this.seletor_dadosPedidoPgtoChequeCPF).val();
	                DadosChequeEmitente = jqElemento.find(_this.seletor_dadosPedidoPgtoChequeEmitente).val();
	                DadosChequeTelefone = jqElemento.find(_this.seletor_dadosPedidoPgtoChequeTelefone).val();
	                DadosChequeValor = Number(jqElemento.find(_this.seletor_dadosPedidoPgtoChequeValor).val()); //TODO: PARSE NO VALOR PARA DECIMAL
	                DadosChequeDataVencimento = jqElemento.find(_this.seletor_dadosPedidoPgtoChequeVencimento).val();

	                DadosChequeDataVencimento = DadosChequeDataVencimento.substring(6, 10) + DadosChequeDataVencimento.substring(2, 6) + DadosChequeDataVencimento.substring(0, 2);// YYYY/MM/DD

	                vDadosCheque.push(new checkout_classes_DadosCheque(DadosChequeParcela, DadosChequeCmc7, DadosChequeCpfCnpj, DadosChequeEmitente, DadosChequeTelefone, DadosChequeValor, DadosChequeDataVencimento));
	            });
	            break;
	        case _this.string_pgto_dinheiro: //"dinheiro":
	            DadosQtdParcelas = 1;
	            break;
	        default:
	            break;
	    }

	    var DadosCartao = new checkout_classes_DadosCartao(DadosCartaoCreditoNumero, DadosCartaoCreditoNome, DadosCartaoCreditoValidadeMes, DadosCartaoCreditoValidadeAno, DadosCartaoCreditoCVV);
	    var DadosPagamento = new checkout_classes_DadosPagamento(_this.FormaPgto.Type, _this.FormaPgto.Group, DadosQtdParcelas, DadosValorTotal, DadosCartao, vDadosCheque);

	    var DadosCompra = new checkout_classes_DadosCompra(DadosCpfCnpj, DadosAlunoTurmaID, DadosVendedorID, vDadosProdutos, DadosEndereco, DadosValorTotal, DadosPagamento, _this.OrderID, _this.OrigemOnlineOffline, DadosComprador, Observacao);

	    _this.RecuperaListaProdutos(DadosCompra, ListaProdutosSelecionados);

	    var online = true;

	    try {
	        online = oOffline.CheckNetConnection();
	    }
	    catch (e) {
	        online = false;
	    }

	    if (online) { //Se tiver ONLINE GRAVA DADOS ONLINE
	        _this.RegistrarPedido(DadosCompra);
	    }
	    else {
	        _this.RegistrarPedidoOffline(DadosCompra);
	    }

	}
	, ValidarSomaParcelasCheque: function () {
	    var _this = this;

	    try {
	        var Somatorio = 0.00;
	        var Total = parseFloat(_this.jqThis.find(_this.seletor_hiddenPedidoValorTotal).val());
	        var Inputs = _this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeValor + ':visible');

	        $.each(Inputs, function (eIndice, eElemento) {
	            Somatorio = parseFloat((Somatorio + parseFloat(parseFloat($(eElemento).val()).toFixed(2))).toFixed(2));
	        });

	        return Somatorio == Total ? true : false;
	    } catch (e) {
	        console.log('erro: ' + e.message);
	    }
	}
	, TratarPreenchimentoChequeCMC7: function (evento, jqElemento) {
	    var _this = this;

	    var KeysCodeValid = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
	    var Indice = $.inArray(evento.keyCode, KeysCodeValid);
	    var TRECHO = jqElemento.val().replace(/[^0-9]/g, '');

	    jqElemento.val(TRECHO);

	    var TRECHOS_CMC7 = jqElemento.closest(_this.seletor_div_dadosPedidoPgtoChequeCMC7).find(_this.seletor_tbxDadosPedidoPgtoChequeCMC7);
	    var TRECHOS_COMPLETOS = 0;
	    var CMC7 = '';

	    if (jqElemento.val().length == jqElemento.attr('maxlength') && Indice > -1) {
	        if (jqElemento.hasClass(_this.string_replicar)) {
	            _this.jqThis.find(jqElemento.attr('target')).val(jqElemento.val());
	        }
	        //} else if (Indice > -1) {
	        //	//CARACTERE VÁLIDO, TRECHO INCOMPLETO
	        //	_this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeCMC7Completo_$ + jqElemento.attr('cheque')).val('');
	    } else {
	        //CARACTERE INVÁLIDO
	    }

	    $.each(TRECHOS_CMC7, function (eIndex, eElemento) {
	        if ($(this).val().length < $(this).attr('minlength') || $(this).val().length > $(this).attr('maxlength')) {
	            $(this).focus();
	            return false;
	        } else {
	            TRECHOS_COMPLETOS++;
	        }
	    });

	    if (TRECHOS_COMPLETOS == TRECHOS_CMC7.length) {
	        $.each(TRECHOS_CMC7, function (eIndex, eElemento) {
	            CMC7 += $(this).val();
	        });
	        if (oUtil.ValidarCMC7(CMC7)) {
	            _this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeCMC7Completo_$ + jqElemento.attr('cheque')).val(CMC7);
	            TRECHOS_CMC7.removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid);
	            TRECHOS_CMC7.first().closest('div').siblings(_this.seletor_span_msg_erro_cmc7).hide();
	        } else {
	            _this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeCMC7Completo_$ + jqElemento.attr('cheque')).val('');
	            TRECHOS_CMC7.removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
	            TRECHOS_CMC7.first().closest('div').siblings(_this.seletor_span_msg_erro_cmc7).show();
	        }
	    } else {
	        _this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeCMC7Completo_$ + jqElemento.attr('cheque')).val('');
	        return false;
	    }

	}
	, ValidarFormularioAlteracaoEnderecoEntrega: function () {
	    var _this = this;
	    var Erro = '';
	    var endereco_comprador = $(_this.seletor_tipo_destinatario_comprador).val().trim();

	    $(_this.seletor_msg_erro_validacao_alteracao_endereco_entrega).text("");

	    $(_this.seletor_msg_erro_validacao_alteracao_endereco_entrega).promise().done(function () {
	        jQuery(this).slideUp(_this.string_intervalo_animacao, function () {
	            jQuery(this).html('');
	        });
	    });

	    var cep = $(_this.seletor_input_alteracao_endereco_entrega_cep).val().trim();
	    var destinatario = $(_this.seletor_input_alteracao_endereco_entrega_destinatario).val().trim();
	    var logradouro = $(_this.seletor_input_alteracao_endereco_entrega_logradouro).val().trim();
	    var numero = $(_this.seletor_input_alteracao_endereco_entrega_numero).val().trim();
	    var bairro = $(_this.seletor_input_alteracao_endereco_entrega_bairro).val().trim();
	    var cidade = $(_this.seletor_input_alteracao_endereco_entrega_cidade).val().trim();
	    var estado = $(_this.seletor_select_alteracao_endereco_entrega_estado).val().trim();
	    var complemento = $(_this.seletor_input_alteracao_endereco_entrega_complemento).val().trim();

	    var CpfCnpjComprador = $(_this.seletor_dados_pedido_comprador_CpfCnpj).val().trim();
	    var email = $(_this.seletor_dados_pedido_comprador_email).val().trim();
	    var telefone = $(_this.seletor_dados_pedido_comprador_telefone).val().trim();
	    var nomecomprador = $(_this.seletor_dados_pedido_comprador_nome).val().trim();
	    var ddd = $(_this.seletor_dados_pedido_comprador_DDD).val().trim();
	    var dataNascimento = $(_this.seletor_dados_pedido_comprador_data_nascimento).val().trim();

	    if (cep.length != 8) { Erro += '- CEP inválido;<br/>'; }
	    if (logradouro.length == 0) { Erro += '- Logradouro inválido;<br/>'; }
	    if (numero.length == 0) { Erro += '- Número inválido;<br/>'; }
	    if (bairro.length == 0) { Erro += '- Infome um bairro;<br/>'; }
	    if (cidade.length == 0) { Erro += '- Infome uma cidade;<br/>'; }
	    if (estado.length == 0) { Erro += '- Infome um estado;<br/>'; }

	    if (endereco_comprador == "comprador") {

	        if (!oUtil.ValidarCPF_CNPJ(CpfCnpjComprador)) { Erro += '- CPF / CNPJ inválido;<br/>'; }
	        if (!oUtil.IsValidEmail(email)) { Erro += '- Email inválido;<br/>'; }
	        if (ddd.length == 0 || telefone.length == 0) { Erro += 'Telefone inválido;<br/>'; }
	        if (nomecomprador.length == 0) { Erro += '- Infome o nome do comprador;<br/>'; }
	    }
	    else
	        if (destinatario.length == 0) { Erro += '- Destinatário inválido;<br/>'; }

	    if (Erro.length > 0) {
	        $(_this.seletor_msg_erro_validacao_alteracao_endereco_entrega).promise().done(function () {
	            jQuery(this).html(Erro).slideDown(400);
	        });
	    } else {

	        var endereco = {
	            Destinatario: destinatario,
	            AddressLine: logradouro,
	            AddressNumber: numero,
	            AddressComplement: complemento,
	            ZipCode: cep,
	            Neighbourhood: bairro,
	            City: cidade,
	            State: estado,
	            CpfCnpj: CpfCnpjComprador,
	            Email: email,
	            Nome: nomecomprador,
	            ddd: ddd,
	            Telefone: telefone,
	            DataNascimento: dataNascimento
	        }

	        if (endereco_comprador == "comprador")
	            _this.EscreveEnderecoComprador(endereco);
	        else
	            _this.EscreveEndereco(endereco);


	        $(_this.seletor_form_alteracao_endereco_entrega)[0].reset();
	        _this.jqDivModalAlteracaoEntrega.modal('hide');
	    }
	}
	, ValidarNfeCPF: function () {
	    var _this = this;

	    jqElemento = _this.jqThis.find(_this.seletor_dados_pedido_nfe_cpf_cnpj);
	    String_CPF_CNPJ = jqElemento.val().trim();

	    if (String_CPF_CNPJ.length > 0) {
	        if (String_CPF_CNPJ.length == 11 || String_CPF_CNPJ.length == 14) {
	            var Is_CPF_CNPJ_Valid = (String_CPF_CNPJ.length == 11) ? oUtil.validarCPF(String_CPF_CNPJ) : oUtil.validaCNPJ(String_CPF_CNPJ);
	            if (Is_CPF_CNPJ_Valid) {
	                $(_this.seletor_div_dados_pedido_nfe_cpf_cnpj).removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid);
	            }
	            else {
	                $(_this.seletor_div_dados_pedido_nfe_cpf_cnpj).removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
	            }
	        }
	        else {
	            $(_this.seletor_div_dados_pedido_nfe_cpf_cnpj).removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
	        }
	    } else {
	        $(_this.seletor_div_dados_pedido_nfe_cpf_cnpj).removeClass(_this.string_class_is_valid);
	    }

	}
	, TratarPreenchimentoCEP: function (evento, jqElemento) {
	    var _this = this;

	    var KeysCodeValid = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

	    var Indice = $.inArray(evento.keyCode, KeysCodeValid);

	    var CEP = jqElemento.val().replace(/[^0-9]+/g, '');

	    if (CEP.length > 8) { CEP = CEP.substring(0, 8); }

	    jqElemento.val(CEP);

	    if (CEP.length == 8 && Indice > -1) {
	        //CARACTERE VÁLIDO, CEP COMPLETO
	        if (oOffline.CheckNetConnection()) {
	            _this.RequisicaoInfoEndereco(CEP);
	        } else {
	            _this.LimparFormAlteracaoEnderecoEntrega();
	        }
	    } else if (Indice > -1) {
	        //CARACTERE VÁLIDO, CEP INCOMPLETO
	    } else {
	        //CARACTERE INVÁLIDO
	    }

	    return false;

	}
	, CarregarDatePicker: function () {
	    var _this = this;
	    var oDatepicker = _this.jqThis.find(_this.seletor_datepicker);
	    if (oDatepicker.length >= 0) {
	        config = oUtil.GetConfigDatePicker();
	        oDatepicker.datetimepicker(config);
	        jQuery('.datetimepicker').datetimepicker({ timepicker: false, format: 'd/m/Y' });
	    }
	}
	, TratarRetornoAPIBuscaInfoCEP: function (obj) {
	    var _this = this;

	    if (obj) {
	        if (obj.Address != undefined) {
	            $(_this.seletor_input_alteracao_endereco_entrega_logradouro).val(obj.Address.Logradouro != undefined && obj.Address.Logradouro.trim().length > 0 ? obj.Address.Logradouro.trim() : '');//.attr('disabled', function () { return $(this).val().trim().length > 0; });
	            $(_this.seletor_input_alteracao_endereco_entrega_numero).val(obj.Address.Numero != undefined && obj.Address.Numero.trim().length > 0 ? obj.Address.Numero.trim() : '').attr('disabled', function () { return $(this).val().trim().length > 0; });
	            $(_this.seletor_input_alteracao_endereco_entrega_bairro).val(obj.Address.Bairro != undefined && obj.Address.Bairro.trim().length > 0 ? obj.Address.Bairro.trim() : '').attr('disabled', function () { return $(this).val().trim().length > 0; });
	            $(_this.seletor_input_alteracao_endereco_entrega_cidade).val(obj.Address.Municipio != undefined && obj.Address.Municipio.trim().length > 0 ? obj.Address.Municipio.trim() : '').attr('disabled', function () { return $(this).val().trim().length > 0; });
	            $(_this.seletor_select_alteracao_endereco_entrega_estado).val(obj.Address.UF != undefined && obj.Address.UF.trim().length > 0 ? obj.Address.UF.trim().toUpperCase() : '').attr('disabled', function () { return $(this).val().trim().length > 0; });
	        }
	        if (obj.Sucesso) {
	            $(_this.seletor_input_alteracao_endereco_entrega_destinatario).focus();
	        }
	    }
	}
	, LimparFormAlteracaoEnderecoEntrega: function () {
	    var _this = this;

	    //$(_this.seletor_input_alteracao_endereco_entrega_logradouro).val('').attr('disabled', false);
	    $(_this.seletor_input_alteracao_endereco_entrega_numero).val('').attr('disabled', false);
	    $(_this.seletor_input_alteracao_endereco_entrega_bairro).val('').attr('disabled', false);
	    $(_this.seletor_input_alteracao_endereco_entrega_cidade).val('').attr('disabled', false);
	    $(_this.seletor_select_alteracao_endereco_entrega_estado).val('').attr('disabled', false);
	}
	, TratarTrocaOpcoesPgto: function () {
	    var _this = this;

	    var forma_pgto = _this.jqThis.find(_this.seletor_ancora_pedido_forma_pgto_ativo).attr(_this.string_forma_pgto);

	    _this.jqThis.find(_this.seletor_hiddenPedidoFormaPgto).val(forma_pgto);

	    switch (forma_pgto) {
	        case _this.string_pgto_cartao: //"cartao-credito":
	            _this.FormaPgto.Type = 1;
	            _this.FormaPgto.Group = 2;
	            _this.FormaPgto.Nome = forma_pgto;
	            //_this.jqThis.find(_this.seletor_dadosPedidoPgtoCartaoParcelas).val('').trigger(_this.evento_change);
	            break;

	        case _this.string_pgto_boleto: //"boleto":
	            _this.FormaPgto.Type = 21;
	            _this.FormaPgto.Group = 3;
	            _this.FormaPgto.Nome = forma_pgto;
	            //_this.jqThis.find(_this.seletor_dadosPedidoPgtoBoletoQtdParcelas).val('').trigger(_this.evento_change);
	            break;

	        case _this.string_pgto_cheque: //"cheque":
	            _this.FormaPgto.Type = 20;
	            _this.FormaPgto.Group = 7;
	            _this.FormaPgto.Nome = forma_pgto;
	            //_this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeQtd).val('').trigger(_this.evento_change);
	            break;

	        case _this.string_pgto_dinheiro: //"dinheiro":
	            _this.FormaPgto.Type = 22;
	            _this.FormaPgto.Group = 8;
	            _this.FormaPgto.Nome = forma_pgto;
	            //_this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeQtd).val('').trigger(_this.evento_change);
	            break;
	    }
	    _this.CalculaValorTotal();

	    if (_this.jqThis.find(_this.seletor_ancora_pedido_forma_pgto_ativo).attr(_this.string_forma_pgto) == 'cartao-credito') {
	        oOffline.verifyOnline();
	    }

	}
	, TratarTrocaOpcoesCartao: function (evento) {
	    var _this = this;

	    if ('#' + evento.target.id == _this.seletor_radio_pedido_pgto_cartao_radio_cartao_1) {
	        _this.jqThis.find(_this.seletor_div_pedido_pgto_cartao2).slideUp();
	    } else if ('#' + evento.target.id == _this.seletor_radio_pedido_pgto_cartao_radio_cartao_2) {
	        _this.jqThis.find(_this.seletor_div_pedido_pgto_cartao2).slideDown();
	    }

	}
	, TratarTrocaOpcoesChequeQtd: function (jqElemento) {
	    var _this = this;

	    var Qtd_Selecionada;
	    try {
	        Qtd_Selecionada = parseInt(jqElemento.val() == '' ? 0 : jqElemento.val());
	    } catch (e) {
	        Qtd_Selecionada = 0;
	    }

	    if (Qtd_Selecionada > _this.jqPedidoPgtoChequeQtdAtual) {
	        for (var i = _this.jqPedidoPgtoChequeQtdAtual; i <= Qtd_Selecionada ; i++) {
	            _this.jqThis.find(_this.seletor_div_pedido_pgto_cheque_child + '[parcela="' + (i).toString() + '"]').show();
	        }
	    } else {
	        for (var i = _this.jqPedidoPgtoChequeQtdAtual; i > Qtd_Selecionada ; i--) {
	            _this.jqThis.find(_this.seletor_div_pedido_pgto_cheque_child + '[parcela="' + (i).toString() + '"]').hide();
	        }
	    }

	    try {
	        var Total = parseFloat(_this.jqThis.find(_this.seletor_hiddenPedidoValorTotal).val());
	        var ValorPorParcela = (Total / Qtd_Selecionada).toFixedWithoutRound(2);
	        var TotalAPrazo = (ValorPorParcela * Qtd_Selecionada).toFixedWithoutRound(2);
	        var Resto = parseFloat((Total - TotalAPrazo).toFixed(2));
	        var UltimaParcela = parseFloat((ValorPorParcela + Resto).toFixed(2));

	        _this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeValor + ':visible').val(ValorPorParcela.toFixed(2));
	        _this.jqThis.find(_this.seletor_dadosPedidoPgtoChequeValor + ':visible').last().val(UltimaParcela.toFixed(2));
	        //OU
	        //_this.jqThis.find(_this.seletor_div_pedido_pgto_cheque_child + '[parcela="' + Qtd_Selecionada.toString() + '"]').find(_this.seletor_dadosPedidoPgtoChequeValor).val(UltimaParcela);

	    } catch (e) {
	        //console.log('erro: ' + e.message);
	    }

	    _this.jqPedidoPgtoChequeQtdAtual = Qtd_Selecionada;
	}
	, AbrirModalAlteracaoDadosEntrega: function (flag_Destinatario_Comprador) {
	    var _this = this;

	    $(_this.seletor_tipo_destinatario_comprador).val(flag_Destinatario_Comprador);

	    if (flag_Destinatario_Comprador == "destinatario") {

	        $(_this.seletor_dados_comprador).addClass("hidden");
	        $(_this.seletor_dados_entrega).removeClass("hidden");
	        $(_this.seletor_titulo_box_dados).text("Dados de entrega");

	        $(_this.seletor_input_alteracao_endereco_entrega_cep).val($(_this.seletor_hiddenPedidoEnderecoCEP).val());
	        $(_this.seletor_input_alteracao_endereco_entrega_destinatario).val($(_this.seletor_hiddenPedidoEnderecoDestinatario).val());
	        $(_this.seletor_input_alteracao_endereco_entrega_logradouro).val($(_this.seletor_hiddenPedidoEnderecoLogradouro).val());
	        $(_this.seletor_input_alteracao_endereco_entrega_numero).val($(_this.seletor_hiddenPedidoEnderecoNumero).val());
	        $(_this.seletor_input_alteracao_endereco_entrega_bairro).val($(_this.seletor_hiddenPedidoEnderecoBairro).val());
	        $(_this.seletor_input_alteracao_endereco_entrega_cidade).val($(_this.seletor_hiddenPedidoEnderecoMunicipio).val());
	        $(_this.seletor_select_alteracao_endereco_entrega_estado).val($(_this.seletor_hiddenPedidoEnderecoEstado).val());
	        $(_this.seletor_input_alteracao_endereco_entrega_complemento).val($(_this.seletor_hiddenPedidoEnderecoComplemento).val());
	    }
	    else {

	        $(_this.seletor_dados_comprador).removeClass("hidden");
	        $(_this.seletor_dados_entrega).addClass("hidden");
	        $(_this.seletor_titulo_box_dados).text("Dados do comprador");

	        $(_this.seletor_dados_pedido_comprador_CpfCnpj).val($(_this.seletor_hiddenPedidoCompradorCpfCnpj).val());
	        $(_this.seletor_dados_pedido_comprador_nome).val($(_this.seletor_hiddenPedidoCompradorNome).val());
	        $(_this.seletor_dados_pedido_comprador_DDD).val($(_this.seletor_hiddenPedidoCompradorDDD).val());
	        $(_this.seletor_dados_pedido_comprador_telefone).val($(_this.seletor_hiddenPedidoCompradorTelefone).val());
	        $(_this.seletor_dados_pedido_comprador_email).val($(_this.seletor_hiddenPedidoCompradorEmail).val());
	        $(_this.seletor_dados_pedido_comprador_data_nascimento).val($(_this.seletor_hiddenPedidoCompradorDataNascimento).val());

	        $(_this.seletor_input_alteracao_endereco_entrega_cep).val($(_this.seletor_hiddenPedidoCompradorCEP).val());
	        $(_this.seletor_input_alteracao_endereco_entrega_logradouro).val($(_this.seletor_hiddenPedidoCompradorLogradouro).val());
	        $(_this.seletor_input_alteracao_endereco_entrega_numero).val($(_this.seletor_hiddenPedidoCompradorNumero).val());
	        $(_this.seletor_input_alteracao_endereco_entrega_bairro).val($(_this.seletor_hiddenPedidoCompradorBairro).val());
	        $(_this.seletor_input_alteracao_endereco_entrega_cidade).val($(_this.seletor_hiddenPedidoCompradorMunicipio).val());
	        $(_this.seletor_select_alteracao_endereco_entrega_estado).val($(_this.seletor_hiddenPedidoCompradorEstado).val());
	        $(_this.seletor_input_alteracao_endereco_entrega_complemento).val($(_this.seletor_hiddenPedidoEnderecoComplemento).val());
	    }


	    _this.jqDivModalAlteracaoEntrega.modal();
	}
	, RequisicaoInfoEndereco: function (cep) {
	    var _this = this;

	    if (!_this.EmRequisicaoApiCEP) {
	        $.ajax({
	            method: 'POST',
	            url: _this.string_url_api_get_address_by_cep + '?cep=' + cep,
	            contentType: 'application/json',
	            data: JSON.stringify({ cep: cep }),
	            headers: oUtil.GetToken(),
	            beforeSend: function () {
	                $(_this.seletor_input_alteracao_endereco_entrega_cep).attr('disabled', true);
	                _this.LimparFormAlteracaoEnderecoEntrega();
	                _this.EmRequisicaoApiCEP = true;
	                oUtil.ShowLoader(true);
	            }
	        })
				.done(function (poJSON) {
				    _this.TratarRetornoAPIBuscaInfoCEP(poJSON);
				})
				.fail(function (jqXHR, textStatus) {
				    if (jqXHR.status == 401) {
				        console.log('TODO: TRATAR 401');
				        //document.location.href = _this.string_url_base_aplicacao;
				    }
				    //_this.TrataErroCart(jqXHR, textStatus); nao é necessário tratar erro porque essa API é o autocomplete do endereço

				})
				.always(function (jqXHR, textStatus) {
				    oUtil.ShowLoader(false);
				    $(_this.seletor_input_alteracao_endereco_entrega_cep).attr('disabled', false);
				    _this.EmRequisicaoApiCEP = false;
				})
	        ;
	    }
	}
	, ToogleInfoTransacaoCartao: function (isOnline) {
	    var _this = this;

	    if (!isOnline) {
	        if (!$(_this.seletor_div_checkout_transacao_fade_offline).is(':visible')) {
	            $(_this.seletor_div_checkout_transacao_fade_offline).fadeIn();
	        }
	    } else {
	        if ($(_this.seletor_div_checkout_transacao_fade_offline).is(':visible')) {
	            $(_this.seletor_div_checkout_transacao_fade_offline).fadeOut();
	        }
	    }
	}
	, ToogleBtnNaoSeiMeuCEP: function (isOnline) {
	    var _this = this;

	    if (isOnline) {
	        $(_this.seletor_btn_alteracao_endereco_entrega_nao_sei_meu_cep).fadeIn();
	    } else {
	        $(_this.seletor_btn_alteracao_endereco_entrega_nao_sei_meu_cep).fadeOut();
	    }
	}
    , GetListProducts: function () {

        var _this = this;

        var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno"));

        if (_this.ListaProdutos.length == 0) {

            var url_aux = oInicial.BaseUrlAplicacao;

            if (url_aux == "" || url_aux == undefined)
                url_aux = "/";

            jQuery.ajax({
                method: 'POST',
                url: _this.string_url_api_get_list_products + "?AlunoTurmaID=" + (dados != null ? dados.AlunoTurmaID.toString() : '0') + '&url_base=' + url_aux,
                data: {},
                headers: oUtil.GetToken(),

                beforeSend: function (jqXHR) {
                }
            })
                .done(function (poJSON) {

                    for (var i = 0; i < poJSON.List.length; i++) {
                        var item = _this.CreateItemListProduct();

                        item.Checked = poJSON.List[i].Checked;
                        item.ProductID = poJSON.List[i].ProductID;
                        item.NomeProduto = poJSON.List[i].ProductName;
                        item.UsaPrecoPorFoto = poJSON.List[i].UsaPrecoPorFoto;
                        item.Qtd = poJSON.List[i].Qtd;
                        item.QtdFoto = poJSON.List[i].QtdFoto;

                        item.ExibirCarrinho = poJSON.List[i].ExibirCarrinho;
                        item.ProdutoObrigatorio = poJSON.List[i].ProdutoObrigatorio;

                        item.QtdMaxFoto = poJSON.List[i].QtdMaxFoto;
                        item.QtdMinFoto = poJSON.List[i].QtdMinFoto;
                        item.PercentualDescarte = poJSON.List[i].PercentualDescarte;
                        item.AlbumID = poJSON.List[i].AlbumID;
                        item.param_selecao_fotos = poJSON.List[i].param_selecao_fotos;

                        _this.ListaProdutos.push(item);
                    }

                    if (poJSON.List.length > 0) {
                        _this.OrigemOnlineOffline = "ONLINE";
                    }

                    _this.ExibeProdutos();

                })
                .fail(function (jqXHR, textStatus) {
                    //console.log(jqXHR);
                    _this.TrataErroCart(jqXHR, textStatus);
                    //oUtil.ShowModalError("Erro ao buscar CEP", jqXHR.Message);                    
                })
                .always(function (jqXHR, textStatus) {
                })
        }
    }
    , ExibeProdutos: function () {

        var _this = this;

        for (var i = 0; i < _this.ListaProdutos.length; i++) {

            _this.EscreveLinhaTabela(i, _this.ListaProdutos[i]);
        }

        _this.jqThis.find(_this.seletor_chk_all).bind(_this.evento_click, function (e) {
            var obj = _this.jqThis.find(e.target);
            var prodID = obj.attr("data-product-id");
            var checked = obj.prop('checked');
            var qtdObj = _this.jqThis.find("#txt_" + prodID);
            var valAnterior = parseInt(qtdObj.val());

            if (checked == false) {
                qtdObj.val(0);
            } else if (checked == true && valAnterior == 0) {
                qtdObj.val(1);
            }

            _this.UpdateCartProducts(prodID);
            _this.CalculaValorTotal();
            return;
        });

        _this.jqThis.find(_this.seletor_qtd_item).bind(_this.evento_change, function (e) {
            var obj = _this.jqThis.find(e.target);
            var prodID = obj.attr("data-product-id");
            var checkObj = _this.jqThis.find(_this.seletor_chk_item + prodID);
            var valor = parseInt(obj.val());
            var minQtd = parseInt(obj.attr("min"));
            if (valor < minQtd) {
                return;
            }
            if (valor > 0) {
                checkObj.prop('checked', true);
            } else {
                checkObj.prop('checked', false);
            }

            _this.UpdateCartProducts(prodID);
            _this.CalculaValorTotal();
            return;
        });

        //executar scripts produtos obrigatorios                
        _this.CallSelectRequiredProducts();
        oUtil.RefactorMDL_JS();
        _this.OrdernarLinhasOcultas();
        oUtil.ShowLoader(false);
    }
    , EscreveLinhaTabela: function (idx, item) {

        var checked = (item.Checked ? "checked" : "");
        var _this = this;
        var class_required = ""
        var minQtd = 0;

        var nao_exibir = "";

        if (!item.ExibirCarrinho || item.Qtd == 0)
            nao_exibir = "style='display:none;'";

        //if (item.ProductID == 3688 || item.ProductID == 3690) {
        //    item.ProdutoObrigatorio = true;
        //}

        if (item.ProdutoObrigatorio && item.ExibirCarrinho) {
            class_required = "jqChkRequiredProduct";
            minQtd = 1;
            if (item.Qtd > 0) {
                checked = "checked";
            }
        }

        if (item.Qtd == 0) {
            nao_exibir = "style='display:none;'";
        }

        //console.log("item.ProdutoObrigatorio = " + item.ProdutoObrigatorio);

        var link_selecao_fotos = "-";

        if (oCheckout.OrigemOnlineOffline == "OFFLINE" && item.QtdMinFoto > 0) {
            link_selecao_fotos = "<a href='#' target='_self' id='" + oCheckout.seletor_link_fotos + item.ProductID + "' class='ancora-acao ancora-acao-visualizar ancora-acao-btn hidden' title='Visualizar'>Selecionar Fotos</a>";
        }
        else if (item.QtdMinFoto > 0) {
            link_selecao_fotos = "<a  href='#' id='" + oCheckout.seletor_link_fotos + item.ProductID + "' class='ancora-acao ancora-acao-visualizar ancora-acao-btn hidden'>Selecionar Fotos</a>";
        }

        disabledMin = "";
        if (item.Qtd == minQtd) {
            disabledMin = "disabled=disabled";
        }

        var aux = "<tr " + nao_exibir + " id='tbProd_tr_" + item.ProductID + "'>"
                   + "<td>"

				   + "<label class=\"LabelCheckProduct mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect\" for=\"chk_" + item.ProductID + "\">"
				   + "<input type=\"checkbox\" id=\"chk_" + item.ProductID + "\" class=\"mdl-checkbox__input jqCheckProduct " + class_required + "\" data-product-id=\"" + item.ProductID + "\" " + checked + " />"
				   + "<span class=\"mdl-checkbox__label\"></span>"
				   + "</label>"
                   + "</td>"
                   + "<td>"
                   + item.NomeProduto
                   + "</td>"
                   + "<td class=\"text-center\"> "
				   + "<div class=\"div-grupo-alterar-qtd\"> "
                   + "<div class=\"input-group\"><span class=\"input-group-btn hidden\"> "
                   + "<button type=\"button\" class=\"btn btn-danger btn-number btn-number-" + item.ProductID + "\" data-product-id='" + item.ProductID + "' data-type=\"minus\" data-field=\"quant[2]\" " + disabledMin + "> "
                   + "<span class=\"glyphicon glyphicon-minus\"></span> "
                   + "</button> "
                   + "</span> "
                   + "<input type=\"text\" name=\"quant[2]\" class=\"form-control input-number jqQtdProduct\" id='txt_" + item.ProductID + "' data-product-id='" + item.ProductID + "' value=" + item.Qtd + " min=\"" + minQtd + "\" max=\"1000\" readonly> "
                   + "<span class=\"input-group-btn hidden\"> "
                   + "<button type=\"button\" class=\"btn btn-success btn-number btn-number-" + item.ProductID + "\" data-product-id='" + item.ProductID + "' data-type=\"plus\" data-field=\"quant[2]\"> "
                   + "<span class=\"glyphicon glyphicon-plus\"></span> "
                   + "</button>"
                   + "</span></div>"
				   + "</div>"
                   + "</td>"
                   + "<td class=\"text-center\"><span id='spn_" + item.ProductID + "'>"
                   + item.QtdFoto
                   + "</span><br/>" + link_selecao_fotos + " </td>";

        //<input type='number' class='jqQtdProduct' id='txt_" + item.ProductID + "' min='0' max='1000' value='" + item.Qtd + "' data-product-id='" + item.ProductID + "' />"

        _this.jqThis.find(oCheckout.seletor_tabela_produtos + " tbody").append(aux);

        _this.jqThis.find("a[id='" + oCheckout.seletor_link_fotos + item.ProductID + "']").bind(_this.evento_click, function () {
            oUtil.ShowLoader(true);
            if (oCheckout.OrigemOnlineOffline == "OFFLINE") {
                _this.ViewProducts(item.ProductID, item.QtdMaxFoto, item.QtdMinFoto, item.PercentualDescarte, item.NomeProduto, item.ProductConfigID, item.Grupo);
            }
            else {
                window.location = _this.string_url_selecao_fotos_online + item.param_selecao_fotos;
            }
        });

    }
    , RecuperaEnderecoOffline: function () {

        var _this = this;
        var tableAluno = dbControl.v_GRD_ListaAlunos.Name;
        var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno"));

        var user = oOffline.getCookie(oCheckout.cookie_user_name);
        user = JSON.parse(user);

        var key = { AlunoID: Number(dados.AlunoID), TurmaID: Number(dados.TurmaID), BrandID: Number(user.Brand_ID) };

        dbControl.SelectByIndexComplex(tableAluno, key, function (result) {

            if (result && result.length > 0) {

                var endereco = {
                    Destinatario: result[0].NomeAluno,
                    AddressLine: result[0].AddressLine,
                    AddressNumber: result[0].AddressNumber,
                    AddressComplement: result[0].AddressComplement,
                    ZipCode: result[0].ZipCode,
                    Neighbourhood: result[0].Neighbourhood,
                    City: result[0].City,
                    State: result[0].State
                }

                _this.EscreveEndereco(endereco);
                _this.EscreveEnderecoComprador(endereco);
            }

        });

    }
    , EscreveEndereco: function (endereco) {

        var _this = this;

        $(_this.seletor_dados_pedido_endereco_destinatario).text(endereco.Destinatario);
        $(_this.seletor_dados_pedido_endereco_completo).text(endereco.AddressLine + ', ' + endereco.AddressNumber + ' - ' + (endereco.AddressComplement.length > 0 ? endereco.AddressComplement + ' - ' : '') + endereco.Neighbourhood + ' - ' + endereco.City + '/' + endereco.State);
        $(_this.seletor_dados_pedido_endereco_cep).text(endereco.ZipCode.substring(0, 5) + '-' + endereco.ZipCode.substring(5, 8));

        $(_this.seletor_hiddenPedidoEnderecoCEP).val(endereco.ZipCode);
        $(_this.seletor_hiddenPedidoEnderecoDestinatario).val(endereco.Destinatario);
        $(_this.seletor_hiddenPedidoEnderecoLogradouro).val(endereco.AddressLine);
        $(_this.seletor_hiddenPedidoEnderecoNumero).val(endereco.AddressNumber);
        $(_this.seletor_hiddenPedidoEnderecoComplemento).val(endereco.AddressComplement);
        $(_this.seletor_hiddenPedidoEnderecoBairro).val(endereco.Neighbourhood);
        $(_this.seletor_hiddenPedidoEnderecoMunicipio).val(endereco.City);
        $(_this.seletor_hiddenPedidoEnderecoEstado).val(endereco.State);

    }

    , EscreveEnderecoComprador: function (endereco) {

        var _this = this;
        var nome_cpf = "";

        if (endereco.Nome != undefined)
            nome_cpf = endereco.Nome;

        if (endereco.CpfCnpj != undefined)
            nome_cpf += " - " + endereco.CpfCnpj;

        $(_this.seletor_dados_pedido_comprador).text(nome_cpf);
        $(_this.seletor_dados_pedido_comprador_completo).text(endereco.AddressLine + ', ' + endereco.AddressNumber + ' - ' + (endereco.AddressComplement.length > 0 ? endereco.AddressComplement + ' - ' : '') + endereco.Neighbourhood + ' - ' + endereco.City + '/' + endereco.State);
        $(_this.seletor_dados_pedido_comprador_cep).text(endereco.ZipCode.substring(0, 5) + '-' + endereco.ZipCode.substring(5, 8));

        $(_this.seletor_hiddenPedidoCompradorCpfCnpj).val(endereco.CpfCnpj);
        $(_this.seletor_hiddenPedidoCompradorNome).val(endereco.Nome);
        $(_this.seletor_hiddenPedidoCompradorDDD).val(endereco.ddd);
        $(_this.seletor_hiddenPedidoCompradorTelefone).val(endereco.Telefone);
        $(_this.seletor_hiddenPedidoCompradorEmail).val(endereco.Email);
        $(_this.seletor_hiddenPedidoCompradorDataNascimento).val(endereco.DataNascimento);

        $(_this.seletor_hiddenPedidoCompradorCEP).val(endereco.ZipCode);
        $(_this.seletor_hiddenPedidoCompradorDestinatario).val(endereco.Destinatario);
        $(_this.seletor_hiddenPedidoCompradorLogradouro).val(endereco.AddressLine);
        $(_this.seletor_hiddenPedidoCompradorNumero).val(endereco.AddressNumber);
        $(_this.seletor_hiddenPedidoCompradorComplemento).val(endereco.AddressComplement);
        $(_this.seletor_hiddenPedidoCompradorBairro).val(endereco.Neighbourhood);
        $(_this.seletor_hiddenPedidoCompradorMunicipio).val(endereco.City);
        $(_this.seletor_hiddenPedidoCompradorEstado).val(endereco.State);

    }

    , RecuperaEnderecoOnline: function () {

        var _this = this;

        var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno"));

        $.ajax({
            method: 'POST',
            url: _this.string_url_api_get_address_aluno + '?AlunoTurmaID=' + (dados != null ? dados.AlunoTurmaID.toString() : '0'),
            data: {
            },
            headers: oUtil.GetToken(),
            beforeSend: function () {
            }
        })
            .done(function (poJSON) {

                if (poJSON.length > 0) {

                    var endereco = {
                        Destinatario: poJSON[0].NomeAluno,
                        AddressLine: poJSON[0].AddressLine,
                        AddressNumber: poJSON[0].AddressNumber,
                        AddressComplement: poJSON[0].AddressComplement,
                        ZipCode: poJSON[0].ZipCode,
                        Neighbourhood: poJSON[0].Neighbourhood,
                        City: poJSON[0].City,
                        State: poJSON[0].State
                    }

                    _this.EscreveEndereco(endereco);
                    _this.EscreveEnderecoComprador(endereco);
                }

            })
            .fail(function (jqXHR, textStatus) {
                if (jqXHR.status == 401) {
                    console.log('TODO: TRATAR 401');
                    //document.location.href = _this.string_url_base_aplicacao;
                }
                _this.TrataErroCart(jqXHR, textStatus);
            })
            .always(function (jqXHR, textStatus) {

            })
        ;

    }

    , RecuperaListaProductID: function () {

        var _this = this;

        _this.jqThis.find(_this.seletor_chk_all).each(function () {
            _this.ListaProdIDs.push(Number($(this).attr("data-product-id")));
        });

    }
    , RecuperaListaPrecoOffline: function () {

        var _this = this;
        var tableProd = dbControl.v_GRD_TabelaPreco.Name;
        var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno"));

        var user = oOffline.getCookie(oCheckout.cookie_user_name);
        user = JSON.parse(user);

        if (_this.ListaProdIDs.length == 0) {
            _this.RecuperaListaProductID();
        }

        dbControl.SelectALL(tableProd, function (result) {

            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {

                    if (result[i].BrandID == user.Brand_ID && result[i].TurmaID == dados.TurmaID && _this.ListaProdIDs.indexOf(result[i].ProductID) >= 0) {
                        _this.ListaPrecos.push(result[i]);
                    }

                }
            }

        });

    }
    , CalculaValorTotal: function () {

        var _this = this;
        var total = 0;
        var lista_produtos_aux = [];
        var numero_parcela = 0;
        var parcela_aux = "";

        switch (_this.FormaPgto.Nome) {
            case _this.string_pgto_cartao: //"cartao-credito":
                parcela_aux = _this.jqThis.find(_this.seletor_dadosPedidoPgtoCartaoParcelas).val();
                break;

            case _this.string_pgto_boleto: //"boleto":
                parcela_aux = _this.jqThis.find(_this.seletor_dadosPedidoPgtoBoletoQtdParcelas).val();
                break;

            case _this.string_pgto_cheque: //"cheque":
                parcela_aux = _this.jqThis.find(_this.seletor_parcelas_cheque).val();
                break;

            case _this.string_pgto_dinheiro: //"dinheiro":
                parcela_aux = "1";
                break;
        }

        if (!isNaN(parcela_aux)) {
            numero_parcela = Number(parcela_aux);
        }
        else {
            numero_parcela = 1;
        }

        _this.jqThis.find(_this.seletor_chk_all + ":checked").each(function () {
            var prodID = Number($(this).attr("data-product-id"));
            lista_produtos_aux.push(prodID);
        });

        for (var i = 0; i < _this.ListaPrecos.length; i++) {
            if (lista_produtos_aux.indexOf(_this.ListaPrecos[i].ProductID) >= 0 && _this.ListaPrecos[i].Parcela == numero_parcela) {

                var prod = _this.ListaPrecos[i].ProductID.toString();
                var qtd = Number(_this.jqThis.find(_this.seletor_txt_qtd_item + prod).val());
                var valor_aux = _this.ListaPrecos[i].Preco * qtd;

                if (_this.ListaPrecos[i].UsaPrecoPorFoto) {
                    var qtd_fotos = Number(_this.jqThis.find(_this.seletor_spn_qtd_fotos + prod).text());
                    valor_aux += (qtd_fotos * _this.ListaPrecos[i].PrecoFoto);
                }

                total += valor_aux;
            }
        }

        _this.jqThis.find(_this.seletor_valor_total).text(oUtil.toReal(total));
        _this.AtualizarTotalCheckout(total);
        _this.CalcularValorParcelas(total, numero_parcela);
    }
	, CalcularValorParcelas: function (Total, Qtd_Parcelas) {
	    var _this = this;
	    var Total = Total || 0.00;
	    var Qtd_Parcelas = Qtd_Parcelas || 0;
	    var TextoParcelas = '0x de R$ 0,00';
	    var ValorPorParcela = 0.00;


	    ValorPorParcela = (Total / Qtd_Parcelas).toFixedWithoutRound(2);
	    if (!isNaN(Number(ValorPorParcela))) {
	        if (Qtd_Parcelas != 0 && Total != 0) {
	            TextoParcelas = Qtd_Parcelas.toString() + 'x de ' + oUtil.toReal(ValorPorParcela);
	        }
	    }

	    switch (_this.FormaPgto.Nome) {
	        case _this.string_pgto_cartao:
	            _this.jqThis.find(_this.seletor_spanValorParcelasCartao).text(TextoParcelas);
	            break;
	        case _this.string_pgto_boleto:
	            _this.jqThis.find(_this.seletor_spanValorParcelasBoleto).text(TextoParcelas);
	            break;
	            //case _this.string_pgto_cheque:
	            //	break;
	            //case _this.string_pgto_dinheiro:
	            //	break;
	        default:
	            break;
	    }
	}
    , UpdateCartProducts: function (ProductID) {

        var _this = this;

        if (_this.OrigemOnlineOffline == "OFFLINE") {
            _this.UpdateCartProductOffline(ProductID);
        }
        else {
            _this.UpdateCartProductOnline(ProductID);
        }

    }
    , UpdateCartProductOffline: function (ProductID) {

        var _this = this;

        var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno")); //objeto definido na tela de aluno offline

        var objKey = {};

        objKey.AlunoTurmaID = Number(dados.AlunoTurmaID);
        objKey.ProductID = Number(ProductID);
        objKey.UserID = Number(dados.UserIdVendedor);

        dbControl.DeleteByIndexComplex(dbControl.GRD_CART_PRODUCT.Name, objKey, function () {

            var qtd = _this.jqThis.find(_this.seletor_txt_qtd_item + ProductID).val();

            if (_this.jqThis.find(_this.seletor_chk_item + ProductID).is(':checked') && (!isNaN(qtd))) {

                var qtd_fotos = _this.jqThis.find(_this.seletor_spn_qtd_fotos + ProductID).text();

                var objCart = {};
                objCart.AlunoTurmaID = objKey.AlunoTurmaID;
                objCart.BookID = 0;
                objCart.ID = objKey.ProductID;
                objCart.ProductID = objKey.ProductID;
                objCart.Qtd = Number(qtd);
                objCart.QtdFoto = Number(qtd_fotos);
                objCart.UserID = Number(objKey.UserID);

                dbControl.Insert(dbControl.GRD_CART_PRODUCT.Name, objCart, function () { });
            }

        });
    }
    , UpdateCartProductOnline: function (ProductID) {

        var user = oOffline.getCookie(oCheckout.cookie_user_name);
        user = JSON.parse(user);

        var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno"));

        var _this = this;
        var cart_item = {};
        var url = "";
        var qtd = _this.jqThis.find(_this.seletor_txt_qtd_item + ProductID).val();
        var qtd_fotos = _this.jqThis.find(_this.seletor_spn_qtd_fotos + ProductID).text();

        cart_item.AlunoTurmaID = Number(dados.AlunoTurmaID);
        cart_item.BookID = 0;
        cart_item.ID = 0;
        cart_item.ProductID = Number(ProductID);
        cart_item.QtdFoto = Number(qtd_fotos);
        cart_item.UserID = Number(user.User_ID);

        if (_this.jqThis.find(_this.seletor_chk_item + ProductID).is(':checked')) {
            url = _this.string_url_api_save_cartproduct;

            if (isNaN(qtd) || Number(qtd) == 0)
                return;
        }
        else {
            url = _this.string_url_api_delete_cartproduct;
        }

        cart_item.Qtd = Number(qtd);

        jQuery.ajax({
            method: 'POST',
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(cart_item),
            headers: oUtil.GetToken(),

            beforeSend: function (jqXHR) {
            }
        })
            .done(function (poJSON) {

            })
            .fail(function (jqXHR, textStatus) {
                //console.log(jqXHR);
                _this.TrataErroCart(jqXHR, textStatus);
            })
            .always(function (jqXHR, textStatus) {
            })
    }
    , ViewProducts: function (ProductID, QtdMaxFoto, QtdMinFoto, PercentualDescarte, NomeProduto, ProductConfigID, Grupo) {
        var _this = this;

        var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno")); //objeto definido na tela de aluno online / offline

        var user = oOffline.getCookie(oCheckout.cookie_user_name);
        user = JSON.parse(user);

        var oParametros = {
            AlbumID: dados.AlbumID
            , AlunoTurmaID: dados.AlunoTurmaID
            , AlunoTurmaID_Cript: dados.AlunoTurmaID_Cript
            , ProductID: ProductID
            , QtdMaxFoto: QtdMaxFoto
            , QtdMinFoto: QtdMinFoto
            , PercentualDescarte: PercentualDescarte
            , NomeProduto: NomeProduto
            , ProductConfigID: ProductConfigID
            , Grupo: Grupo
            , url_retorno: _this.string_url_checkout
        }
        sessionStorage.setItem(oOffline.cookie_validacao_fotos, JSON.stringify(oParametros))
        document.location.href = _this.string_url_selecao_fotos_offline;
    }
    , CreateItemListProduct: function () {

        return {
            Checked: false,
            ProductID: 0,
            NomeProduto: '',
            UsaPrecoPorFoto: false,
            Qtd: 0,
            QtdFoto: 0,
            ExibirCarrinho: false,
            ProdutoObrigatorio: false,
            QtdMaxFoto: 0,
            QtdMinFoto: 0,
            PercentualDescarte: 0,
            AlbumID: 0,
            param_selecao_fotos: false
        }

    }
    , RecuperaListaPrecoOnline: function () {

        _this = this;

        var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno")); //objeto definido na tela de aluno online / offline
        var user = oOffline.getCookie(oCheckout.cookie_user_name);
        user = JSON.parse(user);

        jQuery.ajax({
            method: 'POST',
            url: _this.string_url_api_get_lista_precos + "?brandID=" + user.Brand_ID + "&turmaID=" + dados.TurmaID,
            data: {},
            headers: oUtil.GetToken(),

            beforeSend: function (jqXHR) {
            }
        })
            .done(function (poJSON) {

                for (var i = 0; i < poJSON.List.length; i++) {
                    _this.ListaPrecos.push(poJSON.List[i]);
                }

            })
            .fail(function (jqXHR, textStatus) {
                //console.log(jqXHR)
                _this.TrataErroCart(jqXHR, textStatus);
            })
            .always(function (jqXHR, textStatus) {
            })

    }
	, GravarDadosSessionStorage: function () {
	    var _this = this;

	    var oDados = new checkout_classes_DadosConfirmacao(
			_this.objDadosPedido.origemOnLineOffline,
			_this.objDadosPedido.valorTotal,
			_this.objDadosPedido.Code != undefined ? _this.objDadosPedido.Code : _this.objDadosPedido.orderId.toString(), //TODO: TROCAR POR CODE
			_this.objDadosPedido.orderId,
			_this.FormaPgto.Nome
		);

	    var Dados = null;

	    try {
	        Dados = JSON.stringify(oDados);
	    } catch (e) {
	    }

	    if (Dados != null) {
	        window.sessionStorage.setItem(_this.string_ChaveSessionStorageDadosConclusao, Dados);
	    } else {
	        console.log('Dados não gravados no sessionStorage.');
	    }
	}
	, RedirecionarConfirmacaoPedido: function () {
	    var _this = this;

	    window.document.location = _this.string_url_confirm_page;
	}
    , RegistrarPedido: function (dadosPedido) {
        var _this = this;

        oUtil.ShowLoader(true);

        if (_this.ListaProdutos.length > 0) {
            jQuery.ajax({
                method: 'POST',
                url: _this.string_url_api_register_order,
                contentType: 'application/json',
                data: JSON.stringify(dadosPedido),
                headers: oUtil.GetToken(),
                beforeSend: function (jqXHR) {
                }
            })
                .done(function (poJSON) {

                    oUtil.ShowLoader(false);

                    _this.OrderID = Number(poJSON.Order.order_id);

                    if (poJSON.Order.Sucesso) {
                        _this.objDadosPedido = dadosPedido;
                        _this.objDadosPedido.orderId = _this.OrderID;
                        _this.objDadosPedido.Code = poJSON.Order.code;
                        _this.objDadosPedido.origemOnLineOffline = 'ONLINE';
                        _this.GravarDadosSessionStorage();
                        _this.RedirecionarConfirmacaoPedido();
                    }
                    else {
                        oUtil.ShowModalError(100, poJSON.Order.Mensagem, "", "Erro ao confirmar o pagamento.")
                    }

                })
                .fail(function (jqXHR, textStatus) {

                    var obj = jqXHR.responseJSON;

                    var mensagem = "Não foi possível registrar o pedido.";

                    if (obj.Mensagem != undefined && obj.Mensagem != "") {
                        mensagem += "\r\n " + obj.Mensagem;
                    }
                    var p_codError = obj.erro_id;
                    var p_MsgError = "";
                    var p_Data = "";
                    var titulo = "Erro ao registrar pedido";


                    oUtil.ShowModalError(p_codError, mensagem, p_Data, titulo)
                })
                .always(function (jqXHR, textStatus) {
                    oUtil.ShowLoader(false);
                })
        }

    }
    , RecuperaListaProdutos: function (dadosPedido, ListaProdutosSelecionados) {

        var _this = this;

        if (_this.OrigemOnlineOffline == "OFFLINE") {

            for (var i = 0; i < ListaProdutosSelecionados.length; i++) {

                var dados_produtos = new checkout_classes_DadosProdutos();

                dados_produtos.productId = ListaProdutosSelecionados[i].ProdID;
                dados_produtos.qtd = ListaProdutosSelecionados[i].Qtd;
                dados_produtos.listPhotoId = _this.ListaFotosProducts[dados_produtos.productId]; //Lista de fotos

                if (dados_produtos.qtd > 0)
                    dadosPedido.produtos.push(dados_produtos);
            }
        }
    }
    , RegistrarPedidoOffline: function (dadosPedido) {

        _this = this;

        var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno"));

        var pedido = new pedidos_pendentes_cls(dadosPedido,
                    dados.NomeAluno,
                    dados.NomeTurma,
                    oUtil.FormatDate3(new Date()),
                    "Pendente",
                    null,
                    0,
                    []);

        dbControl.Insert(dbControl.Orders_Pending.Name, pedido, function (result) {
            _this.objDadosPedido = dadosPedido;
            _this.objDadosPedido.origemOnLineOffline = 'OFFLINE';
            _this.GravarDadosSessionStorage();
            _this.RedirecionarConfirmacaoPedido();
        });

    }
    , TrataErroCart: function (jqXHR, textStatus) {
        var _this = this;
        //desabilitar btn concluir carrinho        
        _this.jqThis.find(_this.seletor_btn_concluir_compra).prop("disabled", true);
        oUtil.ShowModalError("", "", jqXHR);
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
    , CallSelectRequiredProducts: function () {
        var _this = this;
        _this.jqThis.find('.jqChkRequiredProduct').each(function () {
            var oThis = $(this);
            var prodID = oThis.attr("data-product-id");
            var oInput = _this.jqThis.find('#txt_' + prodID);
            var qtd = parseInt(oInput.val());
            if (qtd == 0) {
                oInput.val(1);
                oThis.click();
            }
            oThis.attr('disabled', 'disabled');
        });

    }
	, OrdernarLinhasOcultas: function () {
	    var _this = this;

	    var LinhasOcultas = _this.jqThis.find(_this.seletor_tabela_produtos).find('tbody tr').not(':visible');
	    _this.jqThis.find(_this.seletor_tabela_produtos).find('tbody tr').not(':visible').remove();
	    _this.jqThis.find(_this.seletor_tabela_produtos).find('tbody').append(LinhasOcultas);
	}
    , GoToProducts: function (url, urlOff) {
        if (oCheckout.OrigemOnlineOffline == "ONLINE") {
            document.location.href = url + "?a=" + sessionStorage.getItem("AlunoTurmaID_Cript2");
        } else {
            document.location.href = urlOff;
        }

    }
	, ValidarCPF_CNPJ: function () {
	    var _this = this;

	    jqElemento = $(_this.seletor_dados_pedido_comprador_CpfCnpj);
	    String_CPF_CNPJ = jqElemento.val().trim();

	    if (String_CPF_CNPJ.length > 0) {
	        if (String_CPF_CNPJ.length == 11 || String_CPF_CNPJ.length == 14) {
	            var Is_CPF_CNPJ_Valid = (String_CPF_CNPJ.length == 11) ? oUtil.validarCPF(String_CPF_CNPJ) : oUtil.validaCNPJ(String_CPF_CNPJ);
	            if (Is_CPF_CNPJ_Valid) {
	                $(_this.seletor_dados_pedido_comprador_CpfCnpj).removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid);
	            }
	            else {
	                $(_this.seletor_dados_pedido_comprador_CpfCnpj).removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
	            }
	        }
	        else {
	            $(_this.seletor_dados_pedido_comprador_CpfCnpj).removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
	        }
	    } else {
	        $(_this.seletor_dados_pedido_comprador_CpfCnpj).removeClass(_this.string_class_is_valid);
	    }

	}
    , ValidaEmailComprador: function () {

        var _this = this;

        var email = $(_this.seletor_dados_pedido_comprador_email).val();

        if (oUtil.IsValidEmail(email)) {
            $(_this.seletor_dados_pedido_comprador_email).removeClass(_this.string_class_is_invalid).addClass(_this.string_class_is_valid);
        }
        else {
            $(_this.seletor_dados_pedido_comprador_email).removeClass(_this.string_class_is_valid).addClass(_this.string_class_is_invalid);
        }

    }
    , ShowDataPicker: function () {
        //var _this = this;
        //var datapicker = _this.jqThis.find('#datePickerDataNascimento .datetimepicker');
        //datapicker.datetimepicker('show');

        jQuery('.datetimepicker').datetimepicker('show');
    }

    //Métodos - Fim
}

oOffline.verifyAcesso();

$(document).ready(function () {
    oCheckout.Carregar();
});


oOffline.CallbackVerifyOnline = function (isOnline) {
    oCheckout.ToogleInfoTransacaoCartao(isOnline);
    oCheckout.ToogleBtnNaoSeiMeuCEP(isOnline);
}

dbControl.CallbackOpenOnSuccess = function () {
    oCheckout.ValidarInformacoesPrimordiaisSessionStorage();

    var tableProd = dbControl.v_GRD_Products.Name;
    var dados = JSON.parse(sessionStorage.getItem("config_turma_aluno"));

    var user = oOffline.getCookie(oCheckout.cookie_user_name);
    user = JSON.parse(user);

    oCheckout.OrigemOnlineOffline = dados.Origem;

    var url_products = "";

    if (oCheckout.OrigemOnlineOffline == "ONLINE")
        url_products = oCheckout.string_url_produtos_online + "?a=" + dados.AlunoTurmaID_Cript;
    else
        url_products = oCheckout.string_url_produtos_offline;

    $(".nav-principal a[href='/Produtos']").attr("href", url_products);

    if (oCheckout.OrigemOnlineOffline == "OFFLINE") {

        dbControl.SelectALL(tableProd, function (result) {

            if (result && result.length > 0) {

                result = oUtil.SortByString(result, true, "NomeProduto");

                var listaProductIDsAux = [];

                for (var i = 0; i < result.length; i++) {

                    var key = { AlunoTurmaID: Number(dados.AlunoTurmaID), ProductID: result[i].ProductID, UserID: user.User_ID };
                    var tableCart = dbControl.GRD_CART_PRODUCT.Name;

                    var product = result[i];

                    var item = oCheckout.CreateItemListProduct();

                    item.Checked = false;
                    item.ProductID = product.ProductID;
                    item.NomeProduto = product.NomeProduto;
                    item.UsaPrecoPorFoto = product.UsaPrecoPorFoto;
                    item.ExibirCarrinho = product.ExibirCarrinho;
                    item.ExibirListaProdutos = product.ExibirListaProdutos;
                    item.ProdutoObrigatorio = product.ProdutoObrigatorio;

                    item.QtdMaxFoto = product.QtdMaxFoto;
                    item.QtdMinFoto = product.QtdMinFoto;
                    item.PercentualDescarte = product.PercentualDescarte;
                    item.AlbumID = product.AlbumID;
                    item.param_selecao_fotos = product.param_selecao_fotos;
                    item.ProductConfigID = product.ProductConfigID;
                    item.Grupo = product.Grupo;

                    oCheckout.ListaProdutos.push(item);
                    listaProductIDsAux.push(product.ProductID);
                    oCheckout.ListaFotosProducts[product.ProductID] = [];

                    dbControl.SelectByIndexComplex(tableCart, key, function (aux) {

                        if (aux && aux.length > 0) {
                            var prodID = aux[0].ProductID;
                            //oCheckout.jqThis.find(oCheckout.seletor_chk_item + prodID.toString()).prop('checked', true);
                            oCheckout.jqThis.find(oCheckout.seletor_chk_item + prodID.toString()).closest('label')[0].MaterialCheckbox.check();
                            oCheckout.jqThis.find(oCheckout.seletor_spn_qtd_fotos + prodID.toString()).text(aux[0].QtdFoto);
                            oCheckout.jqThis.find(oCheckout.seletor_txt_qtd_item + prodID.toString()).val(aux[0].Qtd == 0 ? 1 : aux[0].Qtd);
                            oCheckout.jqThis.find("#tbProd_tr_" + prodID.toString()).show();
                            //item.Checked = true;
                            //item.Qtd = aux[0].Qtd;
                            //item.QtdFoto = aux[0].QtdFoto
                        }

                    });

                }

                var tableProductPhoto = dbControl.GRD_ORDER_PRODUCT_PHOTOS.Name;

                //Lista de fotos por produtos
                dbControl.SelectALL(tableProductPhoto, function (aux) {

                    if (aux && aux.length > 0) {

                        for (var i = 0; i < aux.length; i++) {

                            if (aux[i].AlunoTurmaID == Number(dados.AlunoTurmaID) && listaProductIDsAux.indexOf(aux[i].ProductID) >= 0) {

                                oCheckout.ListaFotosProducts[aux[i].ProductID].push(aux[i].PhotoID);

                            }

                        }
                    }

                });

                oCheckout.ExibeProdutos();

                oCheckout.RecuperaEnderecoOffline();
                oCheckout.RecuperaListaPrecoOffline();
            }

            oCheckout.ValidarInformacoesPrimordiaisSessionStorage();
        });

    }
    else {
        $(document).ready(function () {
            oCheckout.GetListProducts();
            oCheckout.RecuperaEnderecoOnline();
            oCheckout.RecuperaListaPrecoOnline();
        });
    }
}