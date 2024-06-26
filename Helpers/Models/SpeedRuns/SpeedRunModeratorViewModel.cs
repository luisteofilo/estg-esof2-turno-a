namespace Helpers.Models
{
    public class SpeedrunModeratorViewModel
    {
        public Guid ModeratorID { get; set; }
        public Guid UserID { get; set; }
        public Guid GameID { get; set; }
        public DateTimeOffset RoleGivenDate { get; set; }
    }
}