using Bingosoft.AMap.Core.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;

namespace Bingosoft.AMap.Common
{
    public class WebServiceRequest
    {
        /// <summary>
        /// 调用webservice登录
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="pwd"></param>

        public LoginInfoDto SSOLogin(string userName, string pwd)
        {

            string callBackStr = null;
            LoginInfoDto model = new LoginInfoDto();
            try
            {


                callBackStr = GetUserInfo(userName, pwd);
                //MarketingSystem.Common.LogManager.WriteLog(MarketingSystem.Common.LogFile.Trace, "接口返回信息:" + userName + "|" + pwd + " BEGIN:" + callBackStr);
            }
            catch
            {
                model = new LoginInfoDto() { Code = 0, Msg = "访问登录接口失败！" };
            }

            if (!string.IsNullOrEmpty(callBackStr))
            {
                //  Dictionary<string,int>
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(callBackStr);
                string content = xmlDoc.DocumentElement.InnerText;

                if (!string.IsNullOrEmpty(content))
                {
                    UserInfoDto loginInfo = new UserInfoDto();
                    string[] spltStr = content.Split('|');

                    try
                    {


                        if (spltStr[0] == "0")
                        {

                            string[] userInfo = spltStr[1].Split(',');
                            loginInfo.GroupID = userInfo[4];
                            loginInfo.LoginName = userInfo[0];
                            loginInfo.LoginNo = userInfo[1];
                            loginInfo.PhoneNo = userInfo[2];
                            loginInfo.Department = userInfo[3];
                            if (userInfo[3] == "null" || userInfo[3] == "" || loginInfo.GroupID == "null" || loginInfo.GroupID == "")
                            {
                                model = new LoginInfoDto() { Code = 0, Msg = "请核实该网点是否有效！" };
                            }
                            else
                            {
                                loginInfo.MenuList = GetMenuList(spltStr[2]);
                            }

                            model = new LoginInfoDto() { Code = 1, Msg = "", User = loginInfo };
                        }

                    }
                    catch (Exception ex)
                    {
                        model = new LoginInfoDto() { Code = 0, Msg = "抱歉，登陆失败！" };
                        //MarketingSystem.Common.LogManager.WriteLog(LogFile.Trace, "Login" + ex.StackTrace + "\n" + ex.Message + "\n line:" + ex.Source);
                    }
                }
                else
                {
                    model = new LoginInfoDto() { Code = 0, Msg = "登录接口返回数据为空！" };
                }

                // string json = Common.JsonHelper.Object2Json(model);

                // Response.Write(json);
            }
            return model;
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="pwd"></param>
        /// <returns></returns>
        public string GetUserInfo(string userID, string pwd)
        {
            // string postUrl = string.Format("http://10.95.119.75:8080/bingo.dms.mysql/soap-service/rest?action=sendSOAP&operation=getUserAndPermit&in0={1}&wsdl_location=http%3A%2F%2Fcdgis.sc.cmcc%2Fframe%2Fservices%2FProvideWebService%3Fwsdl&ajaxtimestamp=1390358453890", userID);
            //string postUrl = string.Format("http://10.95.119.75:8080/bingo.dms.mysql/soap-service/rest?action=sendSOAP&operation=getUserForPhone&in0={0}&in1={1}&wsdl_location=http%3A%2F%2Fcdgis.sc.cmcc%2Fframe%2Fservices%2FProvideWebService%3Fwsdl&ajaxtimestamp=1392014958402", userID, pwd);
            string postUrl = string.Format("http://10.101.42.91:8080/bingo.dms.mysql/soap-service/rest?action=sendSOAP&operation=getUserForPhone&in0={0}&in1={1}&wsdl_location=http%3A%2F%2Fcdzc.sc.cmcc%2Fservices%2FProvideWebService%3Fwsdl&ajaxtimestamp=1392014958402", userID, pwd);
            //string postUrl = string.Format("http://211.137.102.194/bingo.dms.mysql/soap-service/rest?action=sendSOAP&operation=getUserForPhone&in0={0}&in1={1}&wsdl_location=http%3A%2F%2Fcdzc.sc.cmcc%2Fservices%2FProvideWebService%3Fwsdl&ajaxtimestamp=1392014958402", userID, pwd);
            Uri uri = new Uri(postUrl);
            WebClient wc = new WebClient();
            wc.Encoding = Encoding.UTF8;

            wc.Headers.Add("Accept", "image/gif, image/x-xbitmap, image/jpeg, image/pjpeg, application/x-shockwave-flash, application/vnd.ms-excel, application/vnd.ms-powerpoint, application/msword, */*");
            wc.Headers.Add("Accept-Language", "zh-cn");
            wc.Headers.Add("UA-CPU", "x86");
            // wc.Headers.Add("Accept-Encoding","gzip, deflate");
            wc.Headers.Add("User-Agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)");
            // Headers 用于添加添加请求的头信息
            // System.IO.Stream objStream = wc.OpenRead("user/6974068.html");      //获取访问流
            // System.IO.StreamReader _read = new System.IO.StreamReader(objStream, System.Text.Encoding.UTF8);    // 新建一个读取流，用指定的编码读取，此处是utf-8
            return wc.DownloadString(postUrl);
        }

        /// <summary>
        /// 获取菜单
        /// </summary>
        /// <param name="listStr"></param>
        /// <returns></returns>
        private string GetMenuList(string listStr)
        {
            if (!string.IsNullOrEmpty(listStr))
            {
                List<string> list = new List<string>();
                list = listStr.Split(',').ToList();
                list.Where(o => Regex.IsMatch(o, @"^/d+$"));
                list.Remove("1"); list.Remove("2"); list.Remove("3"); list.Remove("4"); list.Remove("14");
                return string.Join("','", list.ToArray());
            }
            else
            {
                return "";
            }
        }
    }
}
