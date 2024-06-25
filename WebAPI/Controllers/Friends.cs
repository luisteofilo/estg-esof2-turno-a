using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using ESOF.WebApp.DBLayer.Entities;

namespace Frontend.Services
{
    public class FriendService
    {
        private readonly HttpClient _httpClient;

        public FriendService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> GetCurrentUserIdAsync()
        {
            var response = await _httpClient.GetAsync("api/userid");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<List<Friendship>> GetFriendsAsync(string userId)
        {
            _httpClient.DefaultRequestHeaders.Remove("X-User-Id");
            _httpClient.DefaultRequestHeaders.Add("X-User-Id", userId);
            return await _httpClient.GetFromJsonAsync<List<Friendship>>("api/friends");
        }

        public async Task<User> SearchFriendByEmailAsync(string email)
        {
            return await _httpClient.GetFromJsonAsync<User>($"api/friends/search?email={email}");
        }

        public async Task SendFriendRequestAsync(Friendship friendship, string userId)
        {
            _httpClient.DefaultRequestHeaders.Remove("X-User-Id");
            _httpClient.DefaultRequestHeaders.Add("X-User-Id", userId);
            await _httpClient.PostAsJsonAsync("api/friends/request", friendship);
        }

        public async Task AcceptFriendRequestAsync(Friendship friendship, string userId)
        {
            _httpClient.DefaultRequestHeaders.Remove("X-User-Id");
            _httpClient.DefaultRequestHeaders.Add("X-User-Id", userId);
            await _httpClient.PostAsJsonAsync("api/friends/accept", friendship);
        }

        public async Task RemoveFriendAsync(Friendship friendship, string userId)
        {
            _httpClient.DefaultRequestHeaders.Remove("X-User-Id");
            _httpClient.DefaultRequestHeaders.Add("X-User-Id", userId);
            await _httpClient.PostAsJsonAsync("api/friends/remove", friendship);
        }
    }
}
