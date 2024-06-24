using ESOF.WebApp.DBLayer.Entities;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Frontend.Services
{
    public class VoteService
    {
        private readonly HttpClient _httpClient;

        public VoteService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Game>> GetGamesAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<Game>>("api/game");
        }

        public async Task<bool> HasUserVotedAsync(Guid userId)
        {
            return await _httpClient.GetFromJsonAsync<bool>($"api/vote/HasVoted/{userId}");
        }

        public async Task<HttpResponseMessage> VoteForGameAsync(Vote vote)
        {
            return await _httpClient.PostAsJsonAsync("api/vote", vote);
        }

        public async Task<Dictionary<Guid, int>> GetVoteCountsAsync()
        {
            return await _httpClient.GetFromJsonAsync<Dictionary<Guid, int>>("api/vote/Counts");
        }
    }
}