using Bingosoft.AMap.Application.Group;
using System;
using Xunit;

namespace Bingosoft.AMap.XUnitTest
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            var homeController = new GroupService();
            homeController.getGroup();
        }
    }
}
