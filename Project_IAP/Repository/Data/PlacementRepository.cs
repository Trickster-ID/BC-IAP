using Dapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Project_IAP.Context;
using Project_IAP.Models;
using Project_IAP.ViewModels;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace Project_IAP.Repository.Data
{
    public class PlacementRepository : GeneralRepository<Placement, MyContext>
    {
        private readonly MyContext _myContext;
        DynamicParameters parameters = new DynamicParameters();
        IConfiguration _configuration { get; }
        public PlacementRepository(MyContext mycontexts, IConfiguration configuration) : base(mycontexts)
        {
            _configuration = configuration;
            _myContext = mycontexts;
        }
        public async Task<IEnumerable<InterviewVM>> DataPlacement()
        {
            using (var connection = new SqlConnection(_configuration.GetConnectionString("MyConnection")))
            {
                var spName = "SP_RetrieveforPlacement_TB_T_UserInterview";
                var data = await connection.QueryAsync<InterviewVM>(spName, commandType: CommandType.StoredProcedure);
                return data;
            }
        }
        public async Task<IEnumerable<PlacementVM>> DataHistory()
        {
            using (var connection = new SqlConnection(_configuration.GetConnectionString("MyConnection")))
            {
                var spName = "SP_History_TB_M_Placement";
                var data = await connection.QueryAsync<PlacementVM>(spName, commandType: CommandType.StoredProcedure);
                return data;
            }
        }

        //User
        public async Task<IEnumerable<PlacementVM>> DataUserHistory(int id)
        {
            using (var connection = new SqlConnection(_configuration.GetConnectionString("MyConnection")))
            {
                var spName = "SP_UserHistory_TB_M_Placement";
                parameters.Add("@UserId", id);
                var data = await connection.QueryAsync<PlacementVM>(spName, parameters, commandType: CommandType.StoredProcedure);
                return data;
            }
        }
        public async Task<IEnumerable<PlacementVM>> DataUserPlacement(int id)
        {
            using (var connection = new SqlConnection(_configuration.GetConnectionString("MyConnection")))
            {
                var spName = "SP_UserPlacement_TB_M_Placement";
                parameters.Add("@UserId", id);
                var data = await connection.QueryAsync<PlacementVM>(spName, parameters, commandType: CommandType.StoredProcedure);
                return data;
            }
        }

        public async Task<IEnumerable<PlacementVM>> ConfirmPlacement(PlacementVM model)
        {
            using (var connection = new SqlConnection(_configuration.GetConnectionString("MyConnection")))
            {
                var spName = "SP_Insert_TB_M_Placement";
                parameters.Add("@UserId", model.UserId);
                parameters.Add("@CompanyId", model.CompanyId);
                parameters.Add("@Start", model.StartContract);
                parameters.Add("@End", model.EndContract);
                var data = await connection.QueryAsync<PlacementVM>(spName, parameters, commandType: CommandType.StoredProcedure);
                return data;
            }
        }

        public async Task<Placement> ConfirmPlacement(int id, PlacementVM input)
        {
            var entity = await Get(id);
            if (id != entity.Id)
            {
                return entity;
            }
            entity.Status = true;
            entity.StartContract = input.StartContract;
            entity.EndContract = input.EndContract;
            _myContext.Entry(entity).State = EntityState.Modified;
            await _myContext.SaveChangesAsync();
            return entity;
        }
        public async Task<Placement> CancelPlacement(int id)
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

        public async Task<Placement> ClearPlacement(int id)
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
    }
}
