using System;
using System.Threading.Tasks;
using ESOF.WebApp.DBLayer.Entities;

public interface IVoteRepository
{
    Task<bool> HasUserVotedThisMonth(Guid userId);
    Task AddVote(Vote vote);
}