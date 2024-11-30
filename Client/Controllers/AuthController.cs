using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Project_IAP.Models;

namespace Client.Controllers
{
    public class AuthController : Controller
    {
        private HttpClient client = new HttpClient
        {
            BaseAddress = new Uri("https://localhost:44379/api/")
        };


        [HttpGet]
        public IActionResult Login()
        {
            var role = HttpContext.Session.GetString("Role");
            if (role == null)
            {
                return View();
            }
            else if (role == "Admin")
            {
                return RedirectToAction("Index", "Company");
            }
            else if (role == "User")
            {
                return RedirectToAction("Index", "User");
            }
            else
            {
                return BadRequest();
            }
        }
        public IActionResult Page404()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(User model)
        {
            var myContent = JsonConvert.SerializeObject(model);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            var result = client.PostAsync("Auth/Login", byteContent).Result;

            if (result.IsSuccessStatusCode)
            {
                var data = result.Content.ReadAsStringAsync().Result;

                var handler = new JwtSecurityTokenHandler();
                var tokens = handler.ReadJwtToken(data);
                var token = "Bearer " + data;

                string Id = tokens.Claims.First(claim => claim.Type == "Id").Value;
                string role = tokens.Claims.First(claim => claim.Type == "Role").Value;
                string email = tokens.Claims.First(claim => claim.Type == "Email").Value;
                string FName = tokens.Claims.First(claim => claim.Type == "FullName").Value;

                HttpContext.Session.SetString("Id", Id);
                HttpContext.Session.SetString("FullName", FName);
                HttpContext.Session.SetString("Role", role);
                HttpContext.Session.SetString("Email", email);
                HttpContext.Session.SetString("JWToken", token);

                if (role == "Admin")
                {
                    return RedirectToAction("Index", "Company");
                }
                else if (role == "User")
                {
                    return RedirectToAction("Index", "User");
                }

                return View(result);
            }
            else
            {
                return View(result);
            }
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Remove("Id");
            HttpContext.Session.Remove("Role");
            HttpContext.Session.Remove("Email");
            HttpContext.Session.Remove("JWToken");

            return RedirectToAction("Login", "Auth");
        }
    }
}