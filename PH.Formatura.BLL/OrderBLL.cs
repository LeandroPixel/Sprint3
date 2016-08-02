using Newtonsoft.Json.Linq;
using PH.Formatura.DAL;
using PH.Formatura.DTO.Checkout;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL
{
    public class OrderBLL : BaseBLL
    {
        public OrderBLL(PixelHouseDBEntities db)
			: base(db)
		{
		}

        public List<TipoPgto> GetTipoPgto()
        {
            return (from S in db.PaymentType
                    select new TipoPgto
                    {
                        id = S.id,
                        desc = S.titulo
                    }).ToList();
        }

        public JArray GetPedidosRealizados(int? UserIDvENDEDOR)
        {
            List<string> parametros = new List<string>();
            parametros.Add(UserIDvENDEDOR.ToString());
            StringBuilder query = new StringBuilder();
            query.Append(" select " + 
                " * " + 
                " from " + 
                " v_grd_vendedor_pedidos " +
                " where user_id = @param1 "+
                " order by Created desc ");
                        
            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }
    }
}
