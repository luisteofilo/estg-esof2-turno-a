using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Vote
{
    public Guid VoteId { get; set; } 
    public Guid UserId { get; set; }
    public Guid GameId { get; set; }
    public DateTime VoteTime { get; set; }
}
