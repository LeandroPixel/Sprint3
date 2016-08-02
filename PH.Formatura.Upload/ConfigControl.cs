using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace PH.Formatura.Upload
{
    class ConfigControl
    {
        public String PathReadPhotosCreateBook { get; set; }
        public String PathReadPhotos { get; set; }
        public Boolean PrintExecute { get; set; }
        public int QtdFotosUpload { get; set; }
        public int QtdThreadPool { get; set; }
        
        public int ThumbW { get; set; }
        public int ThumbH { get; set; }
        public int MainW { get; set; }
        public int MainH { get; set; }
        public int BookW { get; set; }
        public int BookH { get; set; }

        public int ThumbQ { get; set; }
        public int MainQ { get; set; }
        public int BookQ { get; set; }

        public PH.Formatura.DTO.ListaModelosFotolivro Modelos { get; set; }

        public ConfigControl() {
            

            PrintExecute = Convert.ToBoolean(ConfigurationManager.AppSettings["PrintExecute"]);
            PathReadPhotosCreateBook = ConfigurationManager.AppSettings["PathReadPhotosCreateBook"];
            PathReadPhotos = ConfigurationManager.AppSettings["PathReadPhotos"];
            QtdFotosUpload = Convert.ToInt32(ConfigurationManager.AppSettings["QtdFotosUpload"]);
            QtdThreadPool = Convert.ToInt32(ConfigurationManager.AppSettings["QtdThreadPool"]);

            ThumbW = Convert.ToInt32(ConfigurationManager.AppSettings["ThumbW"]);
            ThumbH = Convert.ToInt32(ConfigurationManager.AppSettings["ThumbH"]);
            MainW = Convert.ToInt32(ConfigurationManager.AppSettings["MainW"]);
            MainH = Convert.ToInt32(ConfigurationManager.AppSettings["MainH"]);
            BookW = Convert.ToInt32(ConfigurationManager.AppSettings["BookW"]);
            BookH = Convert.ToInt32(ConfigurationManager.AppSettings["BookH"]);

            ThumbQ = Convert.ToInt32(ConfigurationManager.AppSettings["ThumbQ"]);
            MainQ = Convert.ToInt32(ConfigurationManager.AppSettings["MainQ"]);
            BookQ = Convert.ToInt32(ConfigurationManager.AppSettings["BookQ"]);

            Modelos = new DTO.ListaModelosFotolivro();
            Modelos = Newtonsoft.Json.JsonConvert.DeserializeObject<DTO.ListaModelosFotolivro>(ConfigurationManager.AppSettings["ModelosFotolivro"]);

            
        }

    }
}
