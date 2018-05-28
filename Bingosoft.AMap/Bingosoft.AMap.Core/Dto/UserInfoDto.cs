using System;
using System.Collections.Generic;
using System.Text;

namespace Bingosoft.AMap.Core.Dto
{
   public class UserInfoDto
    {
        /// <summary>
        /// 登录名
        /// </summary>
        public string LoginName { get; set; }

        /// <summary>
        /// 登录帐号
        /// </summary>
        public string LoginNo { get; set; }

        /// <summary>
        /// 当前用户所属ID
        /// </summary>
        public string GroupID { get; set; }

        /// <summary>
        /// 手机号码
        /// </summary>
        public string PhoneNo { get; set; }

        /// <summary>
        /// 部门名称
        /// </summary>
        public string Department { get; set; }



        /// <summary>
        /// 菜单列表
        /// </summary>
        public string MenuList { get; set; }


        /// <summary>
        /// 入库网点
        /// </summary>
        public string StorageNetWork { get; set; }

        /// <summary>
        /// 操作时间
        /// </summary>
        public string OpDateTime { get { return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"); } }

        /// <summary>
        /// D/G类标志
        /// </summary>
        public bool ClassCodeFlag { get; set; }

        public bool IsExists { get; set; }

        public bool SeachCodeFlag { get; set; }
    }
}
