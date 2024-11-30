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

namespace Client.Controllers
{
    public class UserController : Controller
    {
        private HttpClient client = new HttpClient
        {
            BaseAddress = new Uri("https://localhost:44379/api/")
        };

        public IActionResult Index()
        {
            var role = HttpContext.Session.GetString("Role");
            if (role == "User")
            {
                ViewData["Name"] = HttpContext.Session.GetString("FullName");
                ViewData["Email"] = HttpContext.Session.GetString("Email");
                return View();
            }
            else if (role == "Admin")
            {
                return RedirectToAction("Page404", "Auth");
            }
            else
            {
                return RedirectToAction("Page404", "Auth");
            }
        }
        public IActionResult Replacement()
        {
            var role = HttpContext.Session.GetString("Role");
            if (role == "User")
            {
                ViewData["Id"] = HttpContext.Session.GetString("Id");
                ViewData["Name"] = HttpContext.Session.GetString("FullName");
                ViewData["Email"] = HttpContext.Session.GetString("Email");
                return View();
            }
            else if (role == "Admin")
            {
                return RedirectToAction("Page404", "Auth");
            }
            else
            {
                return RedirectToAction("Page404", "Auth");
            }
        }

        public JsonResult LoadEmployee()
        {
            IEnumerable<User> user = null;
            var responseTask = client.GetAsync("User/GetAll");
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var readTask = result.Content.ReadAsAsync<IList<User>>();
                readTask.Wait();
                user = readTask.Result;
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Server Error");
            }
            return Json(user);
        }

        public JsonResult LoadUserHistory()
        {
            int id = int.Parse(HttpContext.Session.GetString("Id")); //session id user yang login
            IEnumerable<PlacementVM> placement = null;
            var responseTask = client.GetAsync("Placement/DataUserHistory/" + id);
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var readTask = result.Content.ReadAsAsync<IList<PlacementVM>>();
                readTask.Wait();
                placement = readTask.Result;
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Server Error");
            }
            return Json(placement);
        }

        public JsonResult LoadUserPlacement()
        {
            int id = 1; //session id user yang login
            IEnumerable<PlacementVM> placement = null;
            var responseTask = client.GetAsync("Placement/DataUserPlacement/" + id);
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var readTask = result.Content.ReadAsAsync<IList<PlacementVM>>();
                readTask.Wait();
                placement = readTask.Result;
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Server Error");
            }
            return Json(placement);
        }
        public JsonResult LoadByEmployee()
        {
            int id = int.Parse(HttpContext.Session.GetString("Id"));
            IEnumerable<ReplacementVM> replacement = null;
            var responseTask = client.GetAsync("Replacement/GetByEmployee/" + id);
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var readTask = result.Content.ReadAsAsync<IList<ReplacementVM>>();
                readTask.Wait();
                replacement = readTask.Result;
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Server Error");
            }
            return Json(replacement);
        }
        public JsonResult LoadHistoryByEmployee()
        {
            int id = int.Parse(HttpContext.Session.GetString("Id"));
            IEnumerable<ReplacementVM> replacement = null;
            var responseTask = client.GetAsync("Replacement/GetHistoryByEmployee/" + id);
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var readTask = result.Content.ReadAsAsync<IList<ReplacementVM>>();
                readTask.Wait();
                replacement = readTask.Result;
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Server Error");
            }
            return Json(replacement);
        }
        public JsonResult InsertOrUpdate(Replacement replacement)
        {
            var myContent = JsonConvert.SerializeObject(replacement);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            if (replacement.Id.Equals(0))
            {
                var result = client.PostAsync("Replacement/", byteContent).Result;
                return Json(result);
            }
            else
            {
                var result = client.PutAsync("Replacement/" + replacement.Id, byteContent).Result;
                return Json(result);
            }
        }
        public JsonResult GetById(int id)
        {
            Replacement replacement = null;
            var responseTask = client.GetAsync("Replacement/" + id);
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var json = JsonConvert.DeserializeObject(result.Content.ReadAsStringAsync().Result).ToString();
                replacement = JsonConvert.DeserializeObject<Replacement>(json);
            }
            else
            {
                ModelState.AddModelError(string.Empty, "server error, try after some time");
            }
            return Json(replacement);
        }
        public JsonResult Delete(int id)
        {
            var result = client.DeleteAsync("Replacement/" + id).Result;
            return Json(result);
        }
    }
}