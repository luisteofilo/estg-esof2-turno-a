using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildGameGenre(ModelBuilder modelBuilder){
		modelBuilder.Entity<GameGenre>(entity => {
			entity.HasKey(e => e.game_id);

			entity.HasKey(e => e.genre_id);
			
			entity.HasOne(e => e.genre)
				.WithMany(g => g.gameGenres)
				.HasForeignKey(e => e.genre_id);

			entity.HasOne(e => e.game)
				.WithMany(g => g.gameGenres)
				.HasForeignKey(e => e.genre_id);
		});
	}
}