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
    public class GroupService : IGroupService
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

        public List<ComboTreeOutputDto> getGroupTreeData()
        {
            string sql = "select group_id groupId,group_name groupName,parent_group_id parentId from GROUP_INFO";
            //var group = mySQLHelper.FindOne<GroupOutputDto>(mysql, sql, null);
            var group = MySqlConnection.Query<GroupOutputDto>(sql);
            MySqlConnection.Close();
            var treeDatas = treeData(group.AsList());
            return treeDatas;
        }

        public List<ComboTreeOutputDto> treeData(List<GroupOutputDto> groupList)
        {
            if (groupList != null)
            {
                List<ComboTreeOutputDto> comboTreeList = new List<ComboTreeOutputDto>();
                for (int groupIndex = 0, groupLength = groupList.Count - 1; groupIndex <= groupLength; groupIndex++)
                {
                    ComboTreeOutputDto comboTree = new ComboTreeOutputDto();
                    var item = groupList[groupIndex];
                    var groupItems = groupList.FindAll(o => o.parentId == item.groupId);
                    comboTree.id = item.groupId;
                    comboTree.text = item.groupName;
                    if (groupItems != null && groupItems?.Count >= 1)
                    {
                        comboTree.children = treeData(groupItems);
                    }

                }
                return comboTreeList;
            }
            return null;
        }
    }
}
