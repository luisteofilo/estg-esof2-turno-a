using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildPlatform(ModelBuilder modelBuilder){
		modelBuilder.Entity<Platform>(entity => {
			
			entity.HasKey(e => e.platform_id);
			
			entity.Property(e => e.debut_year).IsRequired();
			
			entity.HasMany(e => e.gamePlatform)
				.WithOne(gp => gp.platform)
				.HasForeignKey(e => e.platform_id);
			
		});
	}
}