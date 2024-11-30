using Microsoft.EntityFrameworkCore;
using Project_IAP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace Project_IAP.Context
{
    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions<MyContext> options) : base(options) { }
        public DbSet<User> user { get; set; }
        public DbSet<Company> company { get; set; }
        public DbSet<Interview> interview { get; set; }
        public DbSet<UserInterview> userinterview { get; set; }
        public DbSet<Placement> placement { get; set; }
        public DbSet<Replacement> replacement { get; set; }
    }
}
