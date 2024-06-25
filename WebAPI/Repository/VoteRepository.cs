using ESOF.WebApp.DBLayer.Context;
using Microsoft.EntityFrameworkCore;
using ESOF.WebApp.DBLayer.Entities;

namespace ESOF.WebApp.WebAPI.Repository;

public class VoteRepository : IVoteRepository
{
    private readonly ApplicationDbContext _context;
    private IVoteRepository _voteRepositoryImplementation;

    public VoteRepository(ApplicationDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<bool> HasUserVotedThisMonth(Guid userId)
    {
        var lastMonth = DateTime.Now.AddMonths(-1).Month;
        return await _context.Votes.AnyAsync(v => v.UserId == userId && v.VoteTime.Month == lastMonth);
    }

    public async Task AddVote(Vote vote)
    {
        _context.Votes.Add(vote);
        await _context.SaveChangesAsync();
    }
}
