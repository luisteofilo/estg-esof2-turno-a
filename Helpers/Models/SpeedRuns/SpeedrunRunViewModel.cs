namespace Helpers.Models
{
    public class SpeedrunRunViewModel
    {
        public Guid RunID { get; set; }
        public Guid PlayerID { get; set; }
        public Guid CategoryID { get; set; }
        public int RunTime { get; set; }
        public DateTime SubmissionDate { get; set; }
        public bool Verified { get; set; }
        public Guid? verifierID { get; set; }
        public string VideoLink { get; set; }
        public string PlayerName { get; set; }
        public string GameName { get; set; }
        public string CategoryName { get; set; }
        
    }
}