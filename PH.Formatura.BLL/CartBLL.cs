using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PH.Formatura.DAL;
using PH.Formatura.Cache;
using PH.Formatura.DTO;
using PH.Formatura.BLL.Util;
using PH.Formatura.DTO.Checkout;
using System.Text.RegularExpressions;
using PH.Formatura.Log;
using System.Data.Entity.Core.Objects;
using PH.Core.Encryption;

namespace PH.Formatura.BLL
{
    public class CartBLL: BaseBLL
    {
        public CartBLL(PixelHouseDBEntities db, CacheRepositorio cacheRep = null, int userID = 0)
            : base(db, cacheRep)
        {
        }

        public Address GetAddress(string cep, string token)
        {

            string urlGetAddress = System.Configuration.ConfigurationManager.AppSettings["Cart.API.BuscaAddress"].ToString();

            RetornoRequestAPI infoAux = HttpStreamRequest.HttpCepAddress(token, urlGetAddress, cep);

            Address retorno = new Address();

            if (infoAux.StatusRetorno == StatusApiCart.Ok)
            {
                retorno = (Address)infoAux.objRetorno;
            }
            else {

                throw new Exception("Não foi possível recuperar o endereço");
            }

            return retorno;
        }

        private void GravarDadosCart(DadosCompra dadosCompra) {

            if (dadosCompra.OrigemOnLineOffLine == "OFFLINE")
            {

                if (dadosCompra.produtos != null && dadosCompra.produtos.Count() > 0) {

                    //var cart = db.GRD_Cart_Product.Where(c => c.AlunoTurmaID == dadosCompra.alunoTurmaId && c.UserID == dadosCompra.vendedorId).ToList();
                    //var photos = db.GRD_Order_Product_Photos.Where(p => p.AlunoTurmaID == dadosCompra.alunoTurmaId).ToList();
                    //
                    //db.GRD_Cart_Product.RemoveRange(cart);
                    //db.GRD_Order_Product_Photos.RemoveRange(photos);

                    db.Database.ExecuteSqlCommand("delete from GRD_Cart_Product where AlunoTurmaID = {0} and UserID = {1}", dadosCompra.alunoTurmaId, dadosCompra.userId);
                    db.Database.ExecuteSqlCommand("delete from GRD_Order_Product_Photos where AlunoTurmaID = {0}", dadosCompra.alunoTurmaId);

                    db.SaveChanges();

                    dadosCompra.produtos.ForEach(p => {

                        var item = db.GRD_Cart_Product.Create();

                        item.AlunoTurmaID = dadosCompra.alunoTurmaId;
                        item.ProductID = p.productId;
                        item.Qtd = p.qtd;
                        item.QtdFoto = 0;
                        //Tratamento para produtos sem foto
                        if (p.listPhotoId != null) item.QtdFoto = p.listPhotoId.Count();                        
                        item.UserID = dadosCompra.userId;
                        db.GRD_Cart_Product.Add(item);

                        //Tratamento para produtos sem foto
                        if (p.listPhotoId != null)
                        {
                            p.listPhotoId.ForEach(i =>
                            {
                                var item_photo = db.GRD_Order_Product_Photos.Create();
                                item_photo.AlunoTurmaID = item.AlunoTurmaID;
                                item_photo.PhotoID = i;
                                item_photo.ProductID = item.ProductID;

                                db.GRD_Order_Product_Photos.Add(item_photo);
                            });
                        }

                        db.SaveChanges();
                    });

                }
            }

        }

