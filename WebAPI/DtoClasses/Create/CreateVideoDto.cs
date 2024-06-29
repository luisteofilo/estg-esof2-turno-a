namespace ESOF.WebApp.WebAPI.DtoClasses.Create;

public class CreateVideoDto
{
    public Guid videoquestid { get; set; }
    public Guid userid { get; set; }
    public string? caption { get; set; }
    public IFormFile videoFile { get; set; }
}