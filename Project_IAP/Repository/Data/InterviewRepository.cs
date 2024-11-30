using Dapper;
using Microsoft.Extensions.Configuration;
using Project_IAP.Context;
using Project_IAP.Models;
using Project_IAP.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Project_IAP.Repository.Data
{
    public class InterviewRepository : GeneralRepository<Interview, MyContext>
    {
        private readonly MyContext _myContext;
        DynamicParameters parameters = new DynamicParameters();
        IConfiguration _configuration { get; }
        public InterviewRepository (MyContext mycontexts, IConfiguration configuration) : base(mycontexts)
        {
            _configuration = configuration;
            _myContext = mycontexts;
        }
        public async Task<IEnumerable<InterviewVM>> GetAllInterview()
        {
            using (var connection = new SqlConnection(_configuration.GetConnectionString("MyConnection")))
            {
                var spName = "SP_Retrieve_TB_T_Interview";
                var data = await connection.QueryAsync<InterviewVM>(spName, commandType: CommandType.StoredProcedure);
                return data;
            }
        }
    }
}
