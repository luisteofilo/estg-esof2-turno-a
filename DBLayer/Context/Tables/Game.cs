using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildGame(ModelBuilder modelBuilder){
		modelBuilder.Entity<Game>(entity => {
			entity.HasKey(e => e.game_id);

			entity.Property(e => e.name).IsRequired();

			entity.Property(e => e.description).IsRequired();

			entity.Property(e => e.stock).IsRequired();

			entity.Property(e => e.price).IsRequired();

			entity.Property(e => e.release_date).IsRequired();

			entity.HasMany(e => e.gameGenres)
				.WithOne(genre => genre.game)
				.HasForeignKey(e => e.game_id);
			
			entity.HasMany(e => e.gamePlatforms)
				.WithOne(p => p.game )
				.HasForeignKey(e => e.game_id);
			
			entity.HasMany(e => e.gameReviews)
				.WithOne(gr => gr.game )
				.HasForeignKey(e => e.game_id);
			
			entity.HasMany(e => e.orderItems)
				.WithOne(oi => oi.game )
				.HasForeignKey(e => e.game_id);
			});
	}
}