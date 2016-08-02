using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Filters;

namespace PH.Formatura.Log
{
	public class ErrorControl
	{
        private string strConn;

        public ErrorControl(string strConn)
        {
            this.strConn = strConn;
        }

        /// <summary>
        /// Inclui o registro do erro no BD
        /// </summary>
        /// <param name="context"></param>
        /// <param name="ex"></param>
        /// <returns></returns>
        public int RegisterError(Exception ex, string local_addr, bool isAPI, string url, int? userID, int? codErro, string PH_Aplicacao_ID)
        {
            int id = 0;
            try
            {
                id = IncluiBD(ex, local_addr, isAPI, url, userID, codErro, PH_Aplicacao_ID);

                return id;
            }
            catch (Exception)
            {
                return id;
            }
        }

        public int RegisterError(Exception ex, string local_addr, bool isAPI, string url, object data, int? userID, int? codErro, string PH_Aplicacao_ID)
        {
            int id = 0;
            try
            {
                id = IncluiBD(ex, local_addr, isAPI, url, data, userID, codErro, PH_Aplicacao_ID);

                return id;
            }
            catch (Exception)
            {
                return id;
            }
        }  

        /// <summary>
        /// Obtem o userID a partir de um token
        /// </summary>
        /// <param name="token"></param>
        /// <param name="strConn"></param>
        /// <returns></returns>
        public int? GetUserID(string token)
        {
            string sql = "select user_id  " +
                " from users u " +
                " INNER JOIN FB_UserToken f " +
                " on u.user_id = f.[User] " +
                " where f.token = @token ";
            int? userID = null;
            using (SqlConnection cn = new SqlConnection(strConn))
            {
                cn.Open();
                using (SqlCommand cmd = new SqlCommand(sql, cn))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.Add(new SqlParameter("@token", token));
                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                            userID = Convert.ToInt32(dr["user_id"]);
                    }
                }
            }
            return userID;
        }

        /// <summary>
        /// Insere um registro na tabela error_webAPI
        /// </summary>
        /// <param name="ex"></param>
        /// <param name="user_id"></param>
        /// <param name="strConn"></param>
        /// <returns></returns>
        public int IncluiBD(Exception ex, string ip_server, bool isAPI, string url, int? user_id, int? codErro, string PH_Aplicacao_ID)
        {
            string sql = "insert Log_Error " +
                " (data,userID,isAPI,url,ip_server,codErro,message,exception,PH_Aplicacao_ID) " +
                " values " +
                " (getdate(),@user_id,@isAPI,@url,@ip_server,@codErro,@message,@exception,@PH_Aplicacao_ID); " +
                " SELECT SCOPE_IDENTITY()            ";
            int id = 0;

            string data = string.Empty;
            if (ex.Data != null && ex.Data.Count > 0)
                data = Newtonsoft.Json.JsonConvert.SerializeObject(ex.Data);

            using (SqlConnection cn = new SqlConnection(strConn))
            {
                cn.Open();
                using (SqlCommand cmd = new SqlCommand(sql, cn))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.Add(new SqlParameter("@user_id", (object)user_id ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@isAPI", isAPI));
                    cmd.Parameters.Add(new SqlParameter("@url", url));
                    cmd.Parameters.Add(new SqlParameter("@ip_server", ip_server));
                    cmd.Parameters.Add(new SqlParameter("@codErro", (object)codErro ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@message", ex.Message.ToString()));
                    cmd.Parameters.Add(new SqlParameter("@exception", ex.ToString() + (!string.IsNullOrEmpty(data) ? " data = " + data : "")));
                    cmd.Parameters.Add(new SqlParameter("@PH_Aplicacao_ID", PH_Aplicacao_ID));
                    id = Convert.ToInt32(cmd.ExecuteScalar());
                }
            }
            return id;
        }

        public int IncluiBD(Exception ex, string ip_server, bool isAPI, string url, Object data, int? user_id, int? codErro, string PH_Aplicacao_ID)
        {
            string sql = "insert Log_Error " +
                " (data,userID,isAPI,url,ip_server,codErro,message,exception,PH_Aplicacao_ID) " +
                " values " +
                " (getdate(),@user_id,@isAPI,@url,@ip_server,@codErro,@message,@exception,@PH_Aplicacao_ID); " +
                " SELECT SCOPE_IDENTITY()            ";
            int id = 0;

            string json_data = "";

            if (data != null)
                json_data = Newtonsoft.Json.JsonConvert.SerializeObject(data);

            using (SqlConnection cn = new SqlConnection(strConn))
            {
                cn.Open();
                using (SqlCommand cmd = new SqlCommand(sql, cn))
                {
                    cmd.CommandType = CommandType.Text;
                    cmd.Parameters.Add(new SqlParameter("@user_id", (object)user_id ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@isAPI", isAPI));
                    cmd.Parameters.Add(new SqlParameter("@url", url));
                    cmd.Parameters.Add(new SqlParameter("@ip_server", ip_server));
                    cmd.Parameters.Add(new SqlParameter("@codErro", (object)codErro ?? DBNull.Value));
                    cmd.Parameters.Add(new SqlParameter("@message", ex.Message.ToString()));
                    cmd.Parameters.Add(new SqlParameter("@exception", ex.ToString() + (!string.IsNullOrEmpty(json_data) ? " data = " + json_data : "")));
                    cmd.Parameters.Add(new SqlParameter("@PH_Aplicacao_ID", PH_Aplicacao_ID));
                    id = Convert.ToInt32(cmd.ExecuteScalar());
                }
            }
            return id;
        }

        /// <summary>
        /// Resposta padrão para todo erro que acontece na aplicação exibindo inclusive o ID do erro da tabela "error_webAPI"
        /// </summary>
        /// <param name="context"></param>
        /// <param name="ex"></param>
        /// <param name="id"></param>
        public void ResponseError(HttpActionExecutedContext context, Exception ex, int id)
        {
            string str = Newtonsoft.Json.JsonConvert.SerializeObject(
                new
                {
                    Success = false,
                    IDError = id,
                    Message = ex.Message
                }
                );

            if (context.Exception is NotImplementedException)
                context.Response = new System.Net.Http.HttpResponseMessage(HttpStatusCode.NotImplemented);
            else
            {
                context.Response = new System.Net.Http.HttpResponseMessage(HttpStatusCode.InternalServerError) { Content = new StringContent(str) };
                context.Response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            }
        }

        public int? GetCodErro(Exception ex)
        {
            int? codErro = null;
            //if (ex is ITraceCustomException)
            //    codErro = ((ITraceCustomException)ex).cod_erro;
            return codErro;
        }
	}
}
