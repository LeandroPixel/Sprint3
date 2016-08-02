using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DAL
{
    public class SqlDynamic
    {
        public static JArray Execute(PixelHouseDBEntities db, string nameTableOrView)
        {
            List<SqlParameter> lista = new List<SqlParameter>();
            string query = "Select * from {0} ";
            return DynamicSQLQuery.ExecuteSql(db, lista, String.Format(query, nameTableOrView));
        }

        public static JArray Execute(PixelHouseDBEntities db, string query, params string[] parametros)
        {
            List<SqlParameter> lista = new List<SqlParameter>();
            for (int i = 0; i < parametros.Length; i++)
                lista.Add(new SqlParameter("param" + (i + 1), parametros[i]));
            return DynamicSQLQuery.ExecuteSql(db, lista, query);
        }
    }
}