        private void ValidarDados(DadosCompra dadosCompra) {

            var turma = db.GRD_Aluno_Turma.Where(i=>i.ID==dadosCompra.alunoTurmaId).FirstOrDefault();

            if (turma == null)
                throw new ArgumentException("Identificador de Aluno/Turma inválido. ID: " + dadosCompra.alunoTurmaId.ToString());

            var dados = (from p in db.v_GRD_TabelaPreco
                         join d in db.GRD_Cart_Product
                         on new {pID = p.ProductID, tID = p.TurmaID, parcela = p.Parcela} equals new { pID = d.ProductID, tID = turma.TurmaID, parcela = dadosCompra.pagamento.qtdParcelas }
                         where d.UserID == dadosCompra.userId
                          && d.AlunoTurmaID == dadosCompra.alunoTurmaId
                         select new {
                            prodID = p.ProductID,
                            qtd = d.Qtd,
                            valor_unitario = p.Preco,
                            usa_preco_por_foto = p.UsaPrecoPorFoto,
                            valor_foto = p.PrecoFoto,
                            qtd_fotos = d.QtdFoto
                         }).ToList();

            decimal total = 0;

            if (dados == null)
                throw new ArgumentException("Produto do pedido não localizados. " + dadosCompra.alunoTurmaId.ToString());

            dados.ForEach(d => { 
                //PrecoUnitario X Quantidade + ( qtd_fotos X valor_foto )
                decimal total_item = ((d.qtd * d.valor_unitario) + (d.usa_preco_por_foto ? d.qtd_fotos * d.valor_foto : 0));
                total += total_item;
            });
            
            if (Math.Round(dadosCompra.valorTotal,2) != Math.Round(total,2))
                throw new ArgumentException("Valor da compra divergente. Valor = " + dadosCompra.valorTotal.ToString() + " | valor calculado: " + Math.Round(total,2).ToString());


            if (dadosCompra.pagamento.tipoId == 20) //Cheque
            {
                if (dadosCompra.pagamento.dadosCheque == null || dadosCompra.pagamento.dadosCheque.Count() == 0)
                {
                    throw new ArgumentException("Os dados do(s) cheque(s) não foram enviados!");
                }            
            }


        }

        public OrderFormatura RegisterOrder(string token, DadosCompra dadosCompra, string remote_addr)
        {

            string urlRegisterOrder = System.Configuration.ConfigurationManager.AppSettings["Cart.API.RegisterOrder"].ToString();

            bool send_mail_desenv = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["SendMail.ENABLE_DESENV"].ToString());
            string email_desenv = System.Configuration.ConfigurationManager.AppSettings["SendMail.EMAIL_DESENV"].ToString();

            OrderFormatura order = new OrderFormatura();
            string email = "";

            GravarDadosCart(dadosCompra);

            ValidarDados(dadosCompra);

            order.user_id = dadosCompra.userId;
            order.total_value = dadosCompra.valorTotal;
            order.order_payment = new OrderPayment { PaymentGroup = dadosCompra.pagamento.grupoId, PaymentType = dadosCompra.pagamento.tipoId, Valor = order.total_value, TransactionCode = "0" };

            order.cpf_cnpj = dadosCompra.cpfCnpj;
            order.aluno_turma_id = dadosCompra.alunoTurmaId;

            order.endereco = new Address
            {
                Bairro = dadosCompra.endereco.Neighbourhood,
                CEP = dadosCompra.endereco.ZipCode,
                Complemento = dadosCompra.endereco.AddressComplement,
                Destinatario = dadosCompra.endereco.Receiver,
                isValid = true,
                Logradouro = dadosCompra.endereco.AddressLine,
                Municipio = dadosCompra.endereco.Neighbourhood,
                NickName = dadosCompra.endereco.Receiver,
                Numero = dadosCompra.endereco.AddressNumber,
                UF = dadosCompra.endereco.State
            };

            order.parcelas = dadosCompra.pagamento.qtdParcelas;

            var aluno_turma = db.GRD_Aluno_Turma.Where(a=>a.ID==dadosCompra.alunoTurmaId).FirstOrDefault();
            var aluno = aluno_turma.GRD_Aluno;
            var pessoa = aluno.GRD_PessoaFisica;
            
            int vendedorID = 0;

            if (aluno_turma.VendedorID != null)
                vendedorID = aluno_turma.VendedorID.Value;
            else
            { 
                var x = db.GRD_Vendedor.Where(v=>v.UserID==dadosCompra.userId).FirstOrDefault();
                if (x != null)
                    vendedorID = x.ID;
            }

            if (send_mail_desenv && !string.IsNullOrEmpty(email_desenv))
            {
                email = email_desenv;
            }
            else
            {
                if (!string.IsNullOrEmpty(pessoa.Email))
                {
                    email = pessoa.Email;
                }
                else
                {
                    //Caso o Aluno não tenha email, atualmente enviaremos para a equipe de desenv. NAO DEVE ENVIAR PARA O VENDEDOR
                    email = email_desenv; //aluno_turma.GRD_Vendedor.GRD_PessoaFisica.Email; 
                }
            }

