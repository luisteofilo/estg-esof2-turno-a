using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

public partial class ApplicationDbContext
{
    private void BuildMessage(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Message>()
            .HasKey(m => m.MessageId);

        modelBuilder.Entity<Message>()
            .Property(m => m.Time)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        modelBuilder.Entity<Message>()
            .Property(m => m.Content)
            .IsRequired();

        modelBuilder.Entity<Message>()
            .Property(m => m.MessageId)
            .HasDefaultValueSql("gen_random_uuid()");

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.SentMessages)
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Receiver)
            .WithMany(u => u.ReceivedMessages)
            .HasForeignKey(m => m.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}