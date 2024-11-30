using System;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Project_IAP.Models;

namespace Client.Controllers
{
    public class CompanyController : Controller
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
        public JsonResult LoadCompany()
        {
            CompanyJson company = null;
            var responseTask = client.GetAsync("Company");
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var json = JsonConvert.DeserializeObject(result.Content.ReadAsStringAsync().Result).ToString();
                company = JsonConvert.DeserializeObject<CompanyJson>(json);
            }
            else
            {
                ModelState.AddModelError(string.Empty, "Server Error");
            }
            return Json(company);
        }

        public JsonResult InsertOrUpdate(Company company)
        {
            var myContent = JsonConvert.SerializeObject(company);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            if (company.Id.Equals(0))
            {
                var result = client.PostAsync("Company/", byteContent).Result;
                return Json(result);
            }
            else
            {
                var result = client.PutAsync("Company/" + company.Id, byteContent).Result;
                return Json(result);
            }
        }
        public JsonResult GetById(int id)
        {
            Company company = null;
            var responseTask = client.GetAsync("Company/" + id);
            responseTask.Wait();
            var result = responseTask.Result;
            if (result.IsSuccessStatusCode)
            {
                var json = JsonConvert.DeserializeObject(result.Content.ReadAsStringAsync().Result).ToString();
                company = JsonConvert.DeserializeObject<Company>(json);
            }
            else
            {
                ModelState.AddModelError(string.Empty, "server error, try after some time");
            }
            return Json(company);
        }
        public JsonResult Delete(int id)
        {
            var result = client.DeleteAsync("Company/" + id).Result;
            return Json(result);
        }
    }
}