using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project_IAP.ViewModels
{
    public class ReplacementVM
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string ReplacementReason { get; set; }
        public string Detail { get; set; }
        public string Email { get; set; }
        public DateTime ReplacementDate { get; set; }
        public Nullable<bool> Confirmation { get; set; }
    }
}