            if (dadosCompra.pagamento.grupoId == 2) //Pagamento com cartão
            {

                var regExp = db.v_CartoesAceitos.ToList();

                foreach (var c in regExp) {
                    if (Regex.IsMatch(dadosCompra.pagamento.dadosCartao.numero, c.regexp))
                    {
                        dadosCompra.pagamento.tipoId = c.id;
                        break;
                    }
                }

                order.dados_pgto_cartao = new InfoPgtoCartao
                {

                    Compra = new CreditCard.DTO.DadosCompra
                    {
                        code = "",
                        endereco_ip = remote_addr,
                        numero_parcelas = dadosCompra.pagamento.qtdParcelas,
                        order_id = 0,
                        PaymentType = dadosCompra.pagamento.tipoId,
                        user_email = email,
                        user_id = dadosCompra.userId,
                        valor_total = dadosCompra.valorTotal
                    },

                    Cartao = new CreditCard.DTO.Cartao
                    {
                        codSeguranca = dadosCompra.pagamento.dadosCartao.cvv,
                        isOneClick = false,
                        nome = dadosCompra.pagamento.dadosCartao.nomeImpresso,
                        numero = dadosCompra.pagamento.dadosCartao.numero,
                        validadeAno = dadosCompra.pagamento.dadosCartao.validadeAno,
                        validadeMes = dadosCompra.pagamento.dadosCartao.validadeMes
                    }
                    ,
                    TransactionCode = ""
                };

                switch (dadosCompra.pagamento.tipoId)
                {
                    case 0:
                        order.dados_pgto_cartao.Cartao.bandeira = CreditCard.DTO.Bandeira.NaoDefinido;
                        break;

                    case 1:
                        order.dados_pgto_cartao.Cartao.bandeira = CreditCard.DTO.Bandeira.Visanet;
                        break;

                    case 2:
                        order.dados_pgto_cartao.Cartao.bandeira = CreditCard.DTO.Bandeira.Redecard;
                        break;

                    case 8:
                        order.dados_pgto_cartao.Cartao.bandeira = CreditCard.DTO.Bandeira.Amex;
                        break;

                    case 9:
                        order.dados_pgto_cartao.Cartao.bandeira = CreditCard.DTO.Bandeira.Hipercard;
                        break;

                    case 10:
                        order.dados_pgto_cartao.Cartao.bandeira = CreditCard.DTO.Bandeira.Diners;
                        break;

                    case 11:
                        order.dados_pgto_cartao.Cartao.bandeira = CreditCard.DTO.Bandeira.Elo;
                        break;

                    case 12:
                        order.dados_pgto_cartao.Cartao.bandeira = CreditCard.DTO.Bandeira.Discover;
                        break;

                    case 13:
                        order.dados_pgto_cartao.Cartao.bandeira = CreditCard.DTO.Bandeira.Aura;
                        break;

                    case 14:
                        order.dados_pgto_cartao.Cartao.bandeira = CreditCard.DTO.Bandeira.JCB;
                        break;

                    case 20: //Cheque

                        break;

                    case 21: //Boleto 
                        break;

                    case 22: //Dinheiro
                        break;


                }
            }
    
            RetornoRequestAPI orderAux = HttpStreamRequest.HttpRegisterOrder(token, urlRegisterOrder, order);

            OrderFormatura aux = new OrderFormatura();

            if (orderAux.StatusRetorno == StatusApiCart.Ok)
            {
                aux = (OrderFormatura)orderAux.objRetorno;
                order.order_id = aux.order_id;
                order.code = aux.code;
                order.Sucesso = aux.Sucesso;
                order.Mensagem = aux.Mensagem;
                dadosCompra.OrderID = order.order_id;
                dadosCompra.Code = order.code;

            }
            else
                throw new Exception(orderAux.Mensagem);


            int OrderRequestID = GravarDadosOrderRequest(dadosCompra, vendedorID);

