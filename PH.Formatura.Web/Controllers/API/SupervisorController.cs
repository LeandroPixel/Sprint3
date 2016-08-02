using Newtonsoft.Json.Linq;
using PH.Formatura.BLL;
using PH.Formatura.DTO;
using PH.Formatura.DTO.Agendamento;
using PH.Formatura.DTO.Supervisor;
using PH.Formatura.Web.Controllers.Base;
using System;
using System.Net.Http;
using System.Web.Http;

namespace PH.Formatura.Web.Controllers.API
{
	public class SupervisorController : BaseAPIController
	{

		[HttpGet]
		public JArray ListAlunos()
		{
			string keyPixel = System.Configuration.ConfigurationManager.AppSettings["KeyPixel"].ToString();
			UserBLL UserBll = new UserBLL(context.db);
			User _User = UserBll.Get(User.Token);
			AlunoBLL alunoBLL = new AlunoBLL(context.db);
			return alunoBLL.List(_User.Brand_ID.Value, null, keyPixel);
		}

		public HttpResponseMessage ChangeVendedor(ChangeVendedor dto)
		{
			SupervisorBLL supervisorBll = new SupervisorBLL(context.db);

			bool ok = supervisorBll.ChangeVendedor(dto);

			AgendamentoBLL agendamentoBll = new AgendamentoBLL(context.db);
			if (dto.vendedorID.HasValue) { 
				agendamentoBll.AssociarAgendamento(dto);
			}

			return Request.CreateResponse(System.Net.HttpStatusCode.OK, new BaseAPI
			{
				Sucesso = ok,
				Mensagem = ok ? "Vendedor alterado com sucesso" : "Erro ao alterar vendedor",
				Obj = dto
			});

		}


        public HttpResponseMessage EnviarEmailCadastroSenhaVendedor(int VendedorID)
        {
            bool sucesso = true;
            string msg = "Email enviado com sucesso";            

            try
            {                
                    UserBLL bll = new UserBLL(context.db);
                    bll.CadastrarSenhaVendedor(VendedorID);                
            }
            catch (Exception e)
            {
                sucesso = false;
                msg = "Erro: " + e.Message + (e.InnerException != null ? " InnerException: " + e.InnerException.ToString() : "");
            }

            return Request.CreateResponse(System.Net.HttpStatusCode.OK, new BaseAPI
            {
                Sucesso = sucesso,
                Mensagem = msg
            });

        }

	}
}