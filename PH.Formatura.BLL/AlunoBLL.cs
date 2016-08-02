using Newtonsoft.Json.Linq;
using PH.Core.Encryption;
using PH.Formatura.BLL.Util;
using PH.Formatura.DAL;
using PH.Formatura.DTO.Agendamento;
using PH.Formatura.DTO.Aluno;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.BLL
{
    public class AlunoBLL : BaseBLL 
    {
        public AlunoBLL(PixelHouseDBEntities db)
			: base(db)
		{
		}

        public JArray List(int brandID, int? UserIDvENDEDOR,string keyPixel)
        {
            List<string> parametros = new List<string>();
            parametros.Add(brandID.ToString());
            StringBuilder query = new StringBuilder();
            query.Append(" select * " +
                        " from v_GRD_ListaAlunos " +
                        " where brandID = @param1 ");

            if (UserIDvENDEDOR.HasValue)
            {
                query.Append("and UserIDvENDEDOR = @param2");
                parametros.Add(UserIDvENDEDOR.Value.ToString());
            }
            JArray ret = SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
            CriptAlunoAlbum(ret, keyPixel);                                    
            return ret;   
        }

        public JArray Get(int brandID, List<AlunoGet> dto, int? UserIDvENDEDOR, string keyPixel)
        {
            List<string> parametros = new List<string>();
            parametros.Add(brandID.ToString());
            StringBuilder query = new StringBuilder();
            query.Append(" select * " +
                        " from v_GRD_ListaAlunos " +
                        " where brandID = @param1 ");

            int i = 2;
            ConditionAlunoIn(ref i, parametros, dto, "AlunoID", query);

            ConditionAlunoIn(ref i, parametros, dto, "TurmaID", query);

            ConditionAlunoIn(ref i, parametros, dto, "VendedorID", query);

            if (UserIDvENDEDOR.HasValue)
            {
                query.Append(" and UserIDvENDEDOR = @param" + (i));
                parametros.Add(UserIDvENDEDOR.Value.ToString());
            }
            JArray ret = SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
            CriptAlunoAlbum(ret, keyPixel);                                    
            
            return ret;
        }

        public JArray Get(int brandID, int AlunoTurmaID, string keyPixel)
        {
            List<string> parametros = new List<string>();
            parametros.Add(brandID.ToString());
            parametros.Add(AlunoTurmaID.ToString());

            StringBuilder query = new StringBuilder();
            query.Append(" select * " +
                        " from v_GRD_ListaAlunos " +
                        " where brandID = @param1 and AlunoTurmaID = @param2 ");

            JArray ret = SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
            CriptAlunoAlbum(ret, keyPixel);

            return ret;
        }

        private void CriptAlunoAlbum(JArray ret, string keyPixel)
        {
            RC4 rc4 = new RC4(keyPixel);
            foreach (JObject item in ret)
            {
                string album_id = item["AlbumID"].ToString();
                item.Add("AlbumID_Cript", string.IsNullOrEmpty(album_id) ? "" : rc4.Encript(album_id));
                item.Add("AlunoTurmaID_Cript", rc4.Encript(item["AlunoTurmaID"].ToString()));
            }
        }

        private void ConditionAlunoIn(ref int i, List<string> parametros, List<AlunoGet> dto, string name, StringBuilder query)
        { 
            StringBuilder aux = new StringBuilder();
            foreach (var item in dto)
            {
                aux.Append(" @param" + i + ",");
                parametros.Add(item.GetType().GetProperty(name).GetValue(item, null).ToString());
                i++;
            }
            query.Append(" and " + name + " in (" + aux.ToString().Substring(0, aux.ToString().Length - 1) + ")");
            aux.Clear();            
        }

        public List<Status> GetStatus()
        {
            return (from S in db.GRD_Status
                    select new Status
                    {
                        ID = S.ID,
                        Descricao = S.Descricao
                    }).ToList();                     
        }

        public JArray GetAlunoTurmaPhotos(int[] alunoTurmaIDs)
        {
            List<string> parametros = new List<string>();            
            StringBuilder query = new StringBuilder();
            query.Append(" select * " +
                        " from GRD_AlunoTurma_Photos ");
            int i = 1;
            ConditionIn(ref i, parametros, alunoTurmaIDs, query, "AlunoTurmaID");
            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }

        private void ConditionIn(ref int i, List<string> parametros, int[] alunoTurmaIDs, StringBuilder query, string name, string condicao = "where")
        {
            StringBuilder aux = new StringBuilder();
            foreach (var item in alunoTurmaIDs)
            {
                aux.Append(" @param" + i + ",");
                parametros.Add(item.ToString());
                i++;
            }
            query.Append(" " + condicao + " " + name + " in (" + aux.ToString().Substring(0, aux.ToString().Length - 1) + ")");
            aux.Clear();
        }

        public JArray GetOrderProduct(int[] alunoTurmaIDs)
        {
            List<string> parametros = new List<string>();            
            StringBuilder query = new StringBuilder();
            query.Append(" select * " +
                        " from GRD_ORDER_PRODUCT_PHOTOS " +
                        " where OrderID is null ");
            int i = 1;
            ConditionIn(ref i, parametros, alunoTurmaIDs, query, "AlunoTurmaID", "and");
            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }   

        public JArray GetCartProduct(int[] alunoTurmaIDs)
        {
            List<string> parametros = new List<string>();            
            StringBuilder query = new StringBuilder();
            query.Append(" select * " +
                        " from GRD_CART_PRODUCT ");
            int i = 1;
            ConditionIn(ref i, parametros, alunoTurmaIDs, query, "AlunoTurmaID");
            return SqlDynamic.Execute(db, query.ToString(), parametros.ToArray());
        }

        public List<PhotoSync> GetPhotosAlbum(int[] albumIDs, string keyPixel, bool ambienteTeste = false)
        {
            List<PhotoSync> fotos = new List<PhotoSync>();
            AgendamentoBLL bll = new AgendamentoBLL(this.db);
            for (int i = 0; i < albumIDs.Length; i++)
            {
                List<PhotoSync> fotos_aux = bll.GetFotosAlbumSync(albumIDs[i]);
                //TODO remover para teste
                //fotos_aux = fotos_aux.Take(2).ToList();                
                foreach (var item in fotos_aux)
                {
                    item.PhotoIDCript = new RC4(keyPixel).Encript(item.PhotoID.ToString());
                    if (ambienteTeste)
                        item.PathMain = @"C:\storage\f"+item.InodeID+".jpg";
						//item.PathMain = item.PathMain.Replace("192.168.140.", "192.168.150.").Replace("192.168.110.", "192.168.150.");
                    item.RenderMain = Img.ImageToBase64(item.PathMain);
                }                
                fotos.AddRange(fotos_aux);
            }
            return fotos;            
        }        

        public int GetTurmaID(int alunoTurmaID) {
            return db.GRD_Aluno_Turma.AsNoTracking().Where(o => o.ID == alunoTurmaID).Select(o => o.TurmaID).FirstOrDefault();
        }
    }
}
