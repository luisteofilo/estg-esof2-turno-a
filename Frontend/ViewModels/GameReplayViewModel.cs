namespace Frontend.ViewModels;
public class GameReplayViewModel
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string FilePath { get; set; }
    public DateTime UploadDate { get; set; }
    public byte[] VideoData { get; set; }
    
}