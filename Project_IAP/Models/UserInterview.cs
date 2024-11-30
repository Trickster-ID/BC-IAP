using Project_IAP.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Project_IAP.Models
{
    [Table("TB_T_UserInterview")]
    public class UserInterview : IEntity
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public int InterviewId { get; set; }
        public virtual Interview Interview { get; set; }
        public Nullable<bool> Status { get; set; }
    }
}
