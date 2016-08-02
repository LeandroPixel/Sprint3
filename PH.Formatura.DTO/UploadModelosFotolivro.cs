using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{

    
	public class UploadModelosFotolivro
	{
	
        public string Modelo { get; set; }
		public int ProductID { get; set; }
        public int SizeID { get; set; }
        public int ModelID { get; set; }

	}

    public class ListaModelosFotolivro
    {

        public List<UploadModelosFotolivro> Modelos { get; set; }

    }

}
