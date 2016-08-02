using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
    public class Address
    {
        public int ID { get; set; }      
        [Required(AllowEmptyStrings = false)]
        public string Destinatario { get; set; }        
        [Required(AllowEmptyStrings = false)]
        public string Logradouro { get; set; }
        [Required(AllowEmptyStrings = false)]
        public string Numero { get; set; }
        public string Complemento { get; set; }
        [Required(AllowEmptyStrings = false)]
        public string Bairro { get; set; }
        [Required(AllowEmptyStrings = false)]
        public string Municipio { get; set; }
        [Required(AllowEmptyStrings = false)]
        public string UF { get; set; }
        //public string Pais { get; set; }
        [Required(AllowEmptyStrings = false)]
        public string CEP { get; set; }
        //[Required(AllowEmptyStrings = false)]
        public string NickName { get; set; }
        [Required]
        public bool isFavorite { get; set; }        
        public bool isValid { get; set; }     
    }    

    public class AddressComplete : Address
    {
        [Required(AllowEmptyStrings = false)]
        public string Telefone { get; set; }
    }

    public class GRD_Address
    {
        [Required(AllowEmptyStrings = false)]
        public String Title { get; set; }

        [Required(AllowEmptyStrings = false)]
		public String Receiver { get; set; }

        [Required(AllowEmptyStrings = false)]
        public String AddressLine { get; set; }

        [Required(AllowEmptyStrings = false)]
        public String AddressNumber { get; set; }

        public String AddressComplement { get; set; }

        [Required(AllowEmptyStrings = false)]
        public String Neighbourhood { get; set; }

        [Required(AllowEmptyStrings = false)]
        public String City { get; set; }

        [Required(AllowEmptyStrings = false)]
        public String State { get; set; }

        [Required(AllowEmptyStrings = false)]
        public String Country { get; set; }

        [Required(AllowEmptyStrings = false)]
        public String ZipCode { get; set; }

    }


}
