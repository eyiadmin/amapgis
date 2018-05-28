using Bingosoft.AMap.Application.Group;
using Bingosoft.AMap.Common;
using System;
using Xunit;

namespace Bingosoft.AMap.XUnitTest
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            //var homeController = new GroupService();
            //homeController.getTreeData();

            WebServiceRequest webServiceRequest = new WebServiceRequest();
            var res = webServiceRequest.SSOLogin("wj_qingd", "Aa123456!");
            string s = res.Msg;

        }
    }
}
