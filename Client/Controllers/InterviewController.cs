using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Project_IAP.Models;
using Project_IAP.ViewModels;
using static Project_IAP.ViewModels.InterviewVM;

namespace Client.Controllers
{
    public class InterviewController : Controller
    {
        private HttpClient client = new HttpClient
        {
            BaseAddress = new Uri("https://localhost:44379/api/")
        };
        public IActionResult Index()
        {
            var role = HttpContext.Session.GetString("Role");
            if (role == "Admin")
            {
                ViewData["Name"] = HttpContext.Session.GetString("FullName");
                ViewData["Email"] = HttpContext.Session.GetString("Email");
                return View();
            }
            else if (role == "User")
            {
                return RedirectToAction("Page404", "Auth");
            }
            else
            {
                return RedirectToAction("Page404", "Auth");
            }
        }

        public JsonResult LoadInterview()
        {
            IEnumerable<InterviewVM> interview = null;
            var responseTask = client.GetAsync("Interview/List");
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var readTask = result.Content.ReadAsAsync<IList<InterviewVM>>();
                readTask.Wait();
                interview = readTask.Result;
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Server Error");
            }
            return Json(interview);
        }

        public JsonResult InsertOrUpdate(Interview interview)
        {
            var myContent = JsonConvert.SerializeObject(interview);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            if (interview.Id.Equals(0))
            {
                var result = client.PostAsync("Interview/", byteContent).Result;
                return Json(result);
            }
            else
            {
                var result = client.PutAsync("Interview/" + interview.Id, byteContent).Result;
                return Json(result);
            }
        }
        public JsonResult GetById(int Id)
        {
            Interview interview = null;
            var responseTask = client.GetAsync("Interview/" + Id);
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var json = JsonConvert.DeserializeObject(result.Content.ReadAsStringAsync().Result).ToString();
                interview = JsonConvert.DeserializeObject<Interview>(json);
            }
            else
            {
                ModelState.AddModelError(string.Empty, "server error, try after some time");
            }
            return Json(interview);
        }

        public JsonResult Delete(int Id)
        {
            var result = client.DeleteAsync("Interview/" + Id).Result;
            return Json(result);
        }

        public JsonResult AssignEmployee(UserInterview model)
        {
            var myContent = JsonConvert.SerializeObject(model);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var result = client.PostAsync("UserInterview/AssignEmployee", byteContent).Result;
            return Json(result);
        }

        public JsonResult LoadEmpInterview()
        {
            IEnumerable<InterviewVM> placement = null;
            var responseTask = client.GetAsync("UserInterview/DataInterview");
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var readTask = result.Content.ReadAsAsync<IList<InterviewVM>>();
                readTask.Wait();
                placement = readTask.Result;
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Server Error");
            }
            return Json(placement);
        }

        public JsonResult LoadHistory()
        {
            IEnumerable<InterviewVM> placement = null;
            var responseTask = client.GetAsync("UserInterview/DataHistory");
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var readTask = result.Content.ReadAsAsync<IList<InterviewVM>>();
                readTask.Wait();
                placement = readTask.Result;
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Server Error");
            }
            return Json(placement);
        }

        public JsonResult GetDataSendEmail(int id)
        {
            IEnumerable<InterviewVM> placement = null;
            var responseTask = client.GetAsync("UserInterview/GetDataSendEmail/" + id);
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var readTask = result.Content.ReadAsAsync<IList<InterviewVM>>();
                readTask.Wait();
                placement = readTask.Result;
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Server error, try after some time");
            }
            return Json(placement);
        }

        public JsonResult ConfirmInterview(InterviewVM model)
        {
            var myContent = JsonConvert.SerializeObject(model);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var result = client.PutAsync("UserInterview/ConfirmInterview/" + model.Id, byteContent).Result;
            return Json(result);
        }
        public JsonResult DeleteUserInterview(int id)
        {
            var result = client.DeleteAsync("UserInterview/" + id).Result;
            return Json(result);
        }
    }
}