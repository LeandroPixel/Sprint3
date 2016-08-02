using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using PH.Formatura.BLL.Util;
using PH.Formatura.BLL;
using PH.Formatura.DAL;
using System.Threading;
using System.IO;

namespace PH.Formatura.Upload
{
    class Program
    {
        private static ConfigControl config;
        private static Boolean Close;
        private static EntityContext context = new EntityContext();
        private static ManualResetEvent doneEventsUpload;


        struct PramUpload
        {
            int x;

            public PramUpload(int _x)
            {
                x = _x;
            }
        }

        static void Main(string[] args)
        {
            try
            {
                //
                Close = false;
                //Carrego o config
                config = new ConfigControl();

                printMessage("MAIN", "StartListenerDirUpload");
                Thread thread1 = new Thread(StartListenerDirUpload);
                thread1.Start();

                //printMessage("MAIN", "StartListenerDirUploadCreateOrder");
                //Thread thread2 = new Thread(StartListenerDirUploadCreateOrder);
                //thread2.Start();


            }
            catch (Exception ex)
            {
                printMessageError("MAIN", ex.Message);
            }
            finally
            {
                printMessage("MAIN", "finally");
                Console.ReadKey();
                Close = true;
            }

        }


        /// <summary>
        /// Rotina responsáel por imprimir as mensagnes de debug quando o parâmetro PrintExecute no app.config estiver habilitado.
        /// </summary>
        /// <param name="titulo"></param>
        /// <param name="Mensagem"></param>
        private static void printMessage(String titulo, String Mensagem)
        {
            try
            {
                if (config.PrintExecute) Console.WriteLine("( " + (DateTime.Now.ToString() + " " + titulo).PadRight(60, Convert.ToChar("-")) + "). " + Mensagem);
            }
            catch (Exception ex)
            {
                Console.WriteLine("printMessage(). " + ex.Message);
            }
        }


        /// <summary>
        /// Rotina responsável por imprimir as mensagens de erro no console.
        /// </summary>
        /// <param name="titulo"></param>
        /// <param name="Mensagem"></param>
        private static void printMessageError(String titulo, String Mensagem)
        {
            try
            {
                Console.WriteLine("( " + (DateTime.Now.ToString() + "*ERR " + titulo).PadRight(60, Convert.ToChar("-")) + "). " + Mensagem);
            }
            catch (Exception ex)
            {
                Console.WriteLine("printMessageError(). " + ex.Message);
            }
        }


        private static void StartListenerDirUpload()
        {
            try
            {
                printMessage("StartListenerDirUpload()", "Vai iniciar o loop");
                while (!Close)
                {
                    try
                    {
                        printMessage("StartListenerDirUpload()", "Inicia novo ciclo ListenerDirUpload.");
                        ListenerDirUpload();
                        printMessage("StartListenerDirUpload()", "Fim do ciclo ListenerDirUpload.");
                    }
                    catch (Exception ex)
                    {
                        printMessageError("StartListenerDirUpload(WHILE) ", ex.Message);
                    }

                    System.Threading.Thread.Sleep(10000);
                }
                printMessage("StartListenerDirUpload()", "saiu do loop");
            }
            catch (Exception ex)
            {
                printMessageError("StartListenerDirUpload()", ex.Message);
            }
            finally
            {
                printMessage("StartListenerDirUpload()", "finally");
            }

        }


        private static void StartListenerDirUploadCreateOrder()
        {
            try
            {
                printMessage("StartListenerDirUploadCreateOrder()", "Vai iniciar o loop");
                while (!Close)
                {
                    try
                    {
                        printMessage("StartListenerDirUploadCreateOrder()", "Inicia novo ciclo ListenerDirUpload.");
                        ListenerDirUploadCreateOrder();
                        printMessage("StartListenerDirUploadCreateOrder()", "Fim do ciclo ListenerDirUpload.");
                    }
                    catch (Exception ex)
                    {
                        printMessageError("StartListenerDirUploadCreateOrder(WHILE) ", ex.Message);
                    }

                    System.Threading.Thread.Sleep(10000);
                }
                printMessage("StartListenerDirUploadCreateOrder()", "saiu do loop");
            }
            catch (Exception ex)
            {
                printMessageError("StartListenerDirUploadCreateOrder()", ex.Message);
            }
            finally
            {
                printMessage("StartListenerDirUploadCreateOrder()", "finally");
            }

        }