            SaveOrderProducts(dadosCompra);
            AtualizaPhotoProducts(dadosCompra);
            UpdateOrderUserIdMaster(dadosCompra);
            GravarDadosComprador(dadosCompra);
            
            switch (dadosCompra.pagamento.tipoId)
            {
                case 1:
                case 2:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:

                    break;

                case 20: //CHEQUE

                    GravarDadosCheque(dadosCompra, OrderRequestID);
                    break;

                case 21: //Boleto 
                    GravarDadosBoleto(dadosCompra, OrderRequestID);
                    break;

                case 22: //Dinheiro
                    break;

            }

            //Envio de email de confirmação
            if (order.Sucesso && !string.IsNullOrEmpty(email))
            {
                EnviarEmail(dadosCompra, email, pessoa.Nome);
            }

            return aux;
        }

        public void InserUpdateCartProduct(CartProduct product)
        {

            var cartItems = db.GRD_Cart_Product.Where(i => i.AlunoTurmaID == product.AlunoTurmaID && i.UserID == product.UserID).ToList();
            
            //RECUPERO A QUANTIDADE DE FOTOS
            product.QtdFoto = db.GRD_Order_Product_Photos.Where(i => i.AlunoTurmaID == product.AlunoTurmaID && i.ProductID == product.ProductID && i.OrderID == null).Count();

            int max_idx = 0;
            GRD_Cart_Product item_aux = null;

            if (cartItems != null && cartItems.Count() > 0)
            {
                max_idx = cartItems.Max(i => i.ID);
                item_aux = cartItems.Where(i => i.ProductID == product.ProductID).FirstOrDefault();
            }

            if (item_aux == null)
            {
                var item = db.GRD_Cart_Product.Create();

                item.AlunoTurmaID = product.AlunoTurmaID;
                item.BookID = product.BookID;
                item.ID = max_idx + 1;
                item.ProductID = product.ProductID;
                item.Qtd = product.Qtd;
                item.QtdFoto = product.QtdFoto;
                item.UserID = product.UserID;

                db.GRD_Cart_Product.Add(item);
                db.SaveChanges();
            }
            else
            {
                item_aux.QtdFoto = product.QtdFoto;
                item_aux.Qtd = product.Qtd;
                item_aux.BookID = product.BookID;
                db.SaveChanges();
            }
        }

        public void DeleteItemCartProduct(CartProduct product)
        {
            var cartItem = db.GRD_Cart_Product.Where(i => i.AlunoTurmaID == product.AlunoTurmaID && i.UserID == product.UserID && i.ProductID == product.ProductID).FirstOrDefault();

            if (cartItem != null)
            {
                db.GRD_Cart_Product.Remove(cartItem);
                db.SaveChanges();
            }

        }

        public List<CartProductCheckout> GetListProducts(int BrandID, int AlunoTurmaID, int UserIdVendedor, string keyPixel, string url_base) {

            ProductsBLL bll = new ProductsBLL(db);
            List<pr_GRD_ProductsAluno_Result> Dados = bll.RetornaProdutosAlunoTurma(AlunoTurmaID);

            string AlunoTurmaID_Cript = PH.Formatura.BLL.Util.Cript.EncriptRC4(keyPixel, AlunoTurmaID.ToString());

            if (url_base == "/")
                url_base = "";

            var cartItems = (from d in Dados
                             select new CartProductCheckout
                             {
                                 AlunoTurmaID = AlunoTurmaID,
                                 AlbumID = (d.AlbumID == null ? 0 : d.AlbumID.Value),
                                 ProductID = d.ProductID,
                                 Qtd = (d.QtdProductsCart == null ? 0 : d.QtdProductsCart.Value),
                                 QtdFoto = (d.QtdFotosSelecionadas == null ? 0 : d.QtdFotosSelecionadas.Value),
                                 UserID = UserIdVendedor,
                                 ProductName = d.NomeProduto,
                                 UsaPrecoPorFoto = d.UsaPrecoPorFoto,
                                 Valor = 0,

                                 ExibirCarrinho = d.ExibirCarrinho,
                                 QtdMaxFoto = d.QtdMaxFoto,
                                 QtdMinFoto = d.QtdMinFoto,
                                 PercentualDescarte =  d.PercentualDescarte,
                                 ProdutoObrigatorio = d.ProdutoObrigatorio
                             }).ToList();

            cartItems.ForEach(item => {

                string parametros = item.AlbumID.ToString() + "|" + item.ProductID.ToString() + "|" + item.QtdMaxFoto + "|" + url_base + "/Checkout?a=" + AlunoTurmaID_Cript + "|" + item.AlunoTurmaID + "|" + item.QtdMinFoto + "|" + item.PercentualDescarte;
                parametros = PH.Formatura.BLL.Util.Cript.EncriptRC4(keyPixel, parametros);

                item.param_selecao_fotos = parametros;

                item.Checked = (db.GRD_Cart_Product.Count(i => i.AlunoTurmaID == item.AlunoTurmaID && i.UserID == item.UserID && i.ProductID == item.ProductID) > 0);
            });

            return cartItems;
        }
    
