using Dapper;
using Microsoft.EntityFrameworkCore;
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
    public class UserInterviewRepository : GeneralRepository<UserInterview, MyContext>
    {
        private readonly MyContext _myContext;
        DynamicParameters parameters = new DynamicParameters();
        IConfiguration _configuration { get; }

        public UserInterviewRepository(MyContext mycontexts, IConfiguration configuration) : base(mycontexts)
        {
            _configuration = configuration;
            _myContext = mycontexts;
        }

        public async Task<UserInterview> AssignEmployee(UserInterview entity)
        {
            await _myContext.Set<UserInterview>().AddAsync(entity);
            await _myContext.SaveChangesAsync();
            return entity;
        }

        public async Task<IEnumerable<InterviewVM>> DataInterview()
        {
            using (var connection = new SqlConnection(_configuration.GetConnectionString("MyConnection")))
            {
                var spName = "SP_Retrieve_TB_T_UserInterview";
                var data = await connection.QueryAsync<InterviewVM>(spName, commandType: CommandType.StoredProcedure);
                return data;
            }
        }
        public async Task<IEnumerable<InterviewVM>> DataHistory()
        {
            using (var connection = new SqlConnection(_configuration.GetConnectionString("MyConnection")))
            {
                var spName = "SP_History_TB_T_UserInterview";
                var data = await connection.QueryAsync<InterviewVM>(spName, commandType: CommandType.StoredProcedure);
                return data;
            }
        }

        public async Task<UserInterview> ConfirmInterview(int id)
        {
            var entity = await Get(id);
            if (id != entity.Id)
            {
                return entity;
            }
            entity.Status = false;
            _myContext.Entry(entity).State = EntityState.Modified;
            await _myContext.SaveChangesAsync();
            return entity;
        }
        public async Task<UserInterview> StatusTrue(int id)
        {
            var entity = await Get(id);
            if (id != entity.Id)
            {
                return entity;
            }
            entity.Status = true;
            _myContext.Entry(entity).State = EntityState.Modified;
            await _myContext.SaveChangesAsync();
            return entity;
        }


        public async Task<IEnumerable<InterviewVM>> GetDataSendEmail(int id)
        {
            using (var connection = new SqlConnection(_configuration.GetConnectionString("MyConnection")))
            {
                var spName = "SP_DataSendEmail_TB_T_UserInterview";
                parameters.Add("@Id", id);
                var data = await connection.QueryAsync<InterviewVM>(spName, parameters, commandType: CommandType.StoredProcedure);
                return data;
            }
        }

    }
}
