namespace Frontend.Helpers;

public class ApiHelper
{
    private readonly HttpClient _httpClient;

    public ApiHelper(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<T?> GetFromApiAsync<T>(string url)
    {
        try
        {
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<T>();
        }
        catch (HttpRequestException e)
        {
            // Ideally, log this exception
            throw new ApplicationException($"Error fetching data from {url}: {e.Message}");
        }
    }

    public async Task<bool> PostToApiAsync<T>(string url, T data)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync(url, data);
            response.EnsureSuccessStatusCode();
            return response.IsSuccessStatusCode;
        }
        catch (HttpRequestException e)
        {
            // Ideally, log this exception
            throw new ApplicationException($"Error posting data to {url}: {e.Message}");
        }
    }
}
