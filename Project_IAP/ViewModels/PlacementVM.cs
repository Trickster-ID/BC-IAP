using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project_IAP.ViewModels
{
    public class PlacementVM
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CompanyId { get; set; }
        public int InterviewId { get; set; }
        public string FullName { get; set; }
        public string CompanyName { get; set; }
        public string Title { get; set; }
        public string Division { get; set; }
        public string JobDesk { get; set; }
        public DateTime InterviewDate { get; set; }
        public string AddressInterview { get; set; }
        public string Address { get; set; }
        public string EmailUser { get; set; }
        public DateTime StartContract { get; set; }
        public DateTime EndContract { get; set; }
        public int Status { get; set; }
    }
    public class PlacementJson
    {
        [JsonProperty("data")]
        public IList<PlacementVM> data { get; set; }
    }
}