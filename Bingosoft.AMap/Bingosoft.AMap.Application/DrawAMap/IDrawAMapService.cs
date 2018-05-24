﻿using Bingosoft.AMap.Application.DrawAMap.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bingosoft.AMap.Application.DrawAMap
{
    public interface IDrawAMapService
    {
        string say();

        void saveDrawArea();

        void getDrawArea(int groupId);

        void saveDrawArea(AreaDrawInputDto inputDto);
    }

    
}
