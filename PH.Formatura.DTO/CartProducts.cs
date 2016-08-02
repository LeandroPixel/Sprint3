using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
    public class CartProduct : CartProductBase
    {
        [Required]
        public int ProductID {get; set;}

        [Required]
        public int Qtd {get; set;}
	    
        public int QtdFoto {get; set;}
        public int BookID { get; set; }
        
    }

    public class CartProductCheckout: CartProduct
    {
        public bool Checked { get; set; }
        public string ProductName { get; set; }
        public bool UsaPrecoPorFoto { get; set; }
        public decimal Valor { get; set; }

        public bool     ExibirCarrinho      { get; set; }
        public int      QtdMaxFoto          { get; set; }
        public int      QtdMinFoto          { get; set; }
        public decimal  PercentualDescarte  { get; set; }
        public int AlbumID { get; set; }

        public string param_selecao_fotos { get; set; }

        public bool ProdutoObrigatorio { get; set; }
    }

    public class CartProductBase {
        [Required]
        public int UserID { get; set; }
        [Required]
        public int AlunoTurmaID { get; set; }
    }
}
