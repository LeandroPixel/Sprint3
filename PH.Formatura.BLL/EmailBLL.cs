using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Reflection;
using PH.Util.SendMail;
using PH.Formatura.DTO;
using PH.Formatura.DAL;
using PH.Formatura.Cache;
using PH.Formatura.BLL.Util;

namespace PH.Formatura.BLL
{
    public class EmailBLL : BaseBLL
    {
        private bool ativaLogTxt;
        private string pathLogTxt;
        public EmailBLL(PixelHouseDBEntities db, bool ativaLogTxt, string pathLogTxt, CacheRepositorio cacheRep = null)
            : base(db, cacheRep)
        {
            this.ativaLogTxt = ativaLogTxt;
            string path = Path.Combine(pathLogTxt, Format.Ano(DateTime.Now));
            path = Path.Combine(path, Format.Mes(DateTime.Now));
            path = Path.Combine(path, Format.Dia(DateTime.Now));
            this.pathLogTxt = path;
        }

        private DadosGenerateUniqueHashForgotPassword GenerateUniqueHashForgotPassword(int user_id, string email, string ip)
        {
            DadosGenerateUniqueHashForgotPassword DadosHash = new DadosGenerateUniqueHashForgotPassword();
            DadosHash.Sucesso = false;

            string guid = String.Empty;
            int tentativas_max = 10;
            int tentativas = 0;

            CriptografiaBLL bll = new CriptografiaBLL();

            var ConsultaRequicisaoUsuario = (
                from U in this.db.User_Forgot_Password
                where U.User_ID == user_id && U.Fl_Ativo == true
                orderby U.Dt_Inclusao descending
                select U
            ).FirstOrDefault();

            while (!DadosHash.Sucesso && tentativas <= tentativas_max)
            {
                guid = Guid.NewGuid().ToString();
                DadosHash.hash = bll.Encrypt(guid, guid);
                bool RegistroExiste = !String.IsNullOrEmpty(this.db.User_Forgot_Password.Where(u => u.Hash == DadosHash.hash).Select(u => u.Hash).FirstOrDefault());
                if (!RegistroExiste)
                    DadosHash.Sucesso = true;

                tentativas++;
            }

            if (DadosHash.Sucesso)
            {
                try
                {
                    var obj = this.db.User_Forgot_Password.Create();
                    obj.User_ID = user_id;
                    obj.Email = email;
                    obj.Hash = DadosHash.hash;
                    obj.Dt_Inclusao = DateTime.Now;
                    obj.Fl_Ativo = true;
                    obj.Host = ip;

                    this.db.User_Forgot_Password.Add(obj);
                    this.db.SaveChanges();
                }
                catch (Exception e)
                {
                    throw new Exception("Erro ao salvar hash: " + e.Message);
                }
            }
            else
            {
                DadosHash.hash = null;
            }

            return DadosHash;
        }

        private string GetUrlAlterarSenha(int user_id, string email, string ip)
        {
            string Url = String.Empty;
            DadosGenerateUniqueHashForgotPassword DadosHash = GenerateUniqueHashForgotPassword(user_id, email, ip);

            if (DadosHash != null)
            {
                Url += System.Web.HttpContext.Current.Application["Site_URL_HTTP"].ToString();
                Url += "/Login/EsqueciMinhaSenha/?hash=";
                Url += DadosHash.hash;
                return Url;
            }
            else
            {
                return null;
            }
        }

        public bool SendMail(int user_id, string email, string assunto, string nome, string nickname, string urlSite, int template_id)
        {
            User DadosUsuario = new User();
            DadosUsuario = new User { User_ID = user_id, Email = email, Name = GetNameOrNick(nome, nickname) };

            Dictionary<string, string> dadosEmail = new Dictionary<string, string>();

            dadosEmail.Add("{$NOME}", DadosUsuario.Name);
            dadosEmail.Add("{$URL_SITE}", System.Web.HttpContext.Current.Application["Site_URL_HTTP"].ToString());

            string htmlEmail = string.Empty;
            htmlEmail = GetEmail(template_id);

            foreach (var item in dadosEmail)
                htmlEmail = htmlEmail.Replace(item.Key, item.Value);

            htmlEmail = htmlEmail.Replace("<ul", "{$crlf}<ul");
            htmlEmail = htmlEmail.Replace("<table", "{$crlf}<table");
            htmlEmail = htmlEmail.Replace("{$crlf}", Environment.NewLine);

            LogEmail(htmlEmail, assunto, user_id);

            return Send(email, assunto, htmlEmail, user_id);
        }

        public void SendMail(int user_id, string email, string nome, int template_id, Dictionary<string, string> dadosEmail)
        {

            var template = db.template_email_mkt.Where(i => i.id == template_id).FirstOrDefault();

            if (template != null && (!string.IsNullOrEmpty(template.html)))
            {

                string htmlEmail = string.Empty;
                htmlEmail = template.html;

                foreach (var item in dadosEmail)
                    htmlEmail = htmlEmail.Replace(item.Key, item.Value);

                htmlEmail = htmlEmail.Replace("<ul", "{$crlf}<ul");
                htmlEmail = htmlEmail.Replace("<table", "{$crlf}<table");
                htmlEmail = htmlEmail.Replace("{$crlf}", Environment.NewLine);

                LogEmail(htmlEmail, template.assunto, user_id);

                Send(email, template.assunto, htmlEmail, user_id);

            }

        }

        /// <summary>
        /// Envia um e-mail de esqueci minha senha
        /// </summary>
        /// <param name="user_id">User_ID do usuário</param>
        /// <param name="email">E-mail do usuário</param>
        /// <param name="nome">Nome do usuário</param>
        /// <param name="nickname">Apelido do usuário</param>
        /// <returns>Retorna true se o envio do e-mail foi feito com sucesso</returns>
        public RetornoEsqueciSenha SendMailForgotPassword(int user_id, string email, string nome, string nickname, string ip, int templateID = 0)
        {
            RetornoEsqueciSenha Retorno = new RetornoEsqueciSenha();
            Retorno.Sucesso = false;
            User DadosUsuario = new User();
            DadosUsuario = new User { User_ID = user_id, Email = email, Name = GetNameOrNick(nome, nickname) };

            int Requisicao_Intevalo_Minimo_Minutos = Convert.ToInt32(System.Web.HttpContext.Current.Application["Hash_Esqueci_Senha_Tempo_Requisicao_Intevalo_Minimo_Minutos"].ToString());

            int template_id;

            if (templateID == 0)
            {
                Int32.TryParse(System.Web.HttpContext.Current.Application["Email_Esqueci_Senha_Template_ID"].ToString(), out template_id);
            }
            else
            {
                template_id = templateID;
            }

            DateTime Dt_Intervalo = DateTime.Now.AddMinutes(-(double)Requisicao_Intevalo_Minimo_Minutos);
            var RequicisaoForaDoIntervaloMinimo = (
                    from U in this.db.User_Forgot_Password
                    where (U.User_ID == DadosUsuario.User_ID || U.Host == ip) && (U.Dt_Inclusao > Dt_Intervalo)
                    select U
                ).FirstOrDefault();

            if (RequicisaoForaDoIntervaloMinimo == null)
            {
                string url_alterar_senha = GetUrlAlterarSenha(DadosUsuario.User_ID, DadosUsuario.Email, ip);
                Dictionary<string, string> dadosEmail = new Dictionary<string, string>();

                dadosEmail.Add("{$NOME}", DadosUsuario.Name);
                dadosEmail.Add("{$URL_SITE}", System.Web.HttpContext.Current.Application["Site_URL_HTTP"].ToString());
                dadosEmail.Add("{$URL_ALTERAR_SENHA}", !String.IsNullOrEmpty(url_alterar_senha) ? System.Web.HttpUtility.HtmlEncode(url_alterar_senha) : String.Empty);

                string htmlEmail = String.Empty;
                string assunto = String.Empty;
                htmlEmail = GetEmail(template_id);
                assunto = GetSubject(template_id);

                foreach (var item in dadosEmail)
                    htmlEmail = htmlEmail.Replace(item.Key, item.Value);

                htmlEmail = htmlEmail.Replace("<ul", "{$crlf}<ul");
                htmlEmail = htmlEmail.Replace("<table", "{$crlf}<table");
                htmlEmail = htmlEmail.Replace("{$crlf}", Environment.NewLine);

                LogEmail(htmlEmail, assunto, user_id);

                bool EnviouEmail = Send(email, assunto, htmlEmail, user_id);

                Retorno.Sucesso = EnviouEmail;
                Retorno.Mensagem = (EnviouEmail) ? "E-mail enviado.\nVerifique sua caixa de entrada." : "Falha ao enviar e-mail.\nTente novamente mais tarde";
            }
            else
            {
                Retorno.Mensagem = "Por favor, aguarde " + Requisicao_Intevalo_Minimo_Minutos.ToString() + " minuto(s) para fazer outra requisição.";
            }

            return Retorno;
        }

