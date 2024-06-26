using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildGameGenre(ModelBuilder modelBuilder){
		modelBuilder.Entity<GameGenre>(entity => {
			entity.ToTable("GameGenres", schema: "marketplace");
			
			entity.HasKey(e => new { e.game_id, e.genre_id });
			
			entity.HasOne(gg => gg.MarketPlaceGame)
				.WithMany(g => g.gameGenres)
				.HasForeignKey(gg => gg.game_id);
			
			entity.HasOne(gg => gg.genre)
				.WithMany(g => g.gameGenres)
				.HasForeignKey(gg => gg.genre_id);
		});
	}
}