namespace Frontend.Components.interfaces;

public class GameInterface
{
    public Guid GameId { get; set; }
    public string Name { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string Url_Image { get; set; }
    public string Developer { get; set; }
    public string Publisher { get; set; }
    public string Description { get; set; }
    public double Price { get; set; }
}