using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO
{
    public class RetornoRequestAPI
    {
        public StatusApiCart StatusRetorno { get; set; }
        public string Mensagem { get; set; }
        public Object objRetorno { get; set; }
    }

    public class retornoApiCepInfo
    {

        public bool Success { get; set; }
        public CepInfo CepInfo { get; set; }

    }

    public class retornoApiAddress
    {

        public bool Success { get; set; }
        public Address Address { get; set; }

    }

 }
