using System.Globalization;

namespace Helpers.Models.View;

using System;
using System.Collections.Generic;


public class ViewGameByIdModel
{
    public Guid GameId { get; set; }
    
    public string Title { get; set; }
    
}