using Newtonsoft.Json;
using Project_IAP.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_IAP.Models
{
    [Table("TB_M_Placement")]
    public class Placement : IEntity
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public int CompanyId { get; set; }
        public virtual Company company { get; set; }
        public Nullable<DateTime> StartContract { get; set; }
        public Nullable<DateTime> EndContract { get; set; }
        public Nullable<bool> Status { get; set; }
    }
}
