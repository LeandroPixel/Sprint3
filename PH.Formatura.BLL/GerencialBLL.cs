using Newtonsoft.Json.Linq;
using PH.Formatura.DAL;
using PH.Formatura.DTO.Supervisor;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PH.Formatura.BLL
{
	public class GerencialBLL : BaseBLL
	{
		public GerencialBLL(PixelHouseDBEntities db): base(db){
		}

		public JArray ListPedidos(int brandID){
			List<string> parametros = new List<string>();
			parametros.Add(brandID.ToString());
			StringBuilder query = new StringBuilder();
			query.Append("select * from v_grd_vendedor_pedidos where brand_id = @param1 order by created desc"
			);

			return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());   
		}

		public JArray ListFotosPedidos(int brandID){
			List<string> parametros = new List<string>();
			parametros.Add(brandID.ToString());
			StringBuilder query = new StringBuilder();
			query.Append("exec pr_GRD_ger_ObtemFotosPedidos @param1");

			return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
		}

        public JArray ListFotosPedido(int OrderID)
        {
            List<string> parametros = new List<string>();
            parametros.Add(OrderID.ToString());
            StringBuilder query = new StringBuilder();
            query.Append("select * from v_GRD_ObtemFotosPedido where orderid = @param1 order by NomeProduto");

            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }

		public JArray ListFaturamentoDiario(int brandID){
			return ListFaturamento(brandID, "D");
		}

		public JArray ListFaturamentoMensal(int brandID){
			return ListFaturamento(brandID, "M");
		}

		private JArray ListFaturamento(int brandID, string periodo){
			List<string> parametros = new List<string>();
			parametros.Add(brandID.ToString());
			parametros.Add(periodo);
			StringBuilder query = new StringBuilder();
			query.Append("exec pr_grd_ger_pedidos_aprovados @param2, @param1");

			return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
		}

		public JArray ListIntegracaoCP7Vendas(int brandID)
		{
			List<string> parametros = new List<string>();
			parametros.Add(brandID.ToString());
			StringBuilder query = new StringBuilder();
			query.Append("exec pr_grd_ger_integracao_cp7_vendas @param1");

			return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
		}

        public JArray ListIntegracaoCP7VendasPedido(int OrderID)
        {
            List<string> parametros = new List<string>();
            parametros.Add(OrderID.ToString());
            StringBuilder query = new StringBuilder();
            query.Append("select * from v_grd_ger_integracao_cp7_vendas where order_id = @param1 order by order_id desc");

            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }

		public JArray ListIntegracaoCP7VendasItens(int brandID)
		{
			List<string> parametros = new List<string>();
			parametros.Add(brandID.ToString());
			StringBuilder query = new StringBuilder();
			query.Append("exec pr_grd_ger_integracao_cp7_vendas_itens @param1");

			return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
		}

		public JArray ListIntegracaoCP7VendasParcela(int brandID)
		{
			List<string> parametros = new List<string>();
			parametros.Add(brandID.ToString());
			StringBuilder query = new StringBuilder();
			query.Append("exec pr_grd_ger_integracao_cp7_vendas_parcela @param1");

			return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
		}

        public JArray ListIntegracaoCP7VendasParcelaPedido(int OrderID)
        {
            List<string> parametros = new List<string>();
            parametros.Add(OrderID.ToString());
            StringBuilder query = new StringBuilder();
            query.Append("select * from v_grd_ger_integracao_cp7_vendas_parcela where order_id = @param1 order by order_id desc");

            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }

        public JArray ListIntegracaoCP7VendasItensPedido(int OrderID)
        {
            List<string> parametros = new List<string>();
            parametros.Add(OrderID.ToString());
            StringBuilder query = new StringBuilder();
            query.Append("select * from v_grd_ger_integracao_cp7_vendas_itens where order_id = @param1 order by order_id desc");

            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }
	}
}