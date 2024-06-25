using ESOF.WebApp.DBLayer.Entities;
using System.Net.Http.Json;

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
            try
            {
                var response = await _httpClient.GetAsync("api/userid");
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Erro ao obter o ID do usuário: {ex.Message}");
                throw;
            }
        }


        public async Task<List<Friendship>> GetFriendsAsync(string userId)
        {
            return await _httpClient.GetFromJsonAsync<List<Friendship>>($"api/friends/{userId}");
        }

        public async Task<User> SearchFriendByEmailAsync(string email)
        {
            return await _httpClient.GetFromJsonAsync<User>($"api/users/search?email={email}");
        }

        public async Task SendFriendRequestAsync(Friendship friendship, string userId)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "api/friends/request")
            {
                Content = JsonContent.Create(friendship)
            };
            request.Headers.Add("X-User-Id", userId);
            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }

        public async Task AcceptFriendRequestAsync(Friendship friendship, string userId)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "api/friends/accept")
            {
                Content = JsonContent.Create(friendship)
            };
            request.Headers.Add("X-User-Id", userId);
            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }

        public async Task RemoveFriendAsync(Friendship friendship, string userId)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "api/friends/remove")
            {
                Content = JsonContent.Create(friendship)
            };
            request.Headers.Add("X-User-Id", userId);
            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }
    }
}
