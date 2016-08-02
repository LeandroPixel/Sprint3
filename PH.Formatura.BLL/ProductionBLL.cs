using Newtonsoft.Json.Linq;
using PH.Formatura.BLL.Util;
using PH.Formatura.DAL;
using PH.Formatura.DTO.Production;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL
{
    public class ProductionBLL : BaseBLL 
    {
        public ProductionBLL(PixelHouseDBEntities db)
			: base(db)
		{
		}

        public JArray GetStatus(int? brandID, DateTime ini) {                         
            string query = " exec pr_grd_get_production_status " + 
                            " @BRAND_ID = @param1, " + 
                            " @DtIni = @param2 ";
            List<string> parametros = new List<string>();
            parametros.Add(brandID.ToString());
            parametros.Add(Format.DateToDBFormat(ini));
            JArray ret = SqlDynamic.Execute(db, query, parametros.ToArray());
            foreach (JObject item in ret)
            {
                if (item["Status"].ToString() == "20") // Rejeitado                
                    item.Add(new JProperty("MensagemRejeitado",GetMessagesErrorRejeitado(item["AlunoTurmaID"].ToString())));                                        
                
                item.Remove("AlunoTurmaID");
            }
            return ret;            
        }

        private JArray GetMessagesErrorRejeitado(string alunoTurmaID)
        {
            string query =  " SELECT Msg, PhotoDesc " + 
                            " FROM GRD_Process_Upload " +
                            " WHERE [Status] = 'ER' " + 
                            " AND alunoturmaID = @param1 " + 
                            " AND Origem <> 'PORFORA'";
            List<string> parametros = new List<string>();
            parametros.Add(alunoTurmaID);
            return SqlDynamic.Execute(db, query, parametros.ToArray());            
        }
    }
}
