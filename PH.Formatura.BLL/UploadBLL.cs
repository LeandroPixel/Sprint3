using Newtonsoft.Json.Linq;
using PH.Formatura.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EntityFramework.BulkInsert.Extensions;
using System.Transactions;

namespace PH.Formatura.BLL
{
    public class UploadBLL : BaseBLL
    {
        public UploadBLL(PixelHouseDBEntities db)
            : base(db)
        {

        }

        public JArray Get(int brandID)
        {
            List<string> parametros = new List<string>();
            parametros.Add(brandID.ToString());
            StringBuilder query = new StringBuilder();
            query.Append(" select * " +
                        " from v_GRD_Products " +
                        " where brandID = @param1 ");


            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());

        }


        /// <summary>
        /// Verifica se a turma existe.
        /// </summary>
        /// <param name="pit">Código utilizado pela CP7 para identificar uma turma</param>
        /// <returns></returns>
        public bool ExistePIT(string pit)
        {

            GRD_Turma t = (from T in db.GRD_Turma.AsNoTracking() where T.PIT == pit select T).FirstOrDefault();

            //Turma CADASTRADA (TRUE),  Turma NÃO CADASTRADA (FALSE)
            return !(t == null);

        }

        /// <summary>
        /// Rotina responsável por inserir na tabela GRD_Process_Upload utilizando BulkInsert
        /// </summary>
        /// <param name="ProcessUpload">Lista de fotos para inserir na tabela GRD_Process_Upload</param>
        public void PopulaProcessUpload(List<GRD_Process_Upload> ProcessUpload)
        {
            if (ProcessUpload.Count() > 0)
            {
                using (var transactionScope = new TransactionScope())
                {
                    db.BulkInsert(ProcessUpload);
                    db.SaveChanges();
                    transactionScope.Complete();
                }
            }
        }

        /// <summary>
        /// Rotina que retorna os dados do aluno turma. Nesta rotina é criado o albumID caso não exista.
        /// </summary>
        /// <param name="PIT"></param>
        /// <param name="Cp7AlunoID">ID do aluno na CP7</param>
        /// <param name="UserIDMaster">UserIDmaster. user id do adm do sistema</param>
        /// <returns>Retorna pr_GRD_AlunoUpload_Result sempre com um registro. O campo AlunoTurmaID = 0 significa que não encontrou o aluno/turma</returns>
        public pr_GRD_AlunoUpload_Result GetAlunoTurma(string PIT, string Cp7AlunoID, int UserIDMaster)
        {
            return db.pr_GRD_AlunoUpload(PIT, Cp7AlunoID, UserIDMaster).FirstOrDefault();
        }

        /// <summary>
        /// Rotina que inclui os dados de aluno e turma que estão sendo feitos por fora do fluxo do tablet.
        /// </summary>
        /// <param name="AlunoTurma">Dados do AlunoTurma. Se o ID for ZERO significa que é uma inclusão</param>
        /// <returns>Retorna os dados de aluno e turma</returns>
        public pr_GRD_SaveTurmaAlunoPorFora_Result SaveTurmaAlunoPorFora(pr_GRD_SaveTurmaAlunoPorFora_Result AlunoTurma)
        {
            return db.pr_GRD_SaveTurmaAlunoPorFora(AlunoTurma.ID, AlunoTurma.UserID, AlunoTurma.PIT, AlunoTurma.Nome, AlunoTurma.AlbumID, AlunoTurma.OrderID, AlunoTurma.BookID).FirstOrDefault();
        }

        /// <summary>
        /// Rotina responsável por pegar os registros na tabela GRD_Process_Upload com status='PP' e criar os registros nas tabelas Photos,inodes e carrega nas tabelas de formatura.
        /// Esta rotina utiliza o campo GRD_Process_Upload.Path para salvar na inodes.
        /// </summary>
        public void CreatePhoto()
        {
            db.pr_GRD_CreatePhoto();
        }

        /// <summary>
        /// Rotina responsável retornar a listagem de photos com INODEID e PHOTOID criados.
        /// where GRD_Process_Upload.status='PU' Pendente de UPLOAD
        /// </summary>
        /// <param name="Limit">Definir limite de registros para retorno</param>
        /// <returns>Retorna lista de photos GRD_Process_Upload </returns>
        public List<GRD_Process_Upload> GetFotosPendenteUpload(int Limit)
        {
            List<GRD_Process_Upload> t = (from T in db.GRD_Process_Upload.AsNoTracking() where T.Status == "PU" select T).Take(Limit).ToList();
            return t;
        }


        /// <summary>
        /// Rotina responsável por atualizar o status da tabela GRD_Process_Upload
        /// </summary>
        /// <param name="ProcessUpload">Lista de fotos com status para atualização</param>
        public void UploadUpdateStatus(List<GRD_Process_Upload> ProcessUpload)
        {
            if (ProcessUpload.Count() > 0)
            {
                foreach (var item in ProcessUpload)
                {
                    db.pr_GRD_UpdateProcessUpload(item.ID, item.Status, item.Msg);
                }
            }
        }


    }
}