        private void GravarDadosCheque(DadosCompra dados, int OrderRequestID){

            dados.pagamento.dadosCheque.ForEach(c =>
            {

                var cheque = db.GRD_Cheque.Create();

                cheque.AlunoTurmaID = dados.alunoTurmaId;
                cheque.CMC7 = c.cmc7;
                cheque.CpfCnpj = c.cpfCnpj;
                cheque.DataVencimento = c.dataVencimento;
                cheque.Nome = c.emitente;
                cheque.Parcela = c.parcela;
                cheque.Valor = c.valor;
                cheque.OrderRequestID = OrderRequestID;
                cheque.OrderID = dados.OrderID;
                cheque.Telefone = c.telefone;
                
                db.GRD_Cheque.Add(cheque);

            });

            db.SaveChanges();
        }

        private int GravarDadosOrderRequest(DadosCompra dados, int vendedorID){


            var OrderRequest = db.GRD_OrderRequest.Where(g => g.OrderID == dados.OrderID).FirstOrDefault();
            int orderID;

            if (OrderRequest == null)
            {
            var o = db.GRD_OrderRequest.Create();

            o.AlunoTurmaID = dados.alunoTurmaId;
            o.Data = DateTime.Now;
            o.OrderID = dados.OrderID;
            o.Parcelas = dados.pagamento.qtdParcelas;
            o.PaymentTypeGroupID = dados.pagamento.grupoId;
            o.VendedorID = vendedorID;
                o.Observacao = dados.observacao;
                o.OrigemID = 1;

                db.GRD_OrderRequest.Add(o);
                db.SaveChanges();
                orderID = o.OrderID;
            }
            else {

                OrderRequest.Data = DateTime.Now;
                OrderRequest.Parcelas = dados.pagamento.qtdParcelas;
                OrderRequest.PaymentTypeGroupID = dados.pagamento.grupoId;
                OrderRequest.VendedorID = vendedorID;
                OrderRequest.Observacao = dados.observacao;
                orderID = dados.OrderID;
            db.SaveChanges();
            }

            return orderID;
        }

        private void GravarDadosBoleto(DadosCompra dados, int OrderRequestID) {


            Boleto boleto = new Boleto();
            decimal valor = Math.Round(dados.valorTotal / dados.pagamento.qtdParcelas,2);

            GetBoletoID(dados.OrderID, valor, boleto);

            for (var i = 1; i <= dados.pagamento.qtdParcelas; i++) 
            {
                var b = db.GRD_Boleto.Create();

                b.AlunoTurmaID = dados.alunoTurmaId;
                b.DataPagamento = (boleto.DtVencimento == null ? DateTime.Now.AddMonths(i - 1) : boleto.DtVencimento.Value.AddMonths(i - 1));
                b.DataVencimento = (boleto.DtVencimento == null ? DateTime.Now.AddMonths(i - 1) : boleto.DtVencimento.Value.AddMonths(i - 1));
                b.NossoNumero = dados.OrderID.ToString() + i.ToString();
                b.NumeroDocumento = b.NossoNumero;
                b.OrderID = dados.OrderID;
                b.OrderRequestID = OrderRequestID;
                b.Parcela = i;
                b.Valor = valor;

                db.GRD_Boleto.Add(b);

            }

            db.SaveChanges();
        
        }

