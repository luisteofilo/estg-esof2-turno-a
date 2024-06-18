using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildGenre(ModelBuilder modelBuilder){
		modelBuilder.Entity<Genre>(entity => {
			entity.HasKey(e => e.genre_id);

			entity.Property(e => e.name).IsRequired();
			
			entity.Property(e => e.description).IsRequired();

			entity.HasMany(e => e.gameGenres)
				.WithOne(gr => gr.genre)
				.HasForeignKey(e => e.genre_id);

		});
	}
}