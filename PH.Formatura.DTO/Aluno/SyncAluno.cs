using PH.Formatura.DTO.Offline;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PH.Formatura.DTO.Aluno
{
    public class SyncAluno : Sync
    {
        public List<AlunoGet> Alunos { get; set; }        
    }
}
