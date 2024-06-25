using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildMarketPlace_Game(ModelBuilder modelBuilder){
		modelBuilder.Entity<MarketPlace_Game>(entity => {
			entity.ToTable("Games", schema: "marketplace");
			
			entity.HasKey(e => e.game_id);

			entity.Property(e => e.name).IsRequired();

			entity.Property(e => e.description).IsRequired();

			entity.Property(e => e.stock).IsRequired();

			entity.Property(e => e.price).IsRequired();

			entity.Property(e => e.release_date).IsRequired();

			entity.HasMany(e => e.gameGenres)
				.WithOne(genre => genre.MarketPlaceGame)
				.HasForeignKey(e => e.game_id);
			
			entity.HasMany(e => e.gamePlatforms)
				.WithOne(p => p.MarketPlaceGame )
				.HasForeignKey(e => e.game_id);
			
			entity.HasMany(e => e.orderItems)
				.WithOne(oi => oi.MarketPlaceGame )
				.HasForeignKey(e => e.game_id);
			});
	}
}