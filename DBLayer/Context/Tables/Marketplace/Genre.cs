using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildGenreMarketplace(ModelBuilder modelBuilder){
		modelBuilder.Entity<Genre>(entity => {
			entity.ToTable("Genres", schema: "marketplace");
			
			entity.HasKey(e => e.genre_id);

			entity.Property(e => e.genre_id).HasDefaultValueSql("gen_random_uuid()");
			
			entity.Property(e => e.name).IsRequired();
			
			entity.Property(e => e.description).IsRequired();

			entity.HasMany(e => e.gameGenres)
				.WithOne(gr => gr.genre)
				.HasForeignKey(e => e.genre_id);

		});
	}
}