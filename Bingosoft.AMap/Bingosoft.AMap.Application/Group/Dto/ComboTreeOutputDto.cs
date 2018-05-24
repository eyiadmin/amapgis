using System;
using System.Collections.Generic;
using System.Text;

namespace Bingosoft.AMap.Application.Group.Dto
{
    public class ComboTreeOutputDto
    {
        public int id { get; set; }

        public string text { get; set; }

        public List<ComboTreeOutputDto> children { get; set; }
    }
}
