using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO.Offline
{
    public class Sync
    {
        public List<SyncTable> Tabelas { get; set; }
    }

    public class SyncTable{
        [Required(AllowEmptyStrings=false)]
        public string Name { get; set; }
        [Required]
        public DateTime LastSync { get; set; }
    }
}
