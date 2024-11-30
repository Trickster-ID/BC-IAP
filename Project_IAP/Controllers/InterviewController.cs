using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Project_IAP.Base;
using Project_IAP.Models;
using Project_IAP.Repository.Data;
using Project_IAP.ViewModels;

namespace Project_IAP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewController : BaseController<Interview, InterviewRepository>
    {
        private readonly InterviewRepository _interviewRepository;
        public InterviewController(InterviewRepository interviewRepository) : base(interviewRepository)
        {
            this._interviewRepository = interviewRepository;
        }

        [HttpGet]
        [Route("List")]
        public async Task<IEnumerable<InterviewVM>> GetAll()
        {
            return await _interviewRepository.GetAllInterview();
        }

    }
}