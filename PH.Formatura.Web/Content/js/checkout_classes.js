var checkout_classes_Endereco = function (_Title, _Receiver, _ZipCode, _AddressLine, _AddressNumber, _AddressComplement, _Neighbourhood, _City, _State, _Country) {
	this.Title = _Title || '';
	this.Receiver = _Receiver || '';
	this.ZipCode = _ZipCode || '';
	this.AddressLine = _AddressLine || '';
	this.AddressNumber = _AddressNumber || '';
	this.AddressComplement = _AddressComplement || '';
	this.Neighbourhood = _Neighbourhood || '';
	this.City = _City || '';
	this.State = _State || '';
	this.Country = _Country || '';
}

var checkout_classes_DadosProdutos = function (_productId, _qtd, _vListPhotoId) {
	this.productId = _productId || 0;
	this.qtd = _qtd || 0;
	this.listPhotoId = _vListPhotoId || [];
}

var checkout_classes_DadosCartao = function (_numero, _nomeImpresso, _validadeMes, _validadeAno, _cvv) {
	this.numero = _numero || '';
	this.nomeImpresso = _nomeImpresso || '';
	this.validadeMes = _validadeMes || '';
	this.validadeAno = _validadeAno || '';
	this.cvv = _cvv || '';
}

var checkout_classes_DadosCheque = function (_parcela, _cmc7, _cpfCnpj, _emitente, _telefone, _valor, _dataVencimento) {
	this.parcela = _parcela || 0;
	this.cmc7 = _cmc7 || '';
	this.cpfCnpj = _cpfCnpj || '';
	this.emitente = _emitente || '';
	this.telefone = _telefone || '';
	this.valor = _valor || 0.00;
	this.dataVencimento = _dataVencimento || '';
};

var checkout_classes_DadosPagamento = function (_tipoId, _grupoId, _qtdParcelas, _valorTotal, _DadosCartao, _vDadosCheque) {
	this.tipoId = _tipoId || 0;
	this.grupoId = _grupoId || 0;
	this.qtdParcelas = _qtdParcelas || 0;
	this.valorTotal = _valorTotal || 0.00;
	this.dadosCartao = _DadosCartao || {};
	this.dadosCheque = _vDadosCheque || [];
};

var checkout_classes_DadosCompra = function (_cpfCnpj, _alunoTurmaId, _userId, _vDadosProdutos, _Endereco, _valorTotal, _DadosPagamento, _orderId, _origemOnlineOffline, _DadosComprador, _Observacao) {
	this.cpfCnpj = _cpfCnpj || '';
	this.alunoTurmaId = _alunoTurmaId || 0;
	this.userId = _userId || 0;
	this.produtos = _vDadosProdutos || [];
	this.endereco = _Endereco || {};
	this.valorTotal = _valorTotal || 0.00;
	this.pagamento = _DadosPagamento || {};
	this.orderId = _orderId || 0;
	this.origemOnLineOffline = _origemOnlineOffline || "";
	this.dadosComprador = _DadosComprador || {};
	this.observacao = _Observacao || '';
};

var checkout_classes_DadosConfirmacao = function (_Origem, _ValorTotal, _Code, _OrderId, _FormaDePgto) {
	this.Origem = _Origem || '';
	this.ValorTotal = _ValorTotal || 0.00;
	this.Code = _Code || '';
	this.OrderId = _OrderId || 0;
	this.FormaDePgto = _FormaDePgto || '';
}

var pedidos_pendentes_cls = function (DadosCompra, NomeAluno, CodTurma, Data, StatusSync, DataConclusaoSync, NumTentativasSync, Erros) {
    this.DadosPgto = DadosCompra;
    this.NomeAluno = NomeAluno;
    this.CodTurma = CodTurma;
    this.Data = Data;
    this.StatusSync = StatusSync;
    this.DataConclusaoSync = DataConclusaoSync;
    this.NumTentativasSync = NumTentativasSync;
    this.Erros = Erros;    
}

var pedidos_pendentes_error_cls = function (id, data, erro) {
    this.id = id;
    this.data = data;
    this.erro = erro;    
}
var checkout_dados_comprador = function (_CpfCnpj, _Nome, _Email, _DDD, _Telefone, _DataNascimento, _Title, _Receiver, _ZipCode, _AddressLine, _AddressNumber, _AddressComplement, _Neighbourhood, _City, _State, _Country) {

    this.CpfCnpj = _CpfCnpj || '';
    this.Nome = _Nome || '';
    this.Email = _Email || '';
    this.DDD = _DDD || '';
    this.Telefone = _Telefone || '';
    this.DataNascimento = _DataNascimento || '';

    this.Title = _Title || '';
    this.Receiver = _Receiver || '';
    this.ZipCode = _ZipCode || '';
    this.AddressLine = _AddressLine || '';
    this.AddressNumber = _AddressNumber || '';
    this.AddressComplement = _AddressComplement || '';
    this.Neighbourhood = _Neighbourhood || '';
    this.City = _City || '';
    this.State = _State || '';
    this.Country = _Country || '';
}
