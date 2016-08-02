using Newtonsoft.Json.Linq;
using PH.Formatura.DAL;
using PH.Formatura.DTO.Produtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL
{
    public class ProdutosBLL : BaseBLL
    {
        public ProdutosBLL(PixelHouseDBEntities db)
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
                        " where brandID = @param1 " +
                        " order by NomeProduto ");

            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }

        public v_GRD_Products Get(int brandID, int productID)
        {
            return db.v_GRD_Products.Where(o => o.ProductID == productID && o.BrandID == brandID).FirstOrDefault();            
        }

        public JArray GetPacotes()
        {
            List<string> parametros = new List<string>();            
            StringBuilder query = new StringBuilder();
            query.Append(" select * from GRD_Pacote ");
            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }

        private List<Pacote> GetPacotesDefault()
        {
            return (from p in db.GRD_Pacote
                    where p.IsEnabled == true &&
                    p.IsDefault == true
                    orderby p.Ordem
                    select new Pacote()
                    {
                        ID = p.ID,
                        Nome = p.Nome
                    }
                    ).ToList();
        }

        private List<Pacote> GetTurmaPacotes(int turmaID)
        {
            return (from p in db.GRD_Pacote
                    from t in p.GRD_Turma_Pacote
                    where t.GRD_TurmaID == turmaID &&
                    p.IsEnabled == true
                    orderby t.Ordem,p.Ordem
                    select new Pacote()
                    {
                        ID = p.ID,
                        Nome = p.Nome
                    }
                    ).ToList();
        }

        public List<Pacote> GetPacotes(int turmaID) {
            List<Pacote> pacotes = GetTurmaPacotes(turmaID);
            if (pacotes.Count == 0)
                pacotes = GetPacotesDefault();
            return pacotes;
        }

        public List<Pacote> GetPacotesProducts(List<Pacote> pacotes) {      
            List<int> pacotesIds = pacotes.Select(p => p.ID).ToList();
            List<GRD_Pacote> list = db.GRD_Pacote.AsNoTracking().Where(o => pacotesIds.Contains(o.ID)).ToList();
            foreach (var item in pacotes)
            {
                GRD_Pacote pacote = list.Where(o=>o.ID == item.ID).FirstOrDefault();
                List<Products> prods = pacote.Products.ToList();
                item.Products = prods.Select(p=>p.product_id).ToList();    
            }
            return pacotes;
        }

        


        public JArray GetPacotesProducts()
        {
            List<string> parametros = new List<string>();            
            StringBuilder query = new StringBuilder();
            query.Append(" select * from GRD_Pacote_Products ");
            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }        

        public JArray GetPacotesTurma()
        {
            List<string> parametros = new List<string>();            
            StringBuilder query = new StringBuilder();
            query.Append(" select * from grd_turma_pacote ");
            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }

        public JArray GetAlunoPacote()
        {
            List<string> parametros = new List<string>();            
            StringBuilder query = new StringBuilder();
            query.Append(" select * from GRD_Aluno_Pacote ");
            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }       

        public void InsertOrUpdatePacoteUser(int pacoteID, int alunoTurmaID) {
            GRD_Aluno_Pacote alunoPacote = db.GRD_Aluno_Pacote.Where(o => o.GRD_AlunoTurmaID == alunoTurmaID).FirstOrDefault();
            if (alunoPacote == null)
            {
                alunoPacote = db.GRD_Aluno_Pacote.Create();
                alunoPacote.GRD_PacoteID = pacoteID;
                alunoPacote.GRD_AlunoTurmaID = alunoTurmaID;
                alunoPacote.Created = DateTime.Now;
                alunoPacote.LastModified = DateTime.Now;
                db.GRD_Aluno_Pacote.Add(alunoPacote);
            }
            else {
                alunoPacote.LastModified = DateTime.Now;
                alunoPacote.GRD_PacoteID = pacoteID;
            }
            db.SaveChanges();                
        }       
        
        public int? GetPacoteUser(int alunoTurmaID) {
            int? pacote = null;
            GRD_Aluno_Pacote alunoPacote = db.GRD_Aluno_Pacote.AsNoTracking().Where(o => o.GRD_AlunoTurmaID == alunoTurmaID).FirstOrDefault();
            if (alunoPacote != null)
                pacote = alunoPacote.GRD_PacoteID;
            return pacote;
        }
    }
}
