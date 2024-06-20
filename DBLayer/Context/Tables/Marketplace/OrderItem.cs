using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildOrderItem(ModelBuilder modelBuilder){
		modelBuilder.Entity<OrderItem>(entity => {
			
			entity.HasKey(e => e.order_id);
			
			entity.HasKey(e => e.game_id);
			
			entity.Property(e => e.amount).IsRequired();
			
			entity.HasOne(e => e.MarketPlaceGame)
				.WithMany(g => g.orderItems)
				.HasForeignKey(e => e.game_id);
			
			entity.HasOne(e => e.order)
				.WithMany(g => g.orderItems)
				.HasForeignKey(e => e.order_id);
			
		});
	}
}