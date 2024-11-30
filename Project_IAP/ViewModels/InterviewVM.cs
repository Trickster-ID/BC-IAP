using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Project_IAP.ViewModels
{
    public class InterviewVM
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CompanyId { get; set; }
        public int InterviewId { get; set; }
        public string FullName { get; set; }
        public string Interviewer { get; set; }
        public string CompanyName { get; set; }
        public string Title { get; set; }
        public string Division { get; set; }
        public string JobDesk { get; set; }
        public DateTime InterviewDate { get; set; }
        public string AddressInterview { get; set; }
        public string EmailUser { get; set; }
        public string EmailCompany { get; set; }
        public string EmailInterviewer { get; set; }
        public int Status { get; set; }
    }
}
