using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Project_IAP.Models;
using Project_IAP.ViewModels;

namespace Client.Controllers
{
    public class PlacementController : Controller
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

       public JsonResult LoadPlacement()
        {
            IEnumerable<InterviewVM> placement = null;
            var responseTask = client.GetAsync("Placement/DataPlacement");
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
            IEnumerable<PlacementVM> placement = null;
            var responseTask = client.GetAsync("Placement/DataHistory");
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

        public JsonResult ConfirmPlacement(PlacementVM placement)
        {
            var myContent = JsonConvert.SerializeObject(placement);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var result = client.PostAsync("Placement/ConfirmPlacement", byteContent).Result;
            return Json(result);
        }

        public JsonResult CancelPlacement(PlacementVM placement)
        {
            var myContent = JsonConvert.SerializeObject(placement);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var result = client.PutAsync("Placement/CancelPlacement", byteContent).Result;
            return Json(result);
        }

        //Fungsi OffSite
        public JsonResult GetDataPlacement(int id)
        {
            Placement placement = null;
            var responseTask = client.GetAsync("Placement/" + id);
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var json = JsonConvert.DeserializeObject(result.Content.ReadAsStringAsync().Result).ToString();
                placement = JsonConvert.DeserializeObject<Placement>(json);
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Server error, try after some time");
            }
            return Json(placement);
        }

        public JsonResult ClearPlacement(PlacementVM placement)
        {
            var myContent = JsonConvert.SerializeObject(placement);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var result = client.PutAsync("Placement/ClearPlacement", byteContent).Result;
            return Json(result);
        }
    }
}