using Project_IAP.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Project_IAP.Models
{
    [Table("TB_T_Replacement")]
    public class Replacement : IEntity
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public string ReplacementReason { get; set; }
        public string Detail { get; set; }
        public DateTime ReplacementDate { get; set; }
        public Nullable<bool> Confirmation { get; set; }
    }
}
