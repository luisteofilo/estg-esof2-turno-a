using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers;


public class EnumController : ControllerBase
{
    
    private static readonly List<string> ConsoleNames = Enum.GetNames(typeof(Consoles)).ToList();
    private static readonly List<string> CategoryNames = Enum.GetNames(typeof(Category)).ToList();
    private static readonly List<string> GenreNames = Enum.GetNames(typeof(Genre)).ToList();
        
    [HttpGet("consoles")]
    public ActionResult<List<string>> GetConsoles()
    {
        return Ok(ConsoleNames);
    }

    [HttpGet("categories")]
    public ActionResult<List<string>> GetCategories()
    {
        return Ok(CategoryNames);
    }

    [HttpGet("genres")]
    public ActionResult<List<string>> GetGenres()
    {
        return Ok(GenreNames);
    }
}