using System;
using System.Collections.Generic;
using System.Text;

namespace Bingosoft.AMap.Application.DrawAMap.Dto
{
    public class AreaDrawInputDto
    {
        public string AreaId { get; set; }

        public string AreaName { get; set; }

        public string AreaLngLat { get; set; }

        public string DrawCreatorId { get; set; }

        public string DrawCreatorName { get; set; }

        public DateTime CreateTime { get; set; }

        public DateTime UpdateTime { get; set; }

        public int GroupId { get; set; }

        public int ParentGroupId { get; set; }
    }
}
