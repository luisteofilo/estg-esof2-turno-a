namespace ESOF.WebApp.WebAPI;
using ESOF.WebApp.DBLayer.Entities;

public interface IVoteRepository
{
    Task<bool> HasUserVotedThisMonth(Guid userId);
    Task AddVote(Vote vote);
}
