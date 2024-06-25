using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ESOF.WebApp.WebAPI.Services
{
    public class VoteService
    {
        private readonly ApplicationDbContext _context;

        public VoteService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Game>> GetGamesAsync()
        {
            return await _context.Games.ToListAsync();
        }

        private async Task<bool> HasUserVotedAsync(Guid userId, int month, int year)
        {
            return await _context.Votes
                .AnyAsync(v => v.UserId == userId && v.VoteTime.Month == month && v.VoteTime.Year == year);
        }

        public async Task<bool> VoteForGameAsync(Vote vote)
        {
            // Verifica se o usuário já votou neste mês (se necessário)
            var hasVoted = await HasUserVotedAsync(vote.UserId, vote.VoteTime.Month, vote.VoteTime.Year);
            if (hasVoted)
            {
                return false; // Ou lance uma exceção informando que o usuário já votou
            }

            _context.Votes.Add(vote);
            var result = await _context.SaveChangesAsync() > 0;
            return result;
        }
        

        public async Task<Dictionary<Guid, int>> GetVoteCountsAsync()
        {
            return await _context.Votes
                .GroupBy(v => v.GameId)
                .Select(g => new { GameId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(g => g.GameId, g => g.Count);
        }
        
        public async Task<Dictionary<Guid, double>> GetVotePercentagesAsync()
        {
            var totalVotes = await _context.Votes.CountAsync();
            if (totalVotes == 0) return new Dictionary<Guid, double>();

            return await _context.Votes
                .GroupBy(v => v.GameId)
                .Select(g => new { GameId = g.Key, Percentage = (double)g.Count() / totalVotes * 100 })
                .ToDictionaryAsync(g => g.GameId, g => g.Percentage);
        }
        
        public async Task<Game?> GetGameOfTheMonthAsync()
        {
            var gameOfTheMonthId = await _context.Votes
                .Where(v => v.VoteTime.Month == DateTime.Now.Month && v.VoteTime.Year == DateTime.Now.Year)
                .GroupBy(v => v.GameId)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefaultAsync();

            if (gameOfTheMonthId == Guid.Empty)
            {
                return null;
            }

            var game = await _context.Games.FindAsync(gameOfTheMonthId);
            return game;
        }
        
        
    }
}