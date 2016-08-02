using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PH.Formatura.DAL;
using PH.Formatura.DTO;

namespace PH.Formatura.BLL.Util
{
    public class Map
    {
		//public static Orders ToOrders(OrderNew order)
		//{
		//	Orders o = new Orders()
		//	{
		//		user_id = order.UserID,
		//		last_changed_by = order.UserID,
		//		total_value = order.TotalValue,
		//		nu_parcelas = order.nParcelas
		//	};
		//	o.order_payment_relation = new List<order_payment_relation>();
		//	foreach (var item in order.OrderPayments)
		//	{
		//		o.order_payment_relation.Add(new order_payment_relation()
		//		{
		//			type = item.PaymentType,
		//			cod_transacao = item.TransactionCode,
		//			value = item.Valor
		//		});
		//	}
		//	return o;
		//}

		//public static orders_pf ToOrdersPF(string CPF_CNPJ)
		//{
		//	orders_pf op = new orders_pf()
		//	{
		//		cpf = CleanString.CleanStringOfNonDigits(CPF_CNPJ)
		//	};
		//	return op;
		//}

		//public static List<Order_Lines> ToOrderLines(List<pPlanoPrePago> planosFoto, List<pPlanoPrePagoFotolivro> planosFotolivro,AmpliaPrazoExp amplia)
		//{
		//	List<Order_Lines> orderLines = new List<Order_Lines>();
		//	if (planosFoto != null)
		//	{
		//		foreach (var item in planosFoto)
		//		{
		//			orderLines.Add(new Order_Lines()
		//			{
		//				detail_info_id = item.IDPromo,
		//				quantity = item.Qtd,
		//				product_id = item.productID.Value
		//			});
		//		}    
		//	}

		//	if (planosFotolivro != null)
		//	{
		//		foreach (var item in planosFotolivro)
		//		{
		//			orderLines.Add(new Order_Lines()
		//			{
		//				detail_info_id = item.IDPromo,
		//				quantity = item.Qtd,
		//				product_id = item.productID.Value
		//			});
		//		}
		//	}
		//	if (amplia != null)
		//	{
		//		orderLines.Add(new Order_Lines(){
		//			detail_info_id = amplia.id_promo,
		//			quantity = amplia.Qtd,
		//			product_id = amplia.ProductID
		//		});
		//	}
		//	return orderLines;
		//}

		//public static void ToOrders(Orders order,OrderNewProducts o)
		//{
		//	order.val_fotoalbum = o.TotalFotolivros;
		//	order.val_fotoprodutos = o.TotalFotoprodutos;
                        
		//	order.freight = o.cep_info.Preco;
		//	order.frete_envelopes = o.cep_info.Opcoes[o.cep_info.Tipo].Envelopes;
		//	order.frete_peso = o.cep_info.Peso;
		//	order.frete_prazo = o.cep_info.PrazoFinal;
		//	order.frete_tipo = o.cep_info.Tipo.Substring(0,1);
		//	order.sub_tipo_frete = o.cep_info.Opcoes[o.cep_info.Tipo].SubTipo;

		//	order.Order_Addresses = new List<Order_Addresses>();
		//	order.Order_Addresses.Add(new Order_Addresses()
		//	{
		//		address_id = o.Address.ID,
		//		address_line = o.Address.Logradouro,
		//		city = o.Address.Municipio,
		//		COMPLEMENT = o.Address.Complemento,
		//		neighbourhood = o.Address.Bairro,
		//		NUMBER = o.Address.Numero,
		//		Receiver = o.Address.Destinatario,
		//		state = o.Address.UF,
		//		zip_code = o.Address.CEP                
		//	});            
		//}

		//public static List<Order_Lines> ToOrderLines(List<CartItems> ProdutosInfo)
		//{
		//	List<Order_Lines> orderLines = new List<Order_Lines>();
		//	if (ProdutosInfo != null)
		//	{
		//		foreach (var item in ProdutosInfo)
		//		{
		//			orderLines.Add(new Order_Lines()
		//			{
		//				detail_info_id = item.PhotoID > 0 ? item.PhotoID : item.BookID,                        
		//				quantity = item.Quantity,
		//				product_id = item.ProductID,
		//				order_line_id = item.ItemID
		//			});
		//		}
		//	}            
		//	return orderLines;
		//}

		//public static List<order_payment_photo_products> ToPaymentPhotoProducts(List<ItemListProductDiscount> ProdutosInfo)
		//{
		//	List<order_payment_photo_products> list = new List<order_payment_photo_products>();

		//	//Obter os descontos
		//	var productsGrouped = (from P in ProdutosInfo.Where(o => o.Type != 0 && o.Type != 2)
		//							 group P by new { P.Type } into G
		//							 select new order_payment_photo_products{
		//								 desc_total = G.Sum(o => (o.ValCompraSemDesconto - (o.ValPago + o.ValCover + o.ValPage))),
		//								 product_type_id = G.Key.Type,
		//								 valor_total = G.Sum(o=>o.ValCompraSemDesconto),                                         
		//							 }
		//							 ).ToList();

		//	foreach (var item in productsGrouped)
		//	{
		//		list.Add(item);                
		//	}
            
		//	return list;
		//}

        

        
    }
}
