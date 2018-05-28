using Bingosoft.AMap.Application.DrawAMap.Dto;
using Bingosoft.AMap.Core.OptionsConf;
using Dapper;
using Microsoft.Extensions.Options;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bingosoft.AMap.Application.DrawAMap
{
    public class DrawAMapService : IDrawAMapService
    {
        string mysql = "Server=120.197.17.151;port=22003;User ID=root;Password=password; Database=wxcrm;";

        MySqlConnection MySqlConnection = new MySqlConnection();

        public DrawAMapService(IOptions<DbConnectionString> _jwtSettingsAccesser)
        {
            MySqlConnection.ConnectionString = _jwtSettingsAccesser.Value?.DefaultDb;
        }
        public void getDrawArea(int groupId)
        {
            throw new NotImplementedException();
        }

        public void saveDrawArea(AreaDrawInputDto inputDto)
        {
            string sql = "select count(1) from area_draw where area_id=@area_id";
            DynamicParameters dynamicParameters = new DynamicParameters();
            dynamicParameters.Add("area_id", inputDto.AreaId);
            int rows = MySqlConnection.ExecuteScalar<int>(sql, dynamicParameters);
            if (rows >= 1)
            {
                // updateDrawArea(inputDto);
                //removeAreaDraw(inputDto.GroupId);
            }
            else
            {
                insertDrawArea(inputDto);
            }

        }

        private void insertDrawArea(AreaDrawInputDto inputDto)
        {
            string sql = "insert into area_draw (area_id,area_name,area_lnglat,draw_creator_id,draw_creator_name,create_time,update_time,group_id,parent_group_id) values(" +
                "@area_id,@area_name,@area_lnglat,@draw_creator_id,@draw_creator_name,now(),now(),@group_id,@parent_group_id)";
            DynamicParameters dynamicParameters = new DynamicParameters();
            dynamicParameters.Add("area_id", inputDto.AreaId);
            dynamicParameters.Add("area_name", inputDto.AreaName);
            dynamicParameters.Add("area_lnglat", inputDto.AreaLngLat);
            dynamicParameters.Add("draw_creator_id", inputDto.DrawCreatorId);
            dynamicParameters.Add("draw_creator_name", inputDto.DrawCreatorName);
            dynamicParameters.Add("group_id", inputDto.GroupId);
            dynamicParameters.Add("parent_group_id", inputDto.ParentGroupId);
            MySqlConnection.Execute(sql, dynamicParameters);
        }
        private void updateDrawArea(AreaDrawInputDto inputDto)
        {
            string sql = " update area_draw area_name=@area_name,area_lnglat=@area_lnglat,update_time=now() where area_id=@area_id";
            DynamicParameters dynamicParameters = new DynamicParameters();
            dynamicParameters.Add("area_name", inputDto.AreaName);
            dynamicParameters.Add("area_lnglat", inputDto.AreaLngLat);
            dynamicParameters.Add("area_id", inputDto.AreaId);
            MySqlConnection.Execute(sql, dynamicParameters);
        }

        public void saveDrawArea()
        {
            throw new NotImplementedException();
        }

        public string say()
        {
            return "say";
        }

        public List<AreaDrawOutputDto> GetAreaDrawOutputDtos(int groupId)
        {
            string sql = " select area_id AreaId,area_name AreaName,area_lnglat AreaLngLat from  area_draw where group_id=@group_id and  is_delete=0";
            DynamicParameters dynamicParameters = new DynamicParameters();
            dynamicParameters.Add("group_id", groupId);

            return MySqlConnection.Query<AreaDrawOutputDto>(sql, dynamicParameters).AsList();
        }

        public List<AreaDrawOutputDto> GetChilrenAreaDrawOutputDtos(int groupId)
        {
            string sql = " select area_id AreaId,area_name AreaName,area_lnglat AreaLngLat from  area_draw where parent_group_id=@group_id and  is_delete=0";
            DynamicParameters dynamicParameters = new DynamicParameters();
            dynamicParameters.Add("group_id", groupId);

            return MySqlConnection.Query<AreaDrawOutputDto>(sql, dynamicParameters).AsList();
        }

        public void removeAreaDraw(int groupId)
        {
            string sql = " update  area_draw set is_delete=1,update_time=now() where group_id=@group_id and  is_delete=0";
            DynamicParameters dynamicParameters = new DynamicParameters();
            dynamicParameters.Add("group_id", groupId);

            MySqlConnection.Execute(sql, dynamicParameters);
        }

        public void removeAreaDrawById(string areaId)
        {
            string sql = " update  area_draw set is_delete=1,update_time=now() where area_id=@areaId and  is_delete=0";
            DynamicParameters dynamicParameters = new DynamicParameters();
            dynamicParameters.Add("areaId", areaId);

            MySqlConnection.Execute(sql, dynamicParameters);
        }
    }
}
