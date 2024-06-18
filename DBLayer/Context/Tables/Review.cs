using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildReview(ModelBuilder modelBuilder){
		modelBuilder.Entity<Review>(entity => {
			
			entity.HasKey(e => e.review_id);
			
			entity.HasKey(e => e.game_id);

			entity.Property(e => e.rating).IsRequired();
			
			entity.Property(e => e.review).IsRequired();
			
			entity.HasOne(e => e.game)
				.WithMany(g => g.gameReviews)
				.HasForeignKey(e => e.game_id);
			
		});
	}
}