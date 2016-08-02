using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO.Checkout
{
	public class DadosCompra
	{
		public string cpfCnpj { get; set; }
		public List<DadosProdutos> produtos { get; set; }
		public GRD_Address endereco { get; set; }
		public int alunoTurmaId { get; set; }
		public int userId { get; set; }
		public decimal valorTotal { get; set; }
		public DadosPagamento pagamento { get; set; }
        public int OrderID { get; set; }
        public string Code { get; set; }
        public string OrigemOnLineOffLine { get; set; }
        public DadosComprador dadosComprador { get; set; }
        public string observacao { get; set; }
	}

	public class DadosProdutos
	{
		public int productId { get; set; }
		public int qtd { get; set; }
		public List<Int32> listPhotoId  { get; set; }
	}

	public class DadosPagamento
	{
		public int tipoId { get; set; }
		public int grupoId { get; set; }
		public int qtdParcelas { get; set; }
		public decimal valorTotal { get; set; }
		public DadosCartao dadosCartao { get; set; }
		public List<DadosCheque> dadosCheque { get; set; }
	}

	public class DadosCheque
	{
		public int parcela { get; set; }
		public string cmc7 { get; set; }
		public string cpfCnpj { get; set; }
		public string emitente { get; set; }
		public string telefone { get; set; }
		public decimal valor { get; set; }
		public DateTime dataVencimento { get; set; }
	}

	public class DadosCartao
	{
		public string numero { get; set; }
		public string nomeImpresso { get; set; }
		public string validadeMes { get; set; }
		public string validadeAno { get; set; }
		public string cvv { get; set; }
	}

    public class DadosComprador: GRD_Address {
        public string CpfCnpj { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string DDD { get; set; }
        public string Telefone { get; set; }
        public DateTime DataNascimento { get; set; }
    }
}