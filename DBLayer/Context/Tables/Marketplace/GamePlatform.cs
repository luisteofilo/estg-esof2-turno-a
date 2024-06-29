using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildGamePlatform(ModelBuilder modelBuilder){
		modelBuilder.Entity<GamePlatform>(entity => {
			entity.ToTable("GamePlatforms", schema: "marketplace");
			
			entity.HasKey(e => e.game_id);

			entity.HasKey(e => e.platform_id);
			
			entity.HasOne(e => e.MarketPlaceGame)
				.WithMany(g => g.gamePlatforms)
				.HasForeignKey(e => e.platform_id);
			
			entity.HasOne(e => e.platform)
				.WithMany(p => p.gamePlatform)
				.HasForeignKey(e => e.platform_id);
		});
	}
}