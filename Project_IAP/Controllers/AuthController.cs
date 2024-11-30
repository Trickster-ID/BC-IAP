using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Project_IAP.Context;
using Project_IAP.Models;
using Project_IAP.Repository.Data;

namespace Project_IAP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MyContext _myContext;
        public IConfiguration _configuration;

        public AuthController(
            IConfiguration config,
            MyContext myContext)
        {
            _configuration = config;
            _myContext = myContext;
        }

        [HttpPost]
        [Route("Login")]
        public async Task<ActionResult> Login(User model)
        {
            var email = await _myContext.user.FirstOrDefaultAsync(e => e.Email == model.Email);
            var pass = await _myContext.user.FirstOrDefaultAsync(e => e.Password == model.Password);
            if (email != null && pass != null) 
            {
                var users = await GetUser(model.Email); 
                if (users != null)
                {
                    string FullName = users.FirstName + ' ' + users.LastName;
                    //JWT
                    var claims = new[] {
                    new Claim("Id", users.Id.ToString()),
                    new Claim("FullName", FullName),
                    new Claim("Email", users.Email),
                    new Claim("Role", users.Role)
                   };

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                    var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(_configuration["Jwt:Issuer"], _configuration["Jwt:Audience"], claims, expires: DateTime.UtcNow.AddDays(1), signingCredentials: signIn); //To Create Token JWT
                    return Ok(new JwtSecurityTokenHandler().WriteToken(token)); //Return token after login
                    //End JWT
                }
                else
                {
                    return BadRequest("Invalid credentials");
                }
            }
            else
            {
                return BadRequest();
            }
        }
        private async Task<User> GetUser(string email)
        {
            return await _myContext.user.FirstOrDefaultAsync(e => e.Email == email);
        }
    }
}