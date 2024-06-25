using ESOF.WebApp.DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.DBLayer.Context;

// TODO: Implement context for the Games table
public partial class ApplicationDbContext
{
    public class Game
    {
        public int GameId { get; set; }
        public required string Name { get; set; }
        public required string Genre { get; set; }
        public required string Platform { get; set; }
        public DateTime ReleaseDate { get; set; }
    }
}
