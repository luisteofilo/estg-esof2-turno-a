using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using Microsoft.EntityFrameworkCore;

// ReSharper disable once CheckNamespace
namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext{
	private void BuildOrder(ModelBuilder modelBuilder){
		modelBuilder.Entity<Order>(entity => {
			
			entity.HasKey(e => e.order_id);
			
			entity.HasKey(e => e.user_id);
			
			entity.Property(e => e.completed).IsRequired();
			
			entity.Property(e => e.order_type).IsRequired();

			entity.HasMany(e => e.orderItems)
				.WithOne(oi => oi.order)
				.HasForeignKey(e => e.order_id);
			
		});
	}
}