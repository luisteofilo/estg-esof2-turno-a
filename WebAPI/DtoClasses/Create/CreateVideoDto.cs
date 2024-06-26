namespace ESOF.WebApp.WebAPI.DtoClasses.Create;

public class CreateVideoDto
{
    public Guid challengeid { get; set; }
    public Guid userid { get; set; }
    public string caption { get; set; }
    public int viewcount { get; set; }
}