namespace Helpers.Models;

public class PlayerAchievementsViewModel
{
    public string Name { get; set; }
    public string Description { get; set; }
    public DateOnly Unlocked { get; set; }
}