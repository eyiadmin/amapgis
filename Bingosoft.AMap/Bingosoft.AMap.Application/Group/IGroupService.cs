using Bingosoft.AMap.Application.Group.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bingosoft.AMap.Application.Group
{
    public interface IGroupService
    {
        List<GroupOutputDto> getGroup();

        string getGroupTreeData();

        ComboTreeOutputDto getTreeData();
    }
}
