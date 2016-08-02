using PH.Formatura.DAL;
using PH.Formatura.DTO.Supervisor;
using System.Collections.Generic;
using System.Linq;

namespace PH.Formatura.BLL
{
	public class SupervisorBLL : BaseBLL
	{
		public SupervisorBLL(PixelHouseDBEntities db): base(db){
		}

		public List<Vendedor> GetVendedores(){
			List<Vendedor> vendedores = (from v in db.GRD_Vendedor
                                         where v.isDeleted==false
					select new Vendedor{
							ID			= v.ID
						,	Descricao	= v.Nome
					}).ToList();
			vendedores.Add(new Vendedor() { ID = null, Descricao = "Vendedor não selecionado" });

			return vendedores;
		}

		public bool ChangeVendedor(ChangeVendedor dto){
			GRD_Aluno_Turma alunoTurma = db.GRD_Aluno_Turma.Where(o => o.ID == dto.alunoTurmaID).FirstOrDefault();
			if (alunoTurma != null){
				alunoTurma.VendedorID = dto.vendedorID;
				db.SaveChanges();
			}
			return true;
		}
	}
}