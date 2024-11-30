using Project_IAP.Context;
using Project_IAP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project_IAP.Repository.Data
{
    public class CompanyRepository : GeneralRepository<Company, MyContext>
    {
        public CompanyRepository(MyContext mycontexts) : base(mycontexts)
        {

        }
    }
}
