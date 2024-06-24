namespace Helpers.Models
{
    public class RomsViewModel
    {
        public Guid RomId { get; set; }
        public Guid GameId { get; set; }
        
        public byte[] ROM { get; set; }
        
        public string File_name { get; set; }
        
    }
}