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
    public class PlacementController : BaseController<Placement, PlacementRepository>
    {
        private readonly PlacementRepository _placementRepository;
        private readonly UserRepository _userRepository;
        private readonly UserInterviewRepository _userinterviewRepository;
        public PlacementController(PlacementRepository placementRepository, UserInterviewRepository userinterviewRepository, UserRepository userRepository) : base(placementRepository)
        {
            this._placementRepository = placementRepository;
            this._userinterviewRepository = userinterviewRepository;
            this._userRepository = userRepository;
        }

        //Data History Admin
        [HttpGet]
        [Route("DataPlacement")]
        public async Task<IEnumerable<InterviewVM>> DataPlacement()
        {
            return await _placementRepository.DataPlacement();
        }
        [HttpGet]
        [Route("DataHistory")]
        public async Task<IEnumerable<PlacementVM>> DataHistory()
        {
            return await _placementRepository.DataHistory();
        }


        //Data Placement User
        [HttpGet]
        [Route("DataUserPlacement/{id}")]
        public async Task<IEnumerable<PlacementVM>> DataUserPlacement(int id)
        {
            return await _placementRepository.DataUserPlacement(id);
        }
        //Data History User
        [HttpGet]
        [Route("DataUserHistory/{id}")]
        public async Task<IEnumerable<PlacementVM>> DataUserHistory(int id)
        {
            return await _placementRepository.DataUserHistory(id);
        }

        [HttpPost]
        [Route("ConfirmPlacement")]
        public async Task<ActionResult<PlacementVM>> ConfirmPlacement(PlacementVM entity)
        {
            await _userinterviewRepository.StatusTrue(entity.Id);
            var confirm = await _placementRepository.ConfirmPlacement(entity);

            if (confirm != null)
            {
                SendEmail(entity, "placement");
            }
            return Ok("Confirmation Placement success");
        }
        [HttpPut]
        [Route("CancelPlacement")]
        public async Task<ActionResult<PlacementVM>> CancelPlacement(PlacementVM entity)
        {
            var cancel = await _userinterviewRepository.StatusTrue(entity.Id);
            await _userRepository.WorkStatusFalse(entity.UserId);

            if (cancel != null)
            {
                SendEmail(entity, "cancel");
            }
            return Ok("Canceled success");
        }

        //Fungsi OffSite
        [HttpPut]
        [Route("ClearPlacement")]
        public async Task<ActionResult<PlacementVM>> ClearPlacement(PlacementVM entity)
        {
            await _userRepository.WorkStatusFalse(entity.UserId);
            await _placementRepository.ClearPlacement(entity.Id);

            return Ok();
        }

        public IActionResult SendEmail(PlacementVM placement, string status)
        {
            var message = new MimeMessage();
            //Pengirim Email, parameter : Nama Pengirim, Email Pengirim
            message.From.Add(new MailboxAddress("Admin", "web.tester1998@gmail.com"));
            //Penerima Email, parameter : Nama Penerima, Email Penerima
            message.To.Add(new MailboxAddress(placement.FullName, placement.EmailUser));

            var date = DateTime.Now.ToShortDateString();
            var interviewdate = placement.InterviewDate.ToShortDateString();

            if (status == "placement")
            {
                //Subject
                message.Subject = "Confirmation Placement " + date;
                message.Body = new TextPart("html")
                {
                    Text = "Dear " + placement.FullName + ",<br>" +
                   "Congratulations! You passed the interview, here your Data Contract : <br>" +
                   "Start Contract : " + placement.StartContract.ToShortDateString() + "<br>" +
                   "End Contract : " + placement.EndContract.ToShortDateString() + "<br><br>" +
                   "Best Regards <br>" +
                   "Admin"
                };
            }
            if (status == "cancel")
            {
                //Subject
                message.Subject = "Job Application Canceled " + date;
                message.Body = new TextPart("html")
                {
                    Text = "Dear " + placement.FullName + ",<br>" +
                   "Sorry, You did not pass this interview, try again in another Interview, Good luck!. <br><br>" +
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