﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Bingosoft.AMap.Application.DrawAMap;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Bingosoft.AMap.Web.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
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
            return new string[] { "value1", "value2", name,this.drawAMapService.say() };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {

        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
