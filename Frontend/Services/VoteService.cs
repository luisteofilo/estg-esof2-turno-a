using ESOF.WebApp.DBLayer.Dto;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace Frontend.Services
{
    public class VoteService
    {
        private readonly HttpClient _httpClient;

        public VoteService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> PostVoteAsync(VoteDTO voteDto)
        {
            var response = await _httpClient.PostAsJsonAsync("api/vote", voteDto);
            return response.IsSuccessStatusCode;
        }
    }
}