using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildReview(ModelBuilder modelBuilder){
		modelBuilder.Entity<OrderReview>(entity => {
			entity.ToTable("OrderReviews", schema: "marketplace");
			
			entity.HasKey(e => e.review_id);
			
			entity.HasKey(e => e.game_id);

			entity.Property(e => e.rating).IsRequired();
			
			entity.Property(e => e.review).IsRequired();
			
			entity.HasOne(e => e.MarketPlaceGame)
				.WithMany(g => g.gameReviews)
				.HasForeignKey(e => e.game_id);

			entity.HasOne(e => e.Reviewer)
				.WithMany(u => u.UserOrderReviews)
				.HasForeignKey(e => e.reviewer_id);

		});
	}
}