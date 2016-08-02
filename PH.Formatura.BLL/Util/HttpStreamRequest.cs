using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Web;
using System.Net;
using System.IO;
using PH.Formatura.DTO;
using Newtonsoft.Json.Linq;

namespace PH.Formatura.BLL.Util
{
    public class HttpStreamRequest
    {
        public static StreamReader requestResponse(string url)
        {
            StreamReader reader = null;

            try
            {
                byte[] xmlByteArray = Encoding.ASCII.GetBytes("");

                HttpWebRequest POSTRequest = (HttpWebRequest)WebRequest.Create(url);
                POSTRequest.Method = "POST";
                POSTRequest.ContentType = "application/x-www-form-urlencoded";
                POSTRequest.KeepAlive = false;
                POSTRequest.Timeout = 60000;
                POSTRequest.ContentLength = xmlByteArray.Length;

                using (Stream stream = POSTRequest.GetRequestStream())
                {

                    stream.Write(xmlByteArray, 0, xmlByteArray.Length);
                }

                HttpWebResponse POSTResponse = (HttpWebResponse)POSTRequest.GetResponse();
                reader = new StreamReader(POSTResponse.GetResponseStream(), Encoding.UTF8);

            }
            catch (Exception ex)
            {
                throw new Exception(string.Format("Erro na requisição Http ({0}). ex: {1}", url, ex.Message));
            }

            return reader;

        }


        public static StreamReader HttpsRequestTaoPix(string url)
        {
            StreamReader reader = null;


            try
            {
                //Codigo para evitar que dê erro por conta de problemas com o certificado digital
                ServicePointManager.ServerCertificateValidationCallback +=
    new System.Net.Security.RemoteCertificateValidationCallback((sender, certificate, chain, policyErrors) => { return true; });

                byte[] xmlByteArray = Encoding.ASCII.GetBytes("");

                HttpWebRequest POSTRequest = (HttpWebRequest)WebRequest.Create(url);
                POSTRequest.Method = "GET";
                POSTRequest.KeepAlive = true;
                POSTRequest.Timeout = 3000;  //Tempo máximo de 3s

                HttpWebResponse POSTResponse = (HttpWebResponse)POSTRequest.GetResponse();
                reader = new StreamReader(POSTResponse.GetResponseStream(), Encoding.UTF8);

            }
            catch (Exception ex)
            {
                throw new Exception(string.Format("Erro na requisição Http ({0}). ex: {1}", url, ex.Message));
            }

            return reader;

        }


        private static StreamReader HttpRequest(string token, string url, Object ObjEnvio)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            //httpWebRequest.Timeout = 60000;
            httpWebRequest.Timeout = 180000;

            httpWebRequest.Headers.Add("AuthType", "Token");
            //httpWebRequest.Headers.Add("Content-Type", "Application/json");
            httpWebRequest.Headers.Add("AuthToken", token);

            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
               
                string json = Newtonsoft.Json.JsonConvert.SerializeObject(ObjEnvio);

                streamWriter.Write(json);
                streamWriter.Flush();
                streamWriter.Close();
                
            }

            try
            {
                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();

                var reader = new StreamReader(httpResponse.GetResponseStream(), Encoding.UTF8);
                
                return reader;
            }
            catch (WebException ex) {
                var resp = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();                
                ex.Data.Add("resp",resp);
                throw ex;
            }            
            //using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            //{
            //    var result = streamReader.ReadToEnd();
            //}
        }

        private static StreamReader HttpRequestForm(string token, string url, Dictionary<string,string> dados)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            httpWebRequest.ContentType = "application/x-www-form-urlencoded; charset=UTF-8";
            httpWebRequest.Method = "POST";
            httpWebRequest.Timeout = 60000;

            httpWebRequest.Headers.Add("AuthType", "Token");
            httpWebRequest.Headers.Add("AuthToken", token);

            string dadosForm = string.Empty;

            foreach (var x in dados)
            {
                if (!string.IsNullOrEmpty(dadosForm))
                    dadosForm += "&";

                dadosForm += x.Key.ToString() + "=" + x.Value.ToString();
            }

            var aux = Encoding.UTF8.GetBytes(dadosForm);

            httpWebRequest.ContentLength = aux.Length;
            
            using (var streamWriter = httpWebRequest.GetRequestStream())
            {
                //streamWriter.Write(dadosForm);
                streamWriter.Write(aux, 0, aux.Length);
                //streamWriter.Flush();
                streamWriter.Close();
            }
            
            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();

            var reader = new StreamReader(httpResponse.GetResponseStream(), Encoding.UTF8);

            return reader;

            //using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            //{
            //    var result = streamReader.ReadToEnd();
            //}
        }

        public static RetornoRequestAPI HttpCepAddress(string token, string url_CepAddress, string cep)
        {

            RetornoRequestAPI retorno = new RetornoRequestAPI();
            retornoApiAddress aux = new retornoApiAddress();

            try
            {

                Dictionary<string, string> FormAux = new Dictionary<string, string>();
                FormAux.Add("cep", cep);

                StreamReader reader = HttpRequestForm(token, url_CepAddress + "?cep="+cep, FormAux);
                string resultado = string.Empty;

                using (var streamReader = reader)
                {
                    resultado = streamReader.ReadToEnd();
                }

                if (!string.IsNullOrEmpty(resultado))
                    aux = Newtonsoft.Json.JsonConvert.DeserializeObject<retornoApiAddress>(resultado);

                retorno.StatusRetorno = StatusApiCart.Ok;
                retorno.Mensagem = "OK";

            }
            catch (Exception ex)
            {

                retorno.StatusRetorno = StatusApiCart.Erro;
                retorno.Mensagem = ex.Message;
            }


            retorno.objRetorno = aux.Address;

            return retorno;

        }

        public static RetornoRequestAPI HttpRegisterOrder(string token, string url_GetRegisterOrder, OrderFormatura order)
        {

            RetornoRequestAPI retorno = new RetornoRequestAPI();
            OrderFormatura aux = new OrderFormatura();

            try
            {

                StreamReader reader = HttpRequest(token, url_GetRegisterOrder, order);
                string resultado = string.Empty;

                using (var streamReader = reader)
                {
                    resultado = streamReader.ReadToEnd();
                }

                if (!string.IsNullOrEmpty(resultado))
                    aux = Newtonsoft.Json.JsonConvert.DeserializeObject<OrderFormatura>(resultado);

                retorno.StatusRetorno = StatusApiCart.Ok;
                retorno.Mensagem = "OK";

            }
            catch (WebException e) {
                retorno.StatusRetorno = StatusApiCart.Erro;
                string respTxt = e.Data["resp"] != null ? e.Data["resp"].ToString() : "";                
                string msg = "[1544] Erro ao finalizar o pedido";
                if (!string.IsNullOrEmpty(respTxt))
	            {                    
                    JObject resp = JObject.Parse(respTxt);
                    if (resp != null)
                    {
                        string msgAux = string.Empty;
                        msgAux = (string)resp["MsgError"];
                        if (string.IsNullOrEmpty(msgAux))
                            msgAux = (string)resp["Message"];
                        if (!string.IsNullOrEmpty(msgAux))
                            msg = msgAux;
                    }
	            }                
                retorno.Mensagem = msg;
            }
            catch (Exception ex)
            {

                retorno.StatusRetorno = StatusApiCart.Erro;
                retorno.Mensagem = ex.Message;
            }


            retorno.objRetorno = aux;

            return retorno;

        }
    }
}
