using Newtonsoft.Json;
using Project_IAP.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Project_IAP.Models
{
    [Table("TB_M_User")]
    public class User : IEntity
    {
        [Key]
        public int Id { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public DateTime BirthDate { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public string Experience { get; set; }
        public string LastEducation { get; set; }
        public string Religion { get; set; }
        public string Batch { get; set; }
        public string Class { get; set; }
        public bool WorkStatus { get; set; }
    }
    public class UserJson
    {
        [JsonProperty("data")]
        public IList<User> data { get; set; }
    }
}
