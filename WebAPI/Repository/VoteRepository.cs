using System;
using System.Threading.Tasks;
using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI;
using Microsoft.EntityFrameworkCore;

public class VoteRepository : IVoteRepository
{
    private readonly ApplicationDbContext _context;

    public VoteRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HasUserVotedThisMonth(Guid userId)
    {
        var currentDate = DateTime.Now;
        return await _context.Votes
            .AnyAsync(v => v.UserId == userId && v.VoteTime.Month == currentDate.Month && v.VoteTime.Year == currentDate.Year);
    }

    public async Task AddVote(Vote vote)
    {
        _context.Votes.Add(vote);
        await _context.SaveChangesAsync();
    }
}