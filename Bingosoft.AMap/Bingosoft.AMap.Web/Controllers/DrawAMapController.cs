using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Bingosoft.AMap.Application.DrawAMap;
using Bingosoft.AMap.Application.DrawAMap.Dto;
using Newtonsoft.Json.Linq;
using Bingosoft.AMap.Common;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Bingosoft.AMap.Web.Controllers
{
    [Route("api/[controller]")]
    //[Authorize]
    public class DrawAMapController : Controller
    {
        IDrawAMapService drawAMapService;

        public DrawAMapController(IDrawAMapService drawAMap)
        {
            this.drawAMapService = drawAMap;
        }

        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            //var name=this.User.Identity.Name;
            var name = this.User.Claims.FirstOrDefault(o => o.Type == "ex")?.Value;
            return new string[] { "value1", "value2", name, this.drawAMapService.say() };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var areas = this.drawAMapService.GetAreaDrawOutputDtos(id);
            return Ok(areas);
        }

        [Route("area/{id}/area")]
        [HttpGet]
        public IActionResult GetChildren(int id)
        {
            var areas = this.drawAMapService.GetChilrenAreaDrawOutputDtos(id);
            return Ok(areas);
        }

        //[Route("/[action]")]
        //[HttpGet("{id}")]
        //public IActionResult GetChildren(int id)
        //{
        //    var areas = this.drawAMapService.GetChilrenAreaDrawOutputDtos(id);
        //    return Ok(areas);
        //}

        // POST api/values
        //[HttpPost]
        //public IActionResult Post([FromBody]AreaDrawInputDto value)
        //{
        //    var drawArea = value;
        //    drawArea.DrawCreatorId = "1";
        //    drawArea.DrawCreatorName = "oo9";
        //    drawArea.AreaId = "asw";
        //    drawArea.GroupId = 2;
        //    drawArea.ParentGroupId = 1;
        //    this.drawAMapService.saveDrawArea(drawArea);
        //    return Ok();
        //}

        [HttpPost]
        public IActionResult Post([FromBody] List<AreaDrawInputDto> values)
        {
            //if (values.Count >= 1)
            //{
            //    this.drawAMapService.removeAreaDraw(values[0].GroupId);
            //}
            var name = this.User.Identity.Name;
            var loginNo = this.User.Claims.FirstOrDefault(o => o.Type == ClaimTypesExt.LoginNo)?.Value;
            //List<AreaDrawInputDto> values = new List<AreaDrawInputDto>();
            foreach (var value in values)
            {
                var drawArea = value;
                drawArea.DrawCreatorId = loginNo ?? "";
                drawArea.DrawCreatorName = name ?? "";

                drawArea.ParentGroupId = 2;
                this.drawAMapService.saveDrawArea(drawArea);
            }
            return Ok();
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {

        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            this.drawAMapService.removeAreaDrawById(id);
        }
    }
}
