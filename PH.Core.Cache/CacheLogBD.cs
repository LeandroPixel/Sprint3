using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace PH.Core.Cache
{
    public static class CacheLogBD
    {
        private readonly static string strConn = ConfigurationManager.AppSettings["ConnError"].ToString();
        private readonly static bool saveBDOnError = Convert.ToBoolean(ConfigurationManager.AppSettings["Cache_SaveBDOnError"].ToString());
        private readonly static int PH_Aplicacao_ID = Convert.ToInt32(ConfigurationManager.AppSettings["PH_Aplicacao_ID"].ToString());

        private static void SaveBD(Exception ex, string message, int typeLogID)
        {
            try
            {
                if (saveBDOnError == false)
                    return;

                string sql = "insert Log_Cache " +
                    " (data,TypeLogID,message,exception,PH_Aplicacao_ID, ip_server) " +
                    " values " +
                    " (getdate(),@TypeLogID,@message,@exception,@PH_Aplicacao_ID,@ip_server); " +
                    " SELECT SCOPE_IDENTITY()            ";                

                string data = string.Empty;
                if (ex != null && ex.Data != null && ex.Data.Count > 0)
                    data = Newtonsoft.Json.JsonConvert.SerializeObject(ex.Data);

                string ip = TryGetIP();

                using (SqlConnection cn = new SqlConnection(strConn))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand(sql, cn))
                    {
                        string exceptionStr = ex != null ? ex.ToString() + (!string.IsNullOrEmpty(data) ? " data = " + data : "") : string.Empty;
                        cmd.CommandType = CommandType.Text;
                        cmd.Parameters.Add(new SqlParameter("@TypeLogID", typeLogID));                        
                        cmd.Parameters.Add(new SqlParameter("@message", message));                        
                        cmd.Parameters.Add(new SqlParameter("@exception",  (object) exceptionStr ?? DBNull.Value));
                        cmd.Parameters.Add(new SqlParameter("@PH_Aplicacao_ID", PH_Aplicacao_ID));
                        cmd.Parameters.Add(new SqlParameter("@ip_server", (object)ip ?? DBNull.Value));                        
                        cmd.ExecuteNonQuery();                        
                    }
                }                
            }catch(Exception e){
                Logger.Log.Info("CacheLogBD.SaveBD" + e.ToString());
            }
        }

        public static void LogInfo(string message)
        {
            SaveBD(null, message, 3);
        }

        public static void Error(Exception ex,string message)
        {
            SaveBD(ex, message, 1);
        }

        private static string TryGetIP()
        {
            string ip_server = string.Empty;            
            IPHostEntry host;            
            host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (IPAddress ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)                
                    ip_server = ip.ToString();                
            }
            return ip_server;
        }
    }
}
