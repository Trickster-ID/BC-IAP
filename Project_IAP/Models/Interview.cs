using Project_IAP.Base;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_IAP.Models
{
    [Table("TB_T_Interview")]
    public class Interview : IEntity
    {
        [Key]
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public virtual Company Company { get; set; }
        public string Title { get; set; }
        public string Division { get; set; }
        public string JobDesk { get; set; }
        public DateTime InterviewDate { get; set; }
        public string AddressInterview { get; set; }
        public string Interviewer { get; set; }
        public string EmailInterviewer { get; set; }
    }
}
