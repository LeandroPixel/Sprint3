using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PH.Formatura.DAL;
using PH.Formatura.DTO;
using PH.Formatura.Cache;
using PH.Formatura.BLL.Util;



namespace PH.Formatura.BLL
{
    public class ProductsBLL : BaseBLL
    {
        public ProductsBLL(PixelHouseDBEntities db)
            : base(db)
        {
        }

        public List<pr_GRD_ProductsAluno_Result> RetornaProdutosAlunoTurma(int AlunoTurmaID)
        {
            List<pr_GRD_ProductsAluno_Result> retorno = this.db.pr_GRD_ProductsAluno(AlunoTurmaID).ToList();
            return retorno;

        }

        public bool HasPhotoSelect(int AlunoTurmaID)
        {
            return db.GRD_Order_Product_Photos.Where(o=>o.AlunoTurmaID == AlunoTurmaID && o.OrderID == null).Count() > 0;
        }

    }


}