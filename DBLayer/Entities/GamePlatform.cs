using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class GamePlatform{
	[Key] public Guid game_id{ get; set; }

	[ForeignKey("game_id")] public Game game{ get; set; }

	[Key] public Guid platform_id{ get; set; }

	[ForeignKey("platform_id")] public Platform platform{ get; set; }

}
