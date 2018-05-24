using Bingosoft.AMap.Application.Group.Dto;
using Bingosoft.AMap.Common.DapperHelper;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Text;
using Dapper;
using Microsoft.Extensions.Options;
using Bingosoft.AMap.Core.OptionsConf;

namespace Bingosoft.AMap.Application.Group
{
    public class GroupService: IGroupService
    {
        DapperMySQLHelper mySQLHelper = new DapperMySQLHelper();
        
        string mysql = "Server=120.197.17.151;port=22003;User ID=root;Password=password; Database=wxcrm;";

        MySqlConnection MySqlConnection = new MySqlConnection();

        public GroupService(IOptions<DbConnectionString> _jwtSettingsAccesser)
        {
            MySqlConnection.ConnectionString = _jwtSettingsAccesser.Value?.DefaultDb;
        }

        public List<GroupOutputDto> getGroup()
        {
            MySqlConnection.ConnectionString = mysql;
            
            string sql = "select group_id groupId,group_name groupName,parent_group_id parentId from GROUP_INFO";
            //var group = mySQLHelper.FindOne<GroupOutputDto>(mysql, sql, null);
            var group = MySqlConnection.Query<GroupOutputDto>(sql);
            return group.AsList();
            //if (group != null)
            //{ }
        }
    }
}