        private void AtualizaPhotoProducts(DadosCompra dados) {

            db.Database.ExecuteSqlCommand("UPDATE GRD_Order_Product_Photos set OrderID = {0} where AlunoTurmaID = {1} " +
                                          "   AND OrderID IS NULL " +
                                          "   AND ProductID in ( SELECT ProductID " + 
                                          "  FROM GRd_Order_Product" +
                                          " WHERE AlunoTurmaID = {1} " +
                                          "   AND OrderID = {2})", dados.OrderID, dados.alunoTurmaId, dados.OrderID);
            db.SaveChanges();
        }

        private void SaveOrderProducts(DadosCompra dados){
            
            StringBuilder sql = new StringBuilder();

            sql.Append("INSERT INTO GRd_Order_Product ( UserID, ProductID, AlunoTurmaID, Qtd, QtdFoto, BookID, OrderID )");
            sql.Append("SELECT UserID, ProductID, AlunoTurmaID, Qtd, QtdFoto, BookID, " + dados.OrderID.ToString() + " ");
            sql.Append("FROM GRD_Cart_Product ");
            sql.Append("WHERE AlunoTurmaID = {0} ");
            sql.Append(" AND UserID = {1} ");

            db.Database.ExecuteSqlCommand(sql.ToString(), dados.alunoTurmaId, dados.userId);

            db.SaveChanges();

        }

        private void EnviarEmail(DadosCompra dados, string email, string nome) {

            try
            {
                EmailBLL bll = new EmailBLL(db, true, System.Configuration.ConfigurationManager.AppSettings["EmailPathLog"].ToString());

                Dictionary<string, string> dadosEmail = new Dictionary<string, string>();

                //{$Lista_Produtos}
                string linhaProduto = "<tr><td style='padding:13px 9px; margin:0px;'>{$produto}</td><td style='padding:13px 9px; margin:0px;'>{$quantidade}</td><td style='padding:13px 9px; margin:0px;'>{$qtd_fotos}</td></tr>";
                string textoEmail = "Seu pedido foi realizado com sucesso!";

                if (dados.pagamento.tipoId == 21) //Boleto
                {
                    string key = System.Configuration.ConfigurationManager.AppSettings["keyCriptoOrderCode"].ToString();
                    
                    string linkBoleto = System.Configuration.ConfigurationManager.AppSettings["Cart.GeraBoleto"].ToString();

                    var codeCript = new RC4(key);

                    linkBoleto += "?hc=" + codeCript.StrToHexStr(dados.Code) + "&np=1";

                    string link = "<br><a href='" + linkBoleto + "'>Clique aqui para visualizar seu boleto.</a>";

                    textoEmail += link;
                }


                StringBuilder produtos = new StringBuilder();

                var itensPedido = (from i in db.GRD_Cart_Product
                                   join g in db.v_GRD_Products
                                   on i.ProductID equals g.ProductID
                                   where i.UserID == dados.userId && i.AlunoTurmaID == dados.alunoTurmaId
                                      && g.ExibirCarrinho == true
                                   select new
                                   {
                                       NomeProd = g.NomeProduto,
                                       Quantidade = i.Qtd,
                                       QtdFotos = i.QtdFoto
                                   }).ToList();

                if (itensPedido != null)
                {
                    foreach (var i in itensPedido) { 
                        produtos.Append(linhaProduto.Replace("{$produto}",i.NomeProd).Replace("{$quantidade}",i.Quantidade.ToString()).Replace("{$qtd_fotos}",i.QtdFotos.ToString()));
                    }
                }

                string total_pedido = Format.Valor(dados.valorTotal);

                dadosEmail.Add("{$NOME}", nome);
                dadosEmail.Add("{$NCONFIRMACAO}", dados.Code);
                dadosEmail.Add("{$Lista_Produtos}", produtos.ToString());
                dadosEmail.Add("{$Total_Pedido}", "R$ " + total_pedido);
                dadosEmail.Add("{$URL_SITE}", System.Configuration.ConfigurationManager.AppSettings["Site_URL_HTTP"].ToString());
                dadosEmail.Add("{$textoEmail}", textoEmail);

                StringBuilder endereco = new StringBuilder();

                endereco.Append(dados.endereco.AddressLine + " - " + dados.endereco.AddressLine + "<br>");
                endereco.Append(dados.endereco.Neighbourhood + " - " + dados.endereco.City + "/" + dados.endereco.State + "<br>");
                endereco.Append(dados.endereco.ZipCode);

                dadosEmail.Add("{$Endereco}", endereco.ToString());

                var forma_pgto = cacheRep.PaymentType.Where(i=> i.id==dados.pagamento.tipoId).FirstOrDefault();
                if (forma_pgto != null)
                    dadosEmail.Add("{$Forma_Pgto}", forma_pgto.titulo);

                bll.SendMail(dados.userId, "leandro.castro@nicephotos.com.br", nome, 66, dadosEmail);

            }
            catch(Exception ex) {

                ErrorControl control = new ErrorControl(System.Configuration.ConfigurationManager.AppSettings["ConnError"].ToString());
                string aplicacaoID = System.Configuration.ConfigurationManager.AppSettings["PH_Aplicacao_ID"].ToString();
                string site = System.Configuration.ConfigurationManager.AppSettings["Site_URL_HTTP"].ToString();
                string localAddr = "";
                int cod_erro = control.RegisterError(ex, localAddr, true, site, dados, dados.userId, 0, aplicacaoID);

            }
        
        }

