using Newtonsoft.Json.Linq;
using PH.Formatura.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL
{
    public class PrecosBLL : BaseBLL
    {
        public PrecosBLL(PixelHouseDBEntities db)
			: base(db)
		{
		}

        public JArray Get(int brandID)
        {
            List<string> parametros = new List<string>();
            parametros.Add(brandID.ToString());
            StringBuilder query = new StringBuilder();
            query.Append(" select * " +
                        " from v_GRD_TabelaPreco " +
                        " where brandID = @param1 ");

            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }

        public JArray Get(int brandID, int turmaID)
        {
            List<string> parametros = new List<string>();
            parametros.Add(brandID.ToString());
            parametros.Add(turmaID.ToString());
            StringBuilder query = new StringBuilder();
            query.Append(" select * " +
                        " from v_GRD_TabelaPreco " +
                        " where brandID = @param1 AND TurmaID = @param2 ");

            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }
    }
}
