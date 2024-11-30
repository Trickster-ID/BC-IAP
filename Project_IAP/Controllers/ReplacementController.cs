using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Http;
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
    public class ReplacementController : BaseController<Replacement, ReplacementRepository>
    {
        private readonly ReplacementRepository _replacementRepository;
        public ReplacementController(ReplacementRepository replacementRepository) : base(replacementRepository)
        {
            _replacementRepository = replacementRepository;
        }
        [HttpGet]
        [Route("List")]
        public async Task<IEnumerable<ReplacementVM>> GetAll()
        {
            return await _replacementRepository.GetAllReplacement();
        }
        [HttpGet]
        [Route("History")]
        public async Task<IEnumerable<ReplacementVM>> GetHistory()
        {
            return await _replacementRepository.GetHistoryReplacement();
        }
        [HttpGet]
        [Route("GetByStatus/{id}")]
        public async Task<IEnumerable<ReplacementVM>> GetByStatus(int id)
        {
            return await _replacementRepository.GetByStatus(id);
        }
        [HttpPut]
        [Route("CancelReplacement/{id}")]
        public async Task<ActionResult<ReplacementVM>> CancelPlacement(int id, ReplacementVM entity)
        {
            if (id != entity.Id)
            {
                return BadRequest();
            }
            var confirm = await _replacementRepository.CancelReplacement(entity.Id);
            if (confirm != null)
            {
                SendEmail(entity, "cancel");
            }
            return Ok("Canceled success");
        }

        [HttpPut]
        [Route("ConfirmReplacement/{id}")]
        public async Task<ActionResult<ReplacementVM>> ConfirmInterview(int id, ReplacementVM entity)
        {
            if (id != entity.Id)
            {
                return BadRequest();
            }

            var confirm = await _replacementRepository.ConfirmReplacement(entity.Id);
            if (confirm != null)
            {
                SendEmail(entity, "confirm");
            }
            return Ok("Confirmation success, Employee Interview");
        }
        [HttpGet]
        [Route("GetByEmployee/{id}")]
        public async Task<IEnumerable<ReplacementVM>> GetByEmployee(int id)
        {
            return await _replacementRepository.GetByEmployee(id);
        }
        [HttpGet]
        [Route("GetHistoryByEmployee/{id}")]
        public async Task<IEnumerable<ReplacementVM>> GetHistoryByEmployee(int id)
        {
            return await _replacementRepository.GetHistoryByEmployee(id);
        }
        public IActionResult SendEmail(ReplacementVM replacement, string status)
        {
            var message = new MimeMessage();
            //Pengirim Email, parameter : Nama Pengirim, Email Pengirim
            message.From.Add(new MailboxAddress("Admin", "web.tester1998@gmail.com"));
            //Penerima Email, parameter : Nama Penerima, Email Penerima
            message.To.Add(new MailboxAddress(replacement.FullName, replacement.Email));

            var date = DateTime.Now.ToShortDateString();
            var interviewdate = replacement.ReplacementDate.ToShortDateString();

            if (status == "confirm")
            {
                //Subject
                message.Subject = "Confirmation Replacement " + date;
                message.Body = new TextPart("html")
                {
                    Text = "Dear " + replacement.FullName + ",<br>" +
                   "Your Request has been Confirmed, here your Data Replacement : <br>" +
                   "Reason : " + replacement.ReplacementReason.ToString() + "<br>" +
                   "Detail : " + replacement.Detail.ToString() + "<br>" +
                   "Date Request : " + replacement.ReplacementDate.ToShortDateString() + "<br><br>" +
                   "Best Regards <br>" +
                   "Admin"//For Body Message
                };
            }
            if (status == "cancel")
            {
                //Subject
                message.Subject = "Replacement Rejected " + date;
                message.Body = new TextPart("html")
                {
                    Text = "Dear " + replacement.FullName + ",<br>" +
                   "Sorry, your replacement request has been rejected.<br><br>" +
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