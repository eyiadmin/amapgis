using Bingosoft.AMap.Application.DrawAMap.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bingosoft.AMap.Application.DrawAMap
{
    public interface IDrawAMapService
    {
        string say();

        void saveDrawArea();

        void getDrawArea(int groupId);

        void saveDrawArea(AreaDrawInputDto inputDto);

        List<AreaDrawOutputDto> GetAreaDrawOutputDtos(int groupId);

        void removeAreaDraw(int groupId);

        List<AreaDrawOutputDto> GetChilrenAreaDrawOutputDtos(int groupId);

        void removeAreaDrawById(string areaId);
    }


}