        private static void ListenerDirUpload()
        {
            try
            {
                //Ler diretório 
                printMessage("ListenerDirUpload()", "Ler diretório " + config.PathReadPhotos);
                string[] AllDirectoys = System.IO.Directory.GetDirectories(config.PathReadPhotos);
                string nameFOLDER = "";
                string DONE = "DONE";
                string ERROR = "ERROR";
                string INPROCESS = "INPROCESS";
                int UserIDMaster = 2172213;
                UploadBLL uBLL = new UploadBLL(context.db);


                //
                //
                // ***************** 1ªETAPA - LER AS FOTOS DO DIRETÓRIO E INSERIR NA TABELA GRD_Process_Upload ***************** //                
                try
                {
                    printMessage("ListenerDirUpload()", "------------1ª ETAPA INICIADA------------");

                    //Percorrer todos os diretórios
                    printMessage("ListenerDirUpload()", "Percorrer todos os diretórios, qtd: " + AllDirectoys.Count().ToString());
                    foreach (var item in AllDirectoys)
                    {
                        //Recupero o nome do folder/PIT
                        printMessage("ListenerDirUpload()", "Recupero o nome do folder/PIT:" + item);
                        nameFOLDER = item.Substring(item.LastIndexOf(@"\") + 1);

                        //Verifico se object PIT existe.
                        printMessage("ListenerDirUpload()", "Verifico se o PIT existe." + nameFOLDER);
                        if (uBLL.ExistePIT(nameFOLDER))
                        {
                            printMessage("ListenerDirUpload()", "PIT localizado. " + nameFOLDER);

                            //Verifico se existe o diretório TABLET.
                            printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " Verificar se existe o diretório TABLET.");
                            string DirTablet = item + @"\Tablet";
                            if (Directory.Exists(DirTablet))
                            {

                                printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " Diretório TABLET existe.");
                                string[] DirectoysAlunos = System.IO.Directory.GetDirectories(DirTablet);
                                printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " Lista de alunos alunos recuperado (qtd: " + DirectoysAlunos.Count().ToString() + ").");
                                foreach (var item2 in DirectoysAlunos)
                                {
                                    //Recupero o ID do ALUNO na cp7, que é o nome do FOLDER
                                    string CP7IDAluno = item2.Substring(item2.LastIndexOf(@"\") + 1);
                                    printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno recuperado:" + CP7IDAluno + ". Agora será carregado a lista de fotos.");
                                    String[] ListaFotos = Directory.GetFiles(item2, "*.JPG", SearchOption.TopDirectoryOnly);
                                    printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Qtd de Fotos para Importação: " + ListaFotos.Count().ToString() + ".");

                                    //Antes de chamar o DB verifico se existe fotos para importação
                                    if (ListaFotos.Count() > 0)
                                    {
                                        //Verifico se a estrutura de diretório para cada aluno(DONE, ERROR, INPROCESS)
                                        printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Valido Estrutura de Diretório (DONE, ERROR, INPROCESS).");
                                        string PathDONE = item2 + @"\" + DONE + @"\";
                                        string PathERROR = item2 + @"\" + ERROR + @"\";
                                        string PathINPROCESS = item2 + @"\" + INPROCESS + @"\";
                                        if (!Directory.Exists(PathDONE)) { Directory.CreateDirectory(PathDONE); }
                                        if (!Directory.Exists(PathERROR)) { Directory.CreateDirectory(PathERROR); }
                                        if (!Directory.Exists(PathINPROCESS)) { Directory.CreateDirectory(PathINPROCESS); }

                                        //Recupero dados de ALUNOTURMA
                                        printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Recupero dados de ALUNOTURMA.");
                                        pr_GRD_AlunoUpload_Result AlunoTurma = uBLL.GetAlunoTurma(nameFOLDER, CP7IDAluno, UserIDMaster);

                                        //Listagem de fotos que serão inseridas na tabela de controle de upload GRD_Process_Upload
                                        List<GRD_Process_Upload> ProcessUpload = new List<GRD_Process_Upload>();


                                        if (AlunoTurma.AlunoTurmaID > 0)
                                        {
                                            string NomeFoto = "";
                                            bool MoverInProcess = true;
                                            bool MoverError = true;
                                            try
                                            {

                                                printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Início do foreach das fotos para INPROCESS.");
                                                foreach (var fotos in ListaFotos)
                                                {
                                                    GRD_Process_Upload pu = new GRD_Process_Upload();
                                                    MoverError = false;
                                                    MoverInProcess = true;
                                                    //NomeFoto
                                                    NomeFoto = fotos.Substring(fotos.LastIndexOf(@"\") + 1).Trim();

                                                    //Recupero dados da foto;
                                                    printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + " Foto:" + NomeFoto + ". Recupero dados da foto.");
                                                    pu.Msg = "";
                                                    pu.AlbumID = AlunoTurma.AlbumID;
                                                    pu.AlunoTurmaID = AlunoTurma.AlunoTurmaID;
                                                    pu.NameFile = NomeFoto;
                                                    pu.OrderPhoto = int.Parse(NomeFoto.ToUpper().Replace(".JPG", ""));
                                                    pu.Path = PathDONE; //Será utilizado para inserir na inodes
                                                    pu.PathPhoto = PathINPROCESS + NomeFoto; //será utilizado na 3ª etapa para mover de PathPhoto para Path
                                                    pu.PhotoDesc = NomeFoto;
                                                    pu.Status = "PP"; //PP=Pendente de criação dos dados da PHOTO
                                                    pu.UserID = UserIDMaster;
                                                    pu.Origem = "TABLET";
                                                    try
                                                    {
                                                        FileInfo FI = new FileInfo(fotos);
                                                        pu.PhotoDate = FI.CreationTime;
                                                        pu.Size = FI.Length;
                                                        FI = null;
                                                        using (FileStream FS = new FileStream(fotos, FileMode.Open, FileAccess.Read))
                                                        {
                                                            using (System.Drawing.Image IMG = System.Drawing.Image.FromStream(FS, false, false))
                                                            {
                                                                pu.Width = IMG.Width;
                                                                pu.Height = IMG.Height;
                                                            };
                                                        }
                                                    }
                                                    catch (Exception ex)
                                                    {
                                                        printMessageError("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + " Foto:" + NomeFoto + ". Erro recuperar dados da foto: " + ex.Message);
                                                        pu.PhotoDate = DateTime.Now;
                                                        pu.Size = 0;
                                                        pu.Width = 0;
                                                        pu.Height = 0;
                                                        pu.Status = "ER";
                                                        pu.Msg = ex.Message;
                                                        MoverInProcess = false;
                                                        MoverError = true;
                                                    }


                                                    //Movo as fotos pendentes de processamento parra a pasta INPROCESS
                                                    printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + " Foto:" + NomeFoto + ". Move na foto. MoverERRO:" + MoverError.ToString() + ". MoveINPROCESS:" + MoverInProcess.ToString());
                                                    if (MoverInProcess) File.Move(fotos, PathINPROCESS + NomeFoto);
                                                    if (MoverError) File.Move(fotos, PathERROR + NomeFoto);

                                                    //Insiro na listagem. (Se der algum erro no processo acima do move, não moverá a foto e tb não irá inserir no listagem ProcessUpload)
                                                    printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + " Foto:" + NomeFoto + ". ProcessUpload.Add(pu)");
                                                    ProcessUpload.Add(pu);
                                                }
                                            }
                                            catch (Exception ex)
                                            {
                                                printMessageError("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + " Foto:" + NomeFoto + ". " + ex.Message);
                                            }
                                            finally
                                            {
                                                //Chamo a rotina de inserção na base de dados dentro do finally. Com isso garanto os segunites eventos:
                                                //-Gravação dos dados da listagem quando o processamento ocorrer 100%
                                                //-No caso de exception. Gravação dos dados da listagem parciais.
                                                try
                                                {
                                                    printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Grava no banco de dados a listagem de fotos(uBLL.PopulaProcessUpload) ");
                                                    uBLL.PopulaProcessUpload(ProcessUpload);
                                                }
                                                catch (Exception ex)
                                                {
                                                    //TODO: Adicionar controle para verificar fotos que estão no INPROCESS e não foram inseridas na base de dados
                                                    printMessageError("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Atualização do PopulaProcessUpload() " + ex.Message);
                                                }

                                            }

                                        }
                                        else
                                        {
                                            printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". ALUNOTURMA não localizado no BD.");
                                        }
                                    }
                                }


                            }
                            else
                            {
                                printMessage("ListenerDirUpload()", "PIT: " + nameFOLDER + " Diretório TABLET NÃO localizado.");
                            }
                        }
                        else
                        {
                            printMessage("ListenerDirUpload()", "PIT não localizado. " + nameFOLDER);
                        }
                    }
                    printMessage("ListenerDirUpload()", "------------1ª ETAPA FINALIZADA------------");

                }
                catch (Exception ex)
                {
                    printMessageError("ListenerDirUpload()", "1ª ETAPA " + ex.Message);
                }



                //
                //
                // ***************** 2ªETAPA - CHAMAR A PROCEDURE DE CRIAÇÃO DE PHOTOID E INODEID ***************** //
                try
                {
                    printMessage("ListenerDirUpload()", "------------2ª ETAPA INICIADA------------");

                    printMessage("ListenerDirUpload()", "Chama procedure pr_GRD_CreatePhoto");
                    //Rotina responsável por pegar os registros na tabela GRD_Process_Upload com status='PP' e criar os registros nas tabelas Photos,inodes e carrega nas tabelas de formatura
                    //Dentro da procedure existe um TOP x, para não processar muitos registros por vez.
                    uBLL.CreatePhoto();

                    printMessage("ListenerDirUpload()", "------------2ª ETAPA FINALIZADA------------");
                }
                catch (Exception ex)
                {
                    printMessageError("ListenerDirUpload()", "2ª ETAPA " + ex.Message);
                }



                //
                //
                // ***************** 3ªETAPA - MOVER AS FOTOS PARA "DONE", FAZER RESIZEE E CRIAR MINIATURAS (THUMBS E MAIN) ***************** //
                printMessage("ListenerDirUpload()", "------------3ª ETAPA INICIADA------------");
                bool Sair = false;
                while (!Sair)
                {
                    try
                    {
                        printMessage("ListenerDirUpload()", "Chama uBLL.GetFotosPendenteUpload.");
                        List<GRD_Process_Upload> Fotos = uBLL.GetFotosPendenteUpload(config.QtdFotosUpload);

                        printMessage("ListenerDirUpload()", "Entra no foreach. Qtd:" + Fotos.Count().ToString());
                        List<GRD_Process_Upload> GRDProcessUploadLista = new List<GRD_Process_Upload>();

                        Sair = (Fotos.Count() == 0);

                        foreach (var item in Fotos)
                        {
                            string NomeFoto = item.InodeID.ToString() + ".jpg";
                            string PhotoDone = item.Path + NomeFoto;
                            printMessage("ListenerDirUpload()", "Diretório final definido(PhotoDone): " + PhotoDone);

                            GRD_Process_Upload PU = new GRD_Process_Upload();
                            PU.ID = item.ID;  //ID para usar no update.
                            PU.Status = "OK";
                            PU.Msg = "";

                            bool MoverFoto = true;
                            bool CriarThumbs = true;
                            try
                            {
                                //Verifico se a foto existe no INPROCESS
                                printMessage("ListenerDirUpload()", "Verifico se a foto existe no INPROCESS: " + item.PathPhoto);
                                if (!File.Exists(item.PathPhoto))
                                {
                                    //Se a foto não existe no INPROCESS e NÃO existir na pasta DONE
                                    printMessage("ListenerDirUpload()", "Verifico se a foto não existe no DONE: " + PhotoDone);
                                    if (!File.Exists(PhotoDone))
                                    {
                                        //Se não existe marco com erro
                                        printMessage("ListenerDirUpload()", "Foto não existe. Seto o registro com erro.");
                                        PU.Status = "ER";
                                        PU.Msg = "Foto não localizada";
                                        CriarThumbs = false; //indico que e a criação de thumbs não deve ocorrer pq a foto não existe. se existir então deixo recriar os thumbs.
                                    }

                                    //Indico que o move não deve ocorrer
                                    MoverFoto = false;
                                }

                                //Movo para a pasta DONE
                                printMessage("ListenerDirUpload()", "Mover foto: " + MoverFoto.ToString());
                                if (MoverFoto) File.Move(item.PathPhoto, PhotoDone);
                                //Cria book, main e thumb
                                printMessage("ListenerDirUpload()", "Criar Thumbs: " + CriarThumbs.ToString());
                                if (CriarThumbs) CriarMiniaturas(PhotoDone, item.Path, NomeFoto);

                            }
                            catch (Exception ex)
                            {
                                PU.Status = "ER";
                                PU.Msg = ex.Message;
                            }
                            finally
                            {
                                //Vou adicionando as linhas para atualização
                                GRDProcessUploadLista.Add(PU);
                            }


                        }

                        //Atualizo o BD.
                        try
                        {
                            printMessage("ListenerDirUpload()", "Atualiza os status do upload (uBLL.UploadUpdateStatus)  ");
                            uBLL.UploadUpdateStatus(GRDProcessUploadLista);
                        }
                        catch (Exception ex)
                        {
                            printMessageError("ListenerDirUpload()", "uBLL.UploadUpdateStatus(Atualiza status das fotos movidas para DONE). " + ex.Message);
                        }
                    }
                    catch (Exception ex)
                    {
                        printMessageError("ListenerDirUpload()", "3ª ETAPA " + ex.Message);
                    }
                }
                printMessage("ListenerDirUpload()", "------------3ª ETAPA FINALIZADA------------");

            }
            catch (Exception ex)
            {
                printMessageError("ListenerDirUpload()", ex.Message);
            }

        }

        private static void ListenerDirUploadCreateOrder()
        {
            try
            {
                //Ler diretório 
                printMessage("ListenerDirUploadCreateOrder()", "Ler diretório " + config.PathReadPhotosCreateBook);
                string[] AllDirectoys = System.IO.Directory.GetDirectories(config.PathReadPhotosCreateBook);
                string nameFOLDER = "";
                string DONE = "DONE";
                string ERROR = "ERROR";
                string INPROCESS = "INPROCESS";
                int UserIDMaster = 2172213;
                UploadBLL uBLL = new UploadBLL(context.db);


                //
                //
                // ***************** 1ªETAPA - LER AS FOTOS DO DIRETÓRIO E INSERIR NA TABELA GRD_Process_Upload ***************** //                
                try
                {
                    printMessage("ListenerDirUploadCreateOrder()", "------------1ª ETAPA INICIADA------------");

                    //Percorrer todos os diretórios
                    printMessage("ListenerDirUploadCreateOrder()", "Percorrer todos os diretórios, qtd: " + AllDirectoys.Count().ToString());
                    foreach (var item in AllDirectoys)
                    {
                        //Recupero o nome do folder/PIT
                        printMessage("ListenerDirUploadCreateOrder()", "Recupero o nome do folder/PIT:" + item);
                        nameFOLDER = item.Substring(item.LastIndexOf(@"\") + 1);

                        //Verifico se PIT é válido.
                        printMessage("ListenerDirUploadCreateOrder()", "Verifico se o PIT é valido." + nameFOLDER);
                        if ((nameFOLDER.Length == 8))
                        {
                            printMessage("ListenerDirUploadCreateOrder()", "PIT Válido! " + nameFOLDER);

                            //Verifico se existe o diretório 4.Formandos Diagramados.
                            string DirFormandos = item + @"\4.Formandos Diagramados";
                            printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " Verificar se existe o diretório" + DirFormandos + " .");
                            
                            if (Directory.Exists(DirFormandos))
                            {

                                printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " Diretório " + DirFormandos + " existe.");
                                string[] DirectoysAlunos = System.IO.Directory.GetDirectories(DirFormandos);
                                printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " Lista de alunos alunos recuperados (qtd: " + DirectoysAlunos.Count().ToString() + ").");
                                foreach (var item2 in DirectoysAlunos)
                                {
                                    //Recupero o ID do ALUNO na cp7, que é o nome parte do nome do FOLDER (exemplo: Ana Luísa Pontes Massula Silva_ID-3)
                                    string NomeAlunoID = item2.Substring(item2.LastIndexOf(@"\") + 1); //Nome da pasta com nome do aluno e ID
                                    string CP7IDAluno = NomeAlunoID.ToUpper().Substring(NomeAlunoID.LastIndexOf(@"ID-")).Replace("ID-", ""); //ID no nome da pasta

                                    int INTCP7IDAluno;
                                    if (!int.TryParse(CP7IDAluno, out INTCP7IDAluno)) {
                                        printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno Inválido:" + CP7IDAluno + ". Erro no int.tryparse. Provavelmente a pasta está fora do padrão");
                                        continue;
                                    }

                                    printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno recuperado:" + CP7IDAluno + ". Agora será carregado a lista de fotos.");
                                    String[] ListaFotos = Directory.GetFiles(item2, "*.JPG", SearchOption.TopDirectoryOnly);
                                    printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Qtd de Fotos para Importação: " + ListaFotos.Count().ToString() + ".");

                                    //Antes de chamar o DB verifico se existe fotos para importação
                                    if (ListaFotos.Count() > 0)
                                    {
                                        //Verifico se a estrutura de diretório para cada aluno(DONE, ERROR, INPROCESS)
                                        printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Valido Estrutura de Diretório (DONE, ERROR, INPROCESS).");
                                        string PathDONE = item2 + @"\" + DONE + @"\";
                                        string PathERROR = item2 + @"\" + ERROR + @"\";
                                        string PathINPROCESS = item2 + @"\" + INPROCESS + @"\";
                                        if (!Directory.Exists(PathDONE)) { Directory.CreateDirectory(PathDONE); }
                                        if (!Directory.Exists(PathERROR)) { Directory.CreateDirectory(PathERROR); }
                                        if (!Directory.Exists(PathINPROCESS)) { Directory.CreateDirectory(PathINPROCESS); }

                                        
                                        //Gravo/Recupero dados de ALUNOTURMA e ALBUMID
                                        printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Salvo/Recupero dados de ALUNOTURMA e AlbumID.");
                                        pr_GRD_SaveTurmaAlunoPorFora_Result AlunoTurma = new pr_GRD_SaveTurmaAlunoPorFora_Result();
                                        AlunoTurma.ID = 0; //Indico que é a inclusão de um novo registro.
                                        AlunoTurma.Nome = NomeAlunoID;
                                        AlunoTurma.AlbumID = 0;//Nada acontece. ele é criado dentro da rotina abaixo e retorna com o ID.
                                        AlunoTurma.UserID = UserIDMaster;
                                        AlunoTurma.PIT = nameFOLDER;
                                        AlunoTurma = uBLL.SaveTurmaAlunoPorFora(AlunoTurma); //Envio os dados, mas ele só inclui um novo registros se não encontrar registros para o NomeAlunoID..


                                        //Listagem de fotos que serão inseridas na tabela de controle de upload GRD_Process_Upload
                                        List<GRD_Process_Upload> ProcessUpload = new List<GRD_Process_Upload>();


                                        if (AlunoTurma.ID > 0)
                                        {
                                            string NomeFoto = "";
                                            bool MoverInProcess = true;
                                            bool MoverError = true;
                                            try
                                            {

                                                printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Início do foreach das fotos para INPROCESS.");
                                                foreach (var fotos in ListaFotos)
                                                {
                                                    GRD_Process_Upload pu = new GRD_Process_Upload();
                                                    MoverError = false;
                                                    MoverInProcess = true;
                                                    //NomeFoto
                                                    NomeFoto = fotos.Substring(fotos.LastIndexOf(@"\") + 1).Trim();

                                                    //Recupero dados da foto;
                                                    printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + " Foto:" + NomeFoto + ". Recupero dados da foto.");
                                                    pu.Msg = "";
                                                    pu.AlbumID = AlunoTurma.AlbumID;
                                                    pu.AlunoTurmaID = AlunoTurma.ID;
                                                    pu.NameFile = NomeFoto;
                                                    pu.OrderPhoto = int.Parse(NomeFoto.ToUpper().Replace(".JPG", "").Replace("COPIÃO_", "9998").Replace("COPIÃO_2", "9999"));
                                                    pu.Path = PathDONE; //Será utilizado para inserir na inodes
                                                    pu.PathPhoto = PathINPROCESS + NomeFoto; //será utilizado na 3ª etapa para mover de PathPhoto para Path
                                                    pu.PhotoDesc = NomeFoto;
                                                    pu.Status = "PP"; //PP=Pendente de criação dos dados da PHOTO
                                                    pu.UserID = UserIDMaster;
                                                    pu.Origem = "PORFORA"; //Indico que é um fluxo fora tablet.
                                                    pu.PageTypeID = 1; //1 Paginas do Book, 2-capa, 3-verso
                                                    try
                                                    {
                                                        FileInfo FI = new FileInfo(fotos);
                                                        pu.PhotoDate = FI.CreationTime;
                                                        pu.Size = FI.Length;
                                                        FI = null;
                                                        using (FileStream FS = new FileStream(fotos, FileMode.Open, FileAccess.Read))
                                                        {
                                                            using (System.Drawing.Image IMG = System.Drawing.Image.FromStream(FS, false, false))
                                                            {
                                                                pu.Width = IMG.Width;
                                                                pu.Height = IMG.Height;
                                                            };
                                                        }
                                                    }
                                                    catch (Exception ex)
                                                    {
                                                        printMessageError("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + " Foto:" + NomeFoto + ". Erro recuperar dados da foto: " + ex.Message);
                                                        pu.PhotoDate = DateTime.Now;
                                                        pu.Size = 0;
                                                        pu.Width = 0;
                                                        pu.Height = 0;
                                                        pu.Status = "ER";
                                                        pu.Msg = ex.Message;
                                                        MoverInProcess = false;
                                                        MoverError = true;
                                                    }


                                                    //Movo as fotos pendentes de processamento parra a pasta INPROCESS
                                                    printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + " Foto:" + NomeFoto + ". Move na foto. MoverERRO:" + MoverError.ToString() + ". MoveINPROCESS:" + MoverInProcess.ToString());
                                                    if (MoverInProcess) File.Move(fotos, PathINPROCESS + NomeFoto);
                                                    if (MoverError) File.Move(fotos, PathERROR + NomeFoto);

                                                    //Insiro na listagem. (Se der algum erro no processo acima do move, não moverá a foto e tb não irá inserir no listagem ProcessUpload)
                                                    printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + " Foto:" + NomeFoto + ". ProcessUpload.Add(pu)");
                                                    ProcessUpload.Add(pu);
                                                }
                                            }
                                            catch (Exception ex)
                                            {
                                                printMessageError("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + " Foto:" + NomeFoto + ". " + ex.Message);
                                            }
                                            finally
                                            {
                                                //Chamo a rotina de inserção na base de dados dentro do finally. Com isso garanto os segunites eventos:
                                                //-Gravação dos dados da listagem quando o processamento ocorrer 100%
                                                //-No caso de exception. Gravação dos dados da listagem parciais.
                                                try
                                                {
                                                    printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Grava no banco de dados a listagem de fotos(uBLL.PopulaProcessUpload) ");
                                                    uBLL.PopulaProcessUpload(ProcessUpload);
                                                }
                                                catch (Exception ex)
                                                {
                                                    //TODO: Adicionar controle para verificar fotos que estão no INPROCESS e não foram inseridas na base de dados
                                                    printMessageError("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". Atualização do PopulaProcessUpload() " + ex.Message);
                                                }

                                            }

                                        }
                                        else
                                        {
                                            printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " CP7IDAluno:" + CP7IDAluno + ". ALUNOTURMA não localizado no BD.");
                                        }
                                    }
                                }


                            }
                            else
                            {
                                printMessage("ListenerDirUploadCreateOrder()", "PIT: " + nameFOLDER + " Diretório " + DirFormandos +" NÃO localizado.");
                            }
                        }
                        else
                        {
                            printMessage("ListenerDirUploadCreateOrder()", "PIT inválido. " + nameFOLDER);
                        }
                    }
                    printMessage("ListenerDirUploadCreateOrder()", "------------1ª ETAPA FINALIZADA------------");

                }
                catch (Exception ex)
                {
                    printMessageError("ListenerDirUploadCreateOrder()", "1ª ETAPA " + ex.Message);
                }



                //
                //
                // ***************** 2ªETAPA - CHAMAR A PROCEDURE DE CRIAÇÃO DE PHOTOID E INODEID ***************** //
                try
                {
                    printMessage("ListenerDirUploadCreateOrder()", "------------2ª ETAPA INICIADA------------");

                    printMessage("ListenerDirUploadCreateOrder()", "Chama procedure pr_GRD_CreatePhoto");
                    //Rotina responsável por pegar os registros na tabela GRD_Process_Upload com status='PP' e criar os registros nas tabelas Photos,inodes e carrega nas tabelas de formatura
                    //Dentro da procedure existe um TOP x, para não processar muitos registros por vez.
                    uBLL.CreatePhoto();

                    printMessage("ListenerDirUploadCreateOrder()", "------------2ª ETAPA FINALIZADA------------");
                }
                catch (Exception ex)
                {
                    printMessageError("ListenerDirUploadCreateOrder()", "2ª ETAPA " + ex.Message);
                }



                //
                //
                // ***************** 3ªETAPA - MOVER AS FOTOS PARA "DONE", FAZER RESIZEE E CRIAR MINIATURAS (THUMBS E MAIN) ***************** //
                printMessage("ListenerDirUploadCreateOrder()", "------------3ª ETAPA INICIADA------------");
                bool Sair = false;
                while (!Sair)
                {
                    try
                    {
                        printMessage("ListenerDirUploadCreateOrder()", "Chama uBLL.GetFotosPendenteUpload.");
                        List<GRD_Process_Upload> Fotos = uBLL.GetFotosPendenteUpload(config.QtdFotosUpload);

                        printMessage("ListenerDirUploadCreateOrder()", "Entra no foreach. Qtd:" + Fotos.Count().ToString());
                        List<GRD_Process_Upload> GRDProcessUploadLista = new List<GRD_Process_Upload>();

                        Sair = (Fotos.Count() == 0);

                        foreach (var item in Fotos)
                        {
                            string NomeFoto = item.InodeID.ToString() + ".jpg";
                            string PhotoDone = item.Path + NomeFoto;
                            printMessage("ListenerDirUploadCreateOrder()", "Diretório final definido(PhotoDone): " + PhotoDone);

                            GRD_Process_Upload PU = new GRD_Process_Upload();
                            PU.ID = item.ID;  //ID para usar no update.
                            PU.Status = "PO";
                            PU.Msg = "";

                            bool MoverFoto = true;
                            bool CriarThumbs = true;
                            try
                            {
                                //Verifico se a foto existe no INPROCESS
                                printMessage("ListenerDirUploadCreateOrder()", "Verifico se a foto existe no INPROCESS: " + item.PathPhoto);
                                if (!File.Exists(item.PathPhoto))
                                {
                                    //Se a foto não existe no INPROCESS e NÃO existir na pasta DONE
                                    printMessage("ListenerDirUploadCreateOrder()", "Verifico se a foto não existe no DONE: " + PhotoDone);
                                    if (!File.Exists(PhotoDone))
                                    {
                                        //Se não existe marco com erro
                                        printMessage("ListenerDirUploadCreateOrder()", "Foto não existe. Seto o registro com erro.");
                                        PU.Status = "ER";
                                        PU.Msg = "Foto não localizada";
                                        CriarThumbs = false; //indico que e a criação de thumbs não deve ocorrer pq a foto não existe. se existir então deixo recriar os thumbs.
                                    }

                                    //Indico que o move não deve ocorrer
                                    MoverFoto = false;
                                }

                                //Movo para a pasta DONE
                                printMessage("ListenerDirUploadCreateOrder()", "Mover foto: " + MoverFoto.ToString());
                                if (MoverFoto) File.Move(item.PathPhoto, PhotoDone);
                                //Cria book, main e thumb
                                printMessage("ListenerDirUploadCreateOrder()", "Criar Thumbs: " + CriarThumbs.ToString());
                                if (CriarThumbs) CriarMiniaturas(PhotoDone, item.Path, NomeFoto);

                            }
                            catch (Exception ex)
                            {
                                PU.Status = "ER";
                                PU.Msg = ex.Message;
                            }
                            finally
                            {
                                //Vou adicionando as linhas para atualização
                                GRDProcessUploadLista.Add(PU);
                            }


                        }

                        //Atualizo o BD.
                        try
                        {
                            printMessage("ListenerDirUploadCreateOrder()", "Atualiza os status do upload (uBLL.UploadUpdateStatus)  ");
                            uBLL.UploadUpdateStatus(GRDProcessUploadLista);
                        }
                        catch (Exception ex)
                        {
                            printMessageError("ListenerDirUploadCreateOrder()", "uBLL.UploadUpdateStatus(Atualiza status das fotos movidas para DONE). " + ex.Message);
                        }
                    }
                    catch (Exception ex)
                    {
                        printMessageError("ListenerDirUploadCreateOrder()", "3ª ETAPA " + ex.Message);
                    }
                }
                printMessage("ListenerDirUploadCreateOrder()", "------------3ª ETAPA FINALIZADA------------");


                //
                //
                // ***************** 4ªETAPA - CARREGO CAPA E CONTRACAPA ***************** //
                printMessage("ListenerDirUploadCreateOrder()", "------------4ª ETAPA INICIADA------------");

                printMessage("ListenerDirUploadCreateOrder()", "------------4ª ETAPA FINALIZADA------------");


                //
                //
                // ***************** 5ªETAPA - CRIAR BOOK E PEDIDO ***************** //
                printMessage("ListenerDirUploadCreateOrder()", "------------5ª ETAPA INICIADA------------");

                printMessage("ListenerDirUploadCreateOrder()", "------------5ª ETAPA FINALIZADA------------");
            
            
            }
            catch (Exception ex)
            {
                printMessageError("ListenerDirUploadCreateOrder()", ex.Message);
            }

        }

        private static void CriarMiniaturas(string Foto, string PathDestino, string NomeFoto)
        {
            try
            {
                using (ImageUtils img = new ImageUtils(Foto))
                {
                    printMessage("CriarThumbs(" + PathDestino + ")", "Cria o THUMB");
                    img.geraImgThumbHighQuality(PathDestino + "t" + NomeFoto, config.ThumbW, config.ThumbH, config.ThumbQ); //Thumb
                    printMessage("CriarThumbs(" + PathDestino + ")", "Cria o MAIN");
                    img.geraImgThumbHighQuality(PathDestino + "f" + NomeFoto, config.MainW, config.MainH, config.MainQ); //Main
                    printMessage("CriarThumbs(" + PathDestino + ")", "Cria o BOOK");
                    img.geraImgThumbHighQuality(PathDestino + "b" + NomeFoto, config.BookW, config.BookH, config.BookQ); //Book
                }

            }
            catch (Exception ex)
            {
                printMessageError("CriarThumbs(" + Foto + ")", ex.Message);
                throw;
            }

        }


    }
}
