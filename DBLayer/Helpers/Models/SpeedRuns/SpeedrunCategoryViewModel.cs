namespace Helpers.Models
{
    public class SpeedrunCategoryViewModel
    {
        public Guid CategoryID { get; set; }
        public Guid GameID { get; set; }
        public DateTime CreationDate { get; set; }
        public string CategoryName { get; set; }
        public string CategoryDescription { get; set; }
        public string CategoryRules { get; set; }
    }
}