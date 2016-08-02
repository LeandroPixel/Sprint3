using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PH.Formatura.DAL;
using PH.Formatura.DTO;
using PH.Core.Encryption;
using System.Text.RegularExpressions;
using PH.Formatura.BLL.Util;
using System.Transactions;
using System.Web;

namespace PH.Formatura.BLL
{
    public class UserBLL : BaseBLL
    {
        public UserBLL(PixelHouseDBEntities db)
            : base(db)
        {
        }

        public User Get(string Token)
        {
            User u = (
                        from UT in this.db.FB_UserToken
                        join U in this.db.Users on UT.User equals U.user_id
                        join V in this.db.V_NICKNAME_USER on U.user_id equals V.User_ID
                        join B in this.db.Brand on U.brand_id equals B.id
                        where UT.Token == Token
                        select new User()
                        {
                            User_ID = U.user_id,
                            Email = U.email,
                            Brand_ID = U.brand_id,
                            Name = U.name,
                            Nickname = V.Nick_name,
                            Token = UT.Token,
                            url_logo = B.url_logo,
                            Brand = B.name
                        }
                     ).FirstOrDefault();

            if (u == null)
                throw new Exception("Usuário não encontrado no BD");

            return u;
        }

        public void GravarAcesso(int user_id, DateTime dt_acesso, string ip_server, string remote_addr, string url_promocao = null)
        {
            try
            {
                var User = this.db.Users.Where(user => user.user_id == user_id).FirstOrDefault();
                if (User != null)
                {
                    User.DtUltimoAcesso = DateTime.Now;
                    User.num_acessos = (User.num_acessos == null ? 1 : (int)User.num_acessos + 1);
                    this.db.SaveChanges();
                }

                using (TransactionScope escopo = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions { IsolationLevel = IsolationLevel.RepeatableRead }))
                {
                    var obj = this.db.usuario_acesso.Create();
                    obj.user_id = user_id;
                    obj.dt_acesso = dt_acesso;
                    obj.url_promocao = url_promocao;
                    obj.ip_server = ip_server;
                    obj.remote_addr = remote_addr;
                    obj.id_acesso = this.db.usuario_acesso.Max(a => a.id_acesso) + 1;

                    this.db.usuario_acesso.Add(obj);
                    this.db.SaveChanges();

                    escopo.Complete();
                    escopo.Dispose();
                }
            }
            catch (Exception e)
            {

            }
        }

        public bool UsuarioValido(string email, string senha, int Brand_ID)
        {
            CriptografiaBLL BLLCrypt = new CriptografiaBLL();
            string SenhaEncryptada = BLLCrypt.Encrypt(senha, senha);

            int? user_id = (
                        from U in this.db.Users
                        where U.email == email && U.password == SenhaEncryptada && U.brand_id == Brand_ID
                        select U.user_id
                     ).FirstOrDefault();

            return user_id != null && user_id != 0;
        }

        public RetornoCadastrarUsuario CadastarUsuario(FormCadastrarUsuario Cadastro, int User_ID_Referal, int Brand_ID)
        {
            RetornoCadastrarUsuario Retorno = new RetornoCadastrarUsuario();
            Retorno.Sucesso = false;
            Retorno.Mensagem = String.Empty;

            Cadastro.email = Regex.Replace(Cadastro.email.Trim(), @"\s+", "");
            Cadastro.telefone = Regex.Replace(Cadastro.telefone.Trim().TrimStart('0'), @"\s+", "");
            Cadastro.nome = Cadastro.nome.Trim();

            bool EmailValido = this.db.Database.SqlQuery<bool>("SELECT oifotos.FN_VALIDA_EMAIL(@p0)", Cadastro.email).FirstOrDefault();
            bool TelefoneValido = ValidaTelefone.IsValid(Cadastro.telefone);
            bool SenhaValida = Cadastro.senha.Length >= 6;
            bool NomeValido = !String.IsNullOrEmpty(Cadastro.nome);
            bool BrandValido = Brand_ID > 0;

            if (!EmailValido) { Retorno.Mensagem += "- E-mail inválido;\n"; }
            if (!TelefoneValido) { Retorno.Mensagem += "- Telefone inválido;\n"; }
            if (!SenhaValida) { Retorno.Mensagem += "- Senha inválida;\n"; }
            if (!NomeValido) { Retorno.Mensagem += "- E-mail inválido;\n"; }
            if (!BrandValido) { Retorno.Mensagem += "- Brand_ID inválido."; }

            if (String.IsNullOrEmpty(Retorno.Mensagem))
            {
                try
                {
                    bool CadastroJaExistente = (from u in this.db.Users where u.email == Cadastro.email && u.brand_id == Brand_ID select u.email).FirstOrDefault() != null;

                    if (CadastroJaExistente) { throw new Exception("E-mail já cadastrado"); }

                    CriptografiaBLL BLLCrypt = new CriptografiaBLL();
                    string SenhaEncryptada = BLLCrypt.Encrypt(Cadastro.senha, Cadastro.senha);
                    DateTime Agora = DateTime.Now;

                    /*
                    //
                    // MÉTODO, QUE É CORRETO, NÃO UTILIZADO, PORQUE A MODELAGEM DO BANCO É ESCROTA
                    //
                    using (TransactionScope escopo = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions { IsolationLevel = IsolationLevel.RepeatableRead }))
                    {

                        var obj = this.db.Users.Create();
                        obj.email = Cadastro.email;
                        obj.password = SenhaEncryptada;
                        obj.register_date = Agora;
                        obj.DtUltimoAcesso = Agora;
                        obj.name = Cadastro.nome;
                        obj.accept_Newsletter = 0;
                        obj.accept_Promot_Info = 0;
                        obj.type = "incompleto";
                        obj.telefone = Cadastro.telefone;
                        obj.fl_nova_politica_site = 0;
                        obj.fl_ndr = "0";
                        obj.user_id_referral = User_ID_Referal;
                        obj.type_upload = "fl2";
                        obj.brand_id = Brand_ID;
                        //obj.user_id = (from u in this.db.Users orderby u.user_id descending select u.user_id).FirstOrDefault() + 1;
                        obj.user_id = this.db.Users.Max(u => u.user_id) + 1;
                        this.db.Users.Add(obj);
                        this.db.SaveChanges();

                        if (this.db.Users.Where(u => u.user_id == obj.user_id).FirstOrDefault() != null)
                        {
                            Retorno.Sucesso = true;
                            Retorno.Mensagem = "Usuário cadastrado com sucesso";
                        }
                        */

                    //MARRETA
                    var User_ID_Cadastrado = this.db.pr_mob_user_insert(
                            Cadastro.email,
                            Brand_ID,
                            SenhaEncryptada,
                            Cadastro.nome,
                            null,
                            null,
                            null,
                            0,
                            0,
                            Cadastro.telefone,
                            "ALBUNS",
                            null,
                            null
                        ).FirstOrDefault();
                    this.db.SaveChanges();

                    if (User_ID_Cadastrado != null)
                    {
                        int User_ID;

                        if (!Int32.TryParse(User_ID_Cadastrado.Value.ToString(), out User_ID))
                            User_ID = 0;

                        var Usuario = this.db.Users.Where(u => u.user_id == User_ID).Select(u => u).FirstOrDefault();
                        if (Usuario != null)
                        {
                            Usuario.user_id_referral = User_ID_Referal;
                            this.db.SaveChanges();

                            Retorno.Sucesso = true;
                            Retorno.Mensagem = "Usuário cadastrado com sucesso";
                        }
                    }

                    //FIM MARRETA
                    /*
                    escopo.Complete();
                    escopo.Dispose();
                }*/
                }
                catch (System.Data.Entity.Infrastructure.DbUpdateException e)
                {
                    if (e.InnerException != null)
                        if (e.InnerException.InnerException != null)
                            if (e.InnerException.InnerException.Data != null)
                                if (e.InnerException.InnerException.Data["HelpLink.EvtID"] != null)
                                {
                                    int EvtID;
                                    Int32.TryParse(e.InnerException.InnerException.Data["HelpLink.EvtID"].ToString(), out EvtID);

                                    switch (EvtID)
                                    {
                                        case 2627:
                                            Retorno.Mensagem = "Cadastro já existente. Erro 2627";
                                            break;
                                        default:
                                            Retorno.Mensagem = "Erro ao inserir registro no bd";
                                            break;
                                    }
                                }

                    if (String.IsNullOrEmpty(Retorno.Mensagem))
                        Retorno.Mensagem = e.Message;
                }
                catch (Exception e)
                {
                    Retorno.Mensagem = "Erro ao cadastrar. " + e.Message + (e.InnerException != null ? " . Detalhes: " + e.InnerException.ToString() : "");
                }
            }

            return Retorno;
        }

        public RetoronoEsqueciMinhaSenhaAlterar EsqueciMinhaSenhaAlterar(string hash, string password)
        {
            RetoronoEsqueciMinhaSenhaAlterar Resultado = new RetoronoEsqueciMinhaSenhaAlterar();

            var DadosUser = (
                        from U in this.db.User_Forgot_Password
                        where U.Hash == hash && U.Dt_Verificacao_Hash != null && U.Dt_Alteracao_Senha == null && U.Fl_Ativo == true
                        select U
                     ).FirstOrDefault();

            if (DadosUser == null)
            {
                Resultado.Mensagem = "Hash inválido";
            }
            else
            {
                CriptografiaBLL BLLCrypt = new CriptografiaBLL();
                string SenhaEncryptada = BLLCrypt.Encrypt(password, password);

                try
                {
                    var Alteracao = this.db.PR_USER_ALTERA_SENHA(DadosUser.User_ID, SenhaEncryptada).FirstOrDefault();
                    DateTime HoraAlteracao = DateTime.Now;
                    this.db.SaveChanges();

                    Resultado.Sucesso = Alteracao.Sucesso.HasValue ? Alteracao.Sucesso.Value : false;
                    Resultado.Mensagem = Alteracao.Mensagem;

                    if (Resultado.Sucesso)
                    {
                        DadosUser.Dt_Alteracao_Senha = HoraAlteracao;
                        this.db.SaveChanges();
                    }
                }
                catch (Exception e)
                {
                    Resultado.Mensagem = "Erro ao alterar senha: " + e.Message;
                }
            }

            return Resultado;
        }

        public DadosValidacaoHash ValidarAlteracaoSenhaHash(string hash, bool MarcarVerificacao)
        {
            //CriptografiaBLL BLLCrypt = new CriptografiaBLL();
            DadosValidacaoHash Retorno = new DadosValidacaoHash();
            Retorno.Sucesso = false;

            var DadosHash = (
                        from U in this.db.User_Forgot_Password
                        where U.Hash == hash && U.Fl_Ativo == true
                        select U
                     ).FirstOrDefault();

            if (DadosHash != null)
            {
                Double Hash_Esqueci_Senha_Tempo_Validade_Minutos = 0;
                Double.TryParse(System.Web.HttpContext.Current.Application["Hash_Esqueci_Senha_Tempo_Validade_Minutos"].ToString(), out Hash_Esqueci_Senha_Tempo_Validade_Minutos);

                DateTime Dt_Validade = DateTime.Now.AddMinutes(-Hash_Esqueci_Senha_Tempo_Validade_Minutos);

                bool ValidacaoVerificacao = (MarcarVerificacao ? DadosHash.Dt_Verificacao_Hash == null : true);

                if (DadosHash.Dt_Inclusao >= Dt_Validade && ValidacaoVerificacao)
                {
                    var DadosUltimoHash = (
                        from U in this.db.User_Forgot_Password
                        where U.User_ID == DadosHash.User_ID && U.Fl_Ativo == true
                        orderby U.Dt_Inclusao descending
                        select U
                     ).FirstOrDefault();

                    if (DadosHash.Hash == DadosUltimoHash.Hash)
                    {
                        try
                        {
                            DadosUltimoHash.Dt_Verificacao_Hash = DateTime.Now;
                            this.db.SaveChanges();
                            Retorno.Sucesso = true;
                            Retorno.Mensagem = "Link válido";
                            Retorno.hash = DadosHash.Hash;
                        }
                        catch (Exception e)
                        {
                            Retorno.Mensagem = "Erro ao verificar link";
                        }
                    }
                    else
                    {
                        Retorno.Mensagem = "Link inválido. Verifique se é o último link gerado";
                    }
                }
                else
                {
                    Retorno.Mensagem = "Link expirado";
                }
            }
            else
            {
                Retorno.Mensagem = "Link inválido";
            }

            return Retorno;
        }

        public RetornoEsqueciSenha EsqueciMinhaSenha(string email, int brand_id, string ip)
        {
            //CriptografiaBLL BLLCrypt = new CriptografiaBLL();
            RetornoEsqueciSenha Retorno = new RetornoEsqueciSenha();
            Retorno.Sucesso = false;

            var Usuario = (
                        from U in this.db.Users
                        where U.email == email && U.brand_id == brand_id
                        select new
                        {
                            user_id = U.user_id,
                            email = U.email,
                            nome = U.name,
                            nickname = U.nick_name
                        }
                     ).FirstOrDefault();

            if (Usuario != null)
            {
                bool LOG_EMAIL_ESQUECI_SENHA = Convert.ToBoolean(System.Web.HttpContext.Current.Application["LOG_EMAIL_ESQUECI_SENHA"].ToString());
                string PATH_LOG_EMAIL_ESQUECI_SENHA = @System.Web.HttpContext.Current.Application["PATH_LOG_EMAIL_ESQUECI_SENHA"].ToString();

                EmailBLL bll = new EmailBLL(this.db, LOG_EMAIL_ESQUECI_SENHA, PATH_LOG_EMAIL_ESQUECI_SENHA);
                Retorno = bll.SendMailForgotPassword(Usuario.user_id, Usuario.email, Usuario.nome, Usuario.nickname, ip);
            }
            else
            {
                Retorno.Mensagem = "E-mail inválido";
            }

            return Retorno;
        }


        public void CadastrarSenhaVendedor(int VendedorID)
        {
            RetornoEsqueciSenha Retorno = new RetornoEsqueciSenha();
            Retorno.Sucesso = false;

            var Usuario = (
                        from U in this.db.Users
                        join V in this.db.GRD_Vendedor on U.user_id equals V.UserID
                        where V.ID == VendedorID
                        select new
                        {
                            user_id = U.user_id,
                            email = U.email,
                            nome = U.name,
                            nickname = U.nick_name
                        }
                     ).FirstOrDefault();

            if (Usuario != null)
            {
                bool LOG_EMAIL_ESQUECI_SENHA = Convert.ToBoolean(System.Web.HttpContext.Current.Application["LOG_EMAIL_ESQUECI_SENHA"].ToString());
                string PATH_LOG_EMAIL_ESQUECI_SENHA = @System.Web.HttpContext.Current.Application["PATH_LOG_EMAIL_ESQUECI_SENHA"].ToString();

                EmailBLL bll = new EmailBLL(this.db, LOG_EMAIL_ESQUECI_SENHA, PATH_LOG_EMAIL_ESQUECI_SENHA);
                Retorno = bll.SendMailForgotPassword(Usuario.user_id, Usuario.email, Usuario.nome, Usuario.nickname, "IP", 68);
            }

            if (!Retorno.Sucesso)
            {
                throw new Exception("Problemas ao enviar email!");
            }

        }

        public RetornoDadosBrand RetornarDadosBrand(string Brand_Hash)
        {
            CriptografiaBLL BLLCrypt = new CriptografiaBLL();

            string KeyCripto;
            int Brand_ID = 5;

            try
            {
                if (Regex.IsMatch(Brand_Hash, @"\A\b[0-9a-fA-F]+\b\Z"))
                {
                    KeyCripto = System.Web.HttpContext.Current.Application["KeyPixel"].ToString();
                    Int32.TryParse(BLLCrypt.Decrypt(Brand_Hash, KeyCripto), out Brand_ID);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            RetornoDadosBrand DadosBrand = new RetornoDadosBrand();
            if (Brand_ID != null)
            {
                DadosBrand = (
                        from B in this.db.Brand
                        where B.id == Brand_ID
                        select new RetornoDadosBrand()
                        {
                            id = B.id,
                            isNicephotosLogin = B.isNicephotosLogin,
                            name = B.name,
                            url_logo = B.url_logo
                        }
                    ).FirstOrDefault();
            }

            return DadosBrand;
        }

        public PH.Core.ViewModels.Common.User Authenticate(string userName, string password, bool isEncripted = false)
        {
            password = (isEncripted ? password : new RC4(password).Encript(password));
            //Find user in database using Email and Password

            //AsNoTracking sendo usado para substituir o MergeOption.notracking
            var user = this.db.Users.AsNoTracking().FirstOrDefault(x => x.email == userName && x.password == password);

            if (user != null)
            {
                return new PH.Core.ViewModels.Common.User(user.user_id, user.nick_name, user.name, user.email, "", user.brand_id);
            }
            else
                return null;
        }

        public PH.Core.ViewModels.Common.User TokenAuth(string token, TimeSpan timeout)
        {
            PH.Core.ViewModels.Common.User user = PH.Core.Cache.CacheRepository.Get<PH.Core.ViewModels.Common.User>(token);

            if (user == null)
            {
                int UserID = this.db.FB_UserToken.AsNoTracking().Where(x => x.Token == token && DateTime.Compare(x.Expiration, DateTime.Now) > 0).Select(x => x.User).FirstOrDefault();
                if (UserID > 0)
                {
                    token = TokenAuth(UserID, timeout); //Update the token on database
                    //HIGH: May degrade the performance on database if cache is off

                    Users dbUser = this.db.Users.AsNoTracking().Where(x => x.user_id == UserID).FirstOrDefault();
                    PH.Core.ViewModels.Common.User usu = new PH.Core.ViewModels.Common.User(dbUser.user_id, dbUser.nick_name, dbUser.name, dbUser.email, token, dbUser.brand_id);
                    PH.Core.Cache.CacheRepository.CreateOrUpdate<PH.Core.ViewModels.Common.User>(token, usu, timeout);
                    return usu;
                }
            }
            else
                if (user != null)
                    PH.Core.Cache.CacheRepository.CreateOrUpdate<PH.Core.ViewModels.Common.User>(token, user, timeout);

            return user;
        }

        public PH.Core.ViewModels.Common.User TokenAuth(string userName, string password, TimeSpan timeout, bool isEncripted = true)
        {
            password = (isEncripted ? password : new RC4(password).Encript(password));
            //Find user in database using Email and Password            
            var user = this.db.Users.AsNoTracking().FirstOrDefault(x => x.email == userName && x.password == password);

            if (user != null)
            {
                string token = TokenAuth(user.user_id, timeout);
                PH.Core.ViewModels.Common.User usu = new PH.Core.ViewModels.Common.User(user.user_id, user.nick_name, user.name, user.email, token, user.brand_id);
                if (!string.IsNullOrEmpty(token))
                    PH.Core.Cache.CacheRepository.CreateOrUpdate<PH.Core.ViewModels.Common.User>(token, usu, timeout);

                return usu;
            }
            else
                return null;
        }

        private string GenerateToken()
        {
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(Guid.NewGuid() + DateTime.Now.ToString()));
        }

        public string TokenAuth(int userId, TimeSpan timeout)
        {
            if (userId == 0)
                throw new ArgumentNullException("User cannot be null to autenticate!");

            //Get user Auth token in db if exist
            var Auth = (from A in this.db.FB_UserToken
                        where A.User == userId
                        select A).FirstOrDefault();

            if (Auth == null)
            {
                //Generate a Token to the user, using a Guid, the email/username and adding
                //the FormsAuthentication Timeout as Expiration                
                Auth = new FB_UserToken(); //Create a new Auth class
                Auth.Token = GenerateToken(); //Set Token to the database Auth
                Auth.User = userId; //Set the login user to Auth
                Auth.Expiration = DateTime.Now.Add(timeout); //Set token Timeout
                Auth.Date_Auth = DateTime.Now; //Set Authentication Date to Now
                this.db.FB_UserToken.Add(Auth); //Add to database collection                
            }
            else if (DateTime.Now > Auth.Expiration)
            {
                //alteracao fernando criar o novo token                                 
                Auth.Token = GenerateToken();
                Auth.Expiration = DateTime.Now.Add(timeout); //Update token Expiration
                Auth.Date_Auth = DateTime.Now; //Update authentication date
            }
            else
            {//If exist a token, validate it
                Auth.Expiration = DateTime.Now.Add(timeout); //Update token Expiration
                Auth.Date_Auth = DateTime.Now; //Update authentication date

            }
            this.db.SaveChanges(); //Save changes in database

            return Auth.Token;
        }

        public string ReTokenAuth(string token, TimeSpan timeout)
        {
            var obj = (from A in this.db.FB_UserToken
                       from U in this.db.Users
                       where A.Token == token
                       && U.user_id == A.User
                       select new
                       {
                           userID = U.user_id,
                           NickName = U.nick_name,
                           Name = U.name,
                           Email = U.email,
                           Auth = A,
                           Brand_ID = U.brand_id
                       }
                        ).FirstOrDefault();

            if (obj != null)
            {
                obj.Auth.Expiration = DateTime.Now.Add(System.Web.Security.FormsAuthentication.Timeout);
                obj.Auth.Date_Auth = DateTime.Now;
                PH.Core.ViewModels.Common.User usu = new PH.Core.ViewModels.Common.User(obj.userID, obj.NickName, obj.Name, obj.Email, token, obj.Brand_ID);
                PH.Core.Cache.CacheRepository.CreateOrUpdate<PH.Core.ViewModels.Common.User>(token, usu, timeout);
                this.db.SaveChanges();
                return token;
            }
            else
            {
                return null;
            }
        }

        public void SetCookieUser(string userCookie)
        {
            string cookieName = System.Web.HttpContext.Current.Application["Cookie_User_Offline"].ToString();
            HttpCookie myCookie = System.Web.HttpContext.Current.Request.Cookies[cookieName] ?? new HttpCookie(cookieName);
            myCookie.Value = userCookie;
            myCookie.Expires = DateTime.Now.AddMonths(1);
            System.Web.HttpContext.Current.Response.Cookies.Add(myCookie);
        }

        public string getMD5Hash(string input)
        {
            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString();
        }
    }
}