        private void GetBoletoID(int orderID, decimal totalValue, Boleto boleto)
        {
            ObjectParameter pBoletoID = new ObjectParameter("boleto_id", typeof(int));
            ObjectParameter pDataVencimento = new ObjectParameter("dt_vct", typeof(DateTime));
            this.db.pr_orders_get_boleto_id(orderID, totalValue, pBoletoID, pDataVencimento).FirstOrDefault();

            boleto.BoletoID = (int)pBoletoID.Value;
            boleto.DtVencimento = (DateTime)pDataVencimento.Value;
        }

        private void GravarDadosComprador(DadosCompra dados)
        {

            var dadosComprador = db.GRD_DadosComprador.Create();

            dadosComprador.AddressComplement = dados.dadosComprador.AddressComplement;
            dadosComprador.AddressLine = dados.dadosComprador.AddressLine;
            dadosComprador.AddressNumber = dados.dadosComprador.AddressNumber;
            dadosComprador.City = dados.dadosComprador.City;
            dadosComprador.Country = dados.dadosComprador.Country;
            dadosComprador.CpfCnpj = dados.dadosComprador.CpfCnpj;
            dadosComprador.DataNascimento = dados.dadosComprador.DataNascimento;
            dadosComprador.DDD = dados.dadosComprador.DDD;
            dadosComprador.Email = dados.dadosComprador.Email;
            dadosComprador.Neighbourhood = dados.dadosComprador.Neighbourhood;
            dadosComprador.Nome = dados.dadosComprador.Nome;
            dadosComprador.OrderID = dados.OrderID;
            dadosComprador.State = dados.dadosComprador.State;
            dadosComprador.Telefone = dados.dadosComprador.Telefone;
            dadosComprador.Title = "";
            dadosComprador.ZipCode = dados.dadosComprador.ZipCode;

            db.GRD_DadosComprador.Add(dadosComprador);
            db.SaveChanges();

        }

        private void UpdateOrderUserIdMaster(DadosCompra dados)
        {
            var user = db.Users.Where(v => v.user_id == dados.userId).FirstOrDefault();

            var brand = db.Brand.Where(b => b.id == user.brand_id).FirstOrDefault();

            db.Database.ExecuteSqlCommand("UPDATE Orders set user_id = {0} where order_id = {1} "
                                           , brand.UserIDMaster, dados.OrderID);
            db.SaveChanges();

        }

        public void DeleteAllItensCart(CartProductBase product)
        {
            
            var cartItens = db.GRD_Cart_Product.Where(i => i.AlunoTurmaID == product.AlunoTurmaID && i.UserID == product.UserID).ToList();

            if (cartItens.Count > 0)
            {
                db.GRD_Cart_Product.RemoveRange(cartItens);
                db.SaveChanges();
            }
        }

    }
}
