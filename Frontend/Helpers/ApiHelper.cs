namespace Frontend.Helpers
{
    public class ApiHelper
    {
        private readonly HttpClient _httpClient;

        public ApiHelper(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Método para realizar requisições GET
        public async Task<T?> GetFromApiAsync<T>(string url)
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode(); // Lança uma exceção se a resposta não for bem-sucedida
                return await response.Content.ReadFromJsonAsync<T>(); // Lê o conteúdo JSON da resposta e desserializa para o tipo T
            }
            catch (HttpRequestException e)
            {
                // Idealmente, registre esta exceção
                throw new ApplicationException($"Error fetching data from {url}: {e.Message}");
            }
        }

        // Método para realizar requisições POST
        public async Task<bool> PostToApiAsync<T>(string url, T data)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync(url, data);
                response.EnsureSuccessStatusCode(); // Lança uma exceção se a resposta não for bem-sucedida
                return response.IsSuccessStatusCode;
            }
            catch (HttpRequestException e)
            {
                // Idealmente, registre esta exceção
                throw new ApplicationException($"Error posting data to {url}: {e.Message}", e);
            }
        }
    }
}

