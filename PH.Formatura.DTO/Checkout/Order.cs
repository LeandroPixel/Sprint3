using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
//using System.Web.Mvc;
using System.Xml.Serialization;
using Newtonsoft.Json;

namespace PH.Formatura.DTO
{
    /*
     * ---------------------------------------------------------------------     
     * ESTA CLASSE ESTA DEFINIDA TAMBEM NO PROJETO FORMATURA
     * CASO SEJA NECESSARIO ALTERAR ESTA CLASSE, SERÁ NECESSÁRIO ALTERAR
     * O PROJETO FORMATURA
     * ---------------------------------------------------------------------
     */

    public class OrderFormatura
    {
        [Required]
        public string cpf_cnpj { get; set; }

        [Required]
        public Address endereco { get; set; }

        [Required]
        public int user_id { get; set; } //ID DO VENDEDOR

        public int order_id { get; set; } //SE TIVER ORDER_ID PREENCHIDO, NAO PRECISA INSERIR NOVAMENTE NA ORDER
        public string code { get; set; }

        [Required]
        public int aluno_turma_id { get; set; } //  GRD_CART_PRODUCT.AlunoTurmaID

        //[Required]
        //public string cod_tabela_preco { get; set; }

        [Required]
        public OrderPayment order_payment { get; set; }


        public InfoPgtoCartao dados_pgto_cartao { get; set; }

        [Required]
        public int parcelas { get; set; }

        [Required]
        public decimal total_value { get; set; }

        public bool Sucesso { get; set; }
        public string Mensagem { get; set; }
    }
}
