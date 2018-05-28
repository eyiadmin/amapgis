using Bingosoft.AMap.Application.Group.Dto;
using Bingosoft.AMap.Common.DapperHelper;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Text;
using Dapper;
using Microsoft.Extensions.Options;
using Bingosoft.AMap.Core.OptionsConf;
using System.IO;

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

        public GroupService()
        {
            MySqlConnection.ConnectionString = mysql;
        }

        public List<GroupOutputDto> getGroup()
        {
            MySqlConnection.ConnectionString = mysql;

            string sql = "select group_id groupId,group_name groupName,parent_group_id parentId from GROUP_INFO order by group_id ";
            //var group = mySQLHelper.FindOne<GroupOutputDto>(mysql, sql, null);
            var group = MySqlConnection.Query<GroupOutputDto>(sql);
            return group.AsList();
            //if (group != null)
            //{ }
        }

        public string getGroupTreeData()
        {
            string sql = "select group_id groupId,group_name groupName,parent_group_id parentId from GROUP_INFO";
            //var group = mySQLHelper.FindOne<GroupOutputDto>(mysql, sql, null);
            var group = MySqlConnection.Query<GroupOutputDto>(sql);
            MySqlConnection.Close();
            var treeDataItem = treeData(group.AsList(), 2, "成都");
            // List<ComboTreeOutputDto> treeDatas = new List<ComboTreeOutputDto>();
            //treeDatas.Add(treeDataItem);
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(treeDataItem);
            string jsonArr = $"[{json}]";
            dictionary.Clear();
            return jsonArr;
        }

        public ComboTreeOutputDto getTreeData()
        {
            string sql = "select group_id groupId,group_name groupName,parent_group_id parentId from GROUP_INFO";
            //var group = mySQLHelper.FindOne<GroupOutputDto>(mysql, sql, null);
            var group = MySqlConnection.Query<GroupOutputDto>(sql);
            MySqlConnection.Close();
            var treeDatas = treeData(group.AsList(), 2, "成都");
            dictionary.Clear();
            return treeDatas;
        }

        public ComboTreeOutputDto getTreeData(int groupId, string groupName)
        {
            string sql = "select group_id groupId,group_name groupName,parent_group_id parentId from GROUP_INFO where group_id=@group_id" +
"union ALL" +
"select group_id groupId,group_name groupName, parent_group_id parentId from GROUP_INFO where parent_group_id = @group_id";
            //var group = mySQLHelper.FindOne<GroupOutputDto>(mysql, sql, null);
            var group = MySqlConnection.Query<GroupOutputDto>(sql);
            //MySqlConnection.Close();
            DynamicParameters dynamicParameters = new DynamicParameters();
            dynamicParameters.Add("group_id", groupId);
            var treeDatas = treeData(group.AsList(), groupId, groupName);
            dictionary.Clear();
            return treeDatas;
        }

        Dictionary<int, string> dictionary = new Dictionary<int, string>();

        public ComboTreeOutputDto treeData(List<GroupOutputDto> groupList, int parentId, string parnetName)
        {
            if (groupList != null)
            {
                if (!dictionary.ContainsKey(parentId))
                {
                    ComboTreeOutputDto comboTree = new ComboTreeOutputDto();

                    try
                    {

                        var groupItems = groupList.FindAll(o => o.parentId == parentId);

                        comboTree.id = parentId;
                        comboTree.text = parnetName;
                        List<ComboTreeOutputDto> comboTreeList = new List<ComboTreeOutputDto>();
                        for (int groupIndex = 0, groupLength = groupItems.Count - 1; groupIndex <= groupLength; groupIndex++)
                        {

                            comboTreeList.Add(treeData(groupList, groupItems[groupIndex].groupId, groupItems[groupIndex].groupName));

                        }
                        comboTree.children = comboTreeList;

                    }
                    catch (Exception ex)
                    {
                        File.AppendAllText("D:/error.txt", ex.Message);
                    }
                    dictionary.Add(parentId, parnetName);
                    return comboTree;
                }
            }
            return null;
        }
    }
}