        /// <summary>
        /// Obtem o NickName ou primeiro nome do usuário
        /// </summary>
        /// <param name="name"></param>
        /// <param name="nick"></param>
        /// <returns></returns>
        private string GetNameOrNick(string name, string nick)
        {
            if (!string.IsNullOrEmpty(nick))
            {
                return nick;
            }
            else
            {
                int indexEspaco = name.IndexOf(" ");
                if (indexEspaco == -1)
                    return name;
                else
                    return name.Substring(0, indexEspaco);
            }
        }

        /// <summary>
        /// Obtem o e-mail da tabela "template_email_mkt"
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        private string GetEmail(int id)
        {
            return (this.db.template_email_mkt.Where(o => o.id == id).Select(o => o.html).FirstOrDefault());
        }

        /// <summary>
        /// Obtem o assunto na tabela "template_email_mkt"
        /// </summary>
        /// <param name="id">Template_ID</param>
        /// <returns>Assunto</returns>
        private string GetSubject(int id)
        {
            return (this.db.template_email_mkt.Where(t => t.id == id).Select(t => t.assunto).FirstOrDefault());
        }

        /// <summary>
        /// Método de callback do envio de e-mail assincrono
        /// </summary>
        /// <param name="result"></param>
        private void OnEnvioCompleto(EmailAsyncResult result)
        {
            if (result.status == status.ok)
            {
                //LogEmail("envio OK",Guid.NewGuid().ToString(),0,0);
                //Console.WriteLine("mensagem enviada....");
            }
            else
            {
                //LogEmail("Erro", Guid.NewGuid().ToString(), 0, 0);
                //Console.WriteLine("Ops! houve um erro....");
                //Console.WriteLine(" ");
                //Console.WriteLine(result.mensagem);
            }
        }

        /// <summary>
        /// Método que cria um arquivo de texto 
        /// </summary>
        /// <param name="html"></param>
        /// <param name="assunto"></param>
        /// <param name="userID"></param>
        private void LogEmail(string html, string assunto, int userID)
        {
            if (ativaLogTxt)
            {
                try
                {
                    if (!Directory.Exists(pathLogTxt))
                    {
                        DirectoryInfo dir = new DirectoryInfo(pathLogTxt);
                        dir.Create();
                    }
                    string pathfile = Path.Combine(pathLogTxt, Format.DataLog(DateTime.Now) + "_userID-" + userID + "_assunto-" + assunto + ".txt");
                    using (StreamWriter log = new StreamWriter(pathfile, true))
                        log.WriteLine(html);
                }
                catch (Exception e)
                {
                    throw new Exception("Erro ao gravar o log de email - pathLogTxt:" + pathLogTxt + " - " + e.ToString());
                }
            }
        }

        private bool Send(string email, string assunto, string htmlEmail, int userID)
        {
            bool Sucesso = false;
            try
            {
                Email mail = new Email(email);
                Sucesso = mail.send(assunto, htmlEmail);
            }
            catch (Exception e)
            {
                throw new Exception("Erro ao enviar email - email:" + email + " assunto:" + assunto + " - userID: " + userID + " - " + e.ToString());
            }

            return Sucesso;
        }

        private async void SendAsync(string email, string assunto, string htmlEmail, int orderID, int userID)
        {
            try
            {
                Email mail = new Email(email);
                mail.EmailResult += new Email.OnEmailCallBackResult(OnEnvioCompleto);
                await mail.sendAsync(assunto, htmlEmail);
            }
            catch (Exception e)
            {
                throw new Exception("Erro ao enviar email - email:" + email + " assunto:" + assunto + " - userID: " + userID + " - " + e.ToString());
            }
        }
    }
}
