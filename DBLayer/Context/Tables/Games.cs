using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context
{
    public partial class ApplicationDbContext
    {
        private void BuildGames(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Games>(entity =>
            {
                // Define a chave primária
                entity.HasKey(e => e.GameId);

                // Define a propriedade GameId com valor padrão SQL
                entity.Property(e => e.GameId)
                    .HasDefaultValueSql("gen_random_uuid()");

                // Define propriedades obrigatórias
                entity.Property(e => e.Name)
                    .IsRequired();

                entity.Property(e => e.ReleaseDate)
                    .IsRequired();

                entity.Property(e => e.Url_Image)
                    .IsRequired();

                entity.Property(e => e.Developer)
                    .IsRequired();

                entity.Property(e => e.Publisher)
                    .IsRequired();

                entity.Property(e => e.Description)
                    .IsRequired();

                entity.Property(e => e.Price)
                    .IsRequired();

                // Configura o relacionamento de um jogo (Games) com um único ROM (Roms)
                entity.HasOne(g => g.Rom)
                    .WithOne(r => r.Game)
                    .HasForeignKey<Roms>(r => r.GameId);
            });
        }
    }
}