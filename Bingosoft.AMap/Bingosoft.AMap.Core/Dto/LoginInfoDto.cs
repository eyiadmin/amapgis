using System;
using System.Collections.Generic;
using System.Text;

namespace Bingosoft.AMap.Core.Dto
{
    public class LoginInfoDto
    {
        public int Code { get; set; }

        public string Msg { get; set; }

        public UserInfoDto User { get; set; }
    }
}
