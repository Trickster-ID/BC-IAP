using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using Project_IAP.Base;
using Project_IAP.Models;
using Project_IAP.Repository.Data;
using Project_IAP.ViewModels;

namespace Project_IAP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserInterviewController : BaseController<UserInterview, UserInterviewRepository>
    {
        private readonly UserInterviewRepository _userinterviewRepository;
        private readonly UserRepository _userRepository;
        public UserInterviewController(UserInterviewRepository userinterviewRepository, UserRepository userRepository) : base(userinterviewRepository)
        {
            this._userinterviewRepository = userinterviewRepository;
            this._userRepository = userRepository;
        }

        [HttpPost]
        [Route("AssignEmployee")]
        public async Task<ActionResult<UserInterview>> AssignEmployee(UserInterview model)
        {
            await _userinterviewRepository.AssignEmployee(model);
            return Ok("Assign Success");
        }

        [HttpGet]
        [Route("DataInterview")]
        public async Task<IEnumerable<InterviewVM>> DataInterview()
        {
            
            return await _userinterviewRepository.DataInterview();
        }
        
        [HttpGet]
        [Route("DataHistory")]
        public async Task<IEnumerable<InterviewVM>> DataHistory()
        {
            return await _userinterviewRepository.DataHistory();
        }

        [HttpPut]
        [Route("ConfirmInterview/{id}")]
        public async Task<ActionResult<UserInterview>> ConfirmInterview(int id, InterviewVM model)
        {
            if (id != model.Id)
            {
                return BadRequest();
            }

            var confirm = await _userinterviewRepository.ConfirmInterview(model.Id);
            await _userRepository.WorkStatusTrue(model.UserId);

            if (confirm != null)
            {
                SendEmail(model, "interview");
                SendEmail(model, "interviewer");
            }
            return Ok("Send mail Interview Success");
        }

        [HttpGet]
        [Route("GetDataSendEmail/{id}")]
        public async Task<IEnumerable<InterviewVM>> GetDataSendEmail(int id)
        {
            return await _userinterviewRepository.GetDataSendEmail(id);
        }

        public IActionResult SendEmail(InterviewVM model, string status)
        {
            var message = new MimeMessage();
            //Pengirim Email, parameter : Nama Pengirim, Email Pengirim
            message.From.Add(new MailboxAddress("Admin", "web.tester1998@gmail.com"));
            
            var date = DateTime.Now.ToShortDateString();
            var interviewdate = model.InterviewDate.ToShortDateString();

            if (status == "interview")
            {
                //Penerima Email, parameter : Nama Penerima, Email Penerima
                message.To.Add(new MailboxAddress(model.FullName, model.EmailUser));
                //Subject
                message.Subject = "Confirmation Interview " + date;
                message.Body = new TextPart("html")
                {
                    Text = "Dear " + model.FullName + ",<br>" +
                "Your Have New Interview!, here Address for Interview : <br>" +
                "Company : " + model.CompanyName + "<br>" +
                "Location : " + model.AddressInterview + "<br>" +
                "Date Interview :" + interviewdate + "<br>" +
                "Best Regards <br>" +
                "Admin"
                };
            }
            
            if (status == "interviewer")
            {
                //Penerima Email, parameter : Nama Penerima, Email Penerima
                message.To.Add(new MailboxAddress(model.Interviewer, model.EmailInterviewer));
                //Subject
                message.Subject = "Schedule Interview " + date;
                message.Body = new TextPart("html")
                {
                    Text = "Dear " + model.Interviewer + ",<br>" +
                "You have an Interview with Candidate, the following details the Interview :<br>" +
                "Location : "+model.AddressInterview + "<br>" +
                "Candidate : "+model.FullName + "<br>" +
                "Date Interview : " + interviewdate + "<br>" +
                "Best Regards <br>" +
                "Admin"
                };
            }

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.gmail.com", 587, false);
                client.Authenticate("web.tester1998@gmail.com", "cgv261479");
                client.Send(message);

                client.Disconnect(true);
            }
            return Ok();
        }
    }
}