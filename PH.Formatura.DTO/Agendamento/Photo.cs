using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;
using System.ComponentModel.DataAnnotations;

namespace PH.Formatura.DTO.Agendamento
{
    public class Photo : PhotoBase
    {        
        [JsonIgnore]
        [XmlIgnore]
        public int PhotoID { get; set; }        
        
        public bool Selected { get; set; }
    }

    public class PhotoBase
    {
        [JsonIgnore]
        [XmlIgnore]
        public int InodeID { get; set; }
        [JsonIgnore]
        [XmlIgnore]
        public string Path { get; set; }
        [JsonIgnore]
        [XmlIgnore]
        public string PathBook { get; set; }
        [JsonIgnore]
        [XmlIgnore]
        public string PathThumb { get; set; }
        [JsonIgnore]
        [XmlIgnore]
        public string PathMain { get; set; }

        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public DateTime CreationDate { get; set; }
        public string Nome { get; set; }

        public string RenderThumb { get; set; }
        public string RenderBook { get; set; }
        public string RenderMain { get; set; }

        public string PhotoIDCript { get; set; }
    }

    public class PhotoSync : PhotoBase
    {
        public int PhotoID { get; set; }
    }

    public class PhotoSelected {
        [Required(AllowEmptyStrings=false)]
        public string PhotoIDCript { get; set; }
        [Required]
        public bool Selected { get; set; }
    }

    public class AlbumSelected
    {
        [Required(AllowEmptyStrings = false)]
        public string AlbumIDCript { get; set; }
        [Required]
        [ValidacaoDeNumeros]
        public int AlunoTurmaID { get; set; }
        [Required]
        [ValidacaoDeNumeros]
        public int ProductID { get; set; }
        [Required]
        [ValidacaoDeNumeros]
        public int QtdMinFoto { get; set; }
        [Required]
        [ValidacaoDeNumeros]
        public int QtdMaxFoto { get; set; }
        [Required]        
        public bool isFirstAcess { get; set; }
        [Required]
        public List<PhotoSelected> fotos { get; set; }
    }
}
