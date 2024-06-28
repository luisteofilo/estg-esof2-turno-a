using System.Runtime.InteropServices.JavaScript;
using ESOF.WebApp.DBLayer.Entities;

namespace ESOF.WebApp.DBLayer.Dto;

public class GameDto
{
    public Guid GameId { get; set; }

    public string Name { get; set; }

    public DateTime ReleaseDate { get; set; }

    public string Url_Image { get; set; }

    public string Developer { get; set; }

    public string Publisher { get; set; }

    public string Description { get; set; }

    public double Price { get; set; }

    public string RomBase64 { get; set; } 

    public List<GenreEnum> Genres { get; set; }

    public List<Category> Categories { get; set; }

    public List<Consoles> Consoles { get; set; }
}
