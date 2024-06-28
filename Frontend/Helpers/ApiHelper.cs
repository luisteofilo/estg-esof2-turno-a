using System.Text;
using System.Text.Json;

namespace Frontend.Helpers;

public class ApiHelper
{
    private readonly HttpClient _httpClient;
    private JsonSerializerOptions? _jsonOptions;

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
    public async Task<T?> PostToApiAsync<T>(string url, T data)
    {
        try
        {
            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"API Response: {responseContent}");
            
            return await response.Content.ReadFromJsonAsync<T>();
        }
        catch (HttpRequestException e)
        {
            // Handle exception
            Console.WriteLine($"HTTP Request Error: {e.Message}");
            throw new ApplicationException($"Error posting data to {url}: {e.Message}");
        }
        catch (JsonException e)
        {
            // Handle JSON deserialization exception
            Console.WriteLine($"JSON Deserialization Error: {e.Message}");
            throw new ApplicationException($"Error deserializing response from {url}: {e.Message}");
        }
        catch (Exception e)
        {
            Console.WriteLine($"General Error: {e.Message}");
            throw;
        }
    }

    public async Task<HttpResponseMessage> PostToApiAsyncGameReplays(string url, HttpContent content)
    {
        try
        {
            // Log the content type
            Console.WriteLine($"Content-Type being sent: {content.Headers.ContentType}");

            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();
            return response;
        }
        catch (HttpRequestException e)
        {
            string errorMessage = string.Empty;
            if (e.InnerException != null)
            {
                errorMessage = e.InnerException.Message;
            }
            throw new ApplicationException($"Error posting data to {url}: {e.Message}. Inner Exception: {errorMessage}");
        }
    }

    public async Task PutToApiAsync(string url)
    {
        try
        {
            var response = await _httpClient.PutAsync(url, null);
            response.EnsureSuccessStatusCode();
        }
        catch (HttpRequestException e)
        {
            throw new ApplicationException($"Error putting data to {url}: {e.Message}");
        }
    }

    public async Task PatchToApiAsync(string url)
    {
        try
        {
            var response = await _httpClient.PatchAsync(url, null);
            response.EnsureSuccessStatusCode();
        }
        catch (HttpRequestException e)
        {
            throw new ApplicationException($"Error putting data to {url}: {e.Message}");
        }
    }

    public async Task<T> DeleteFromApiAsync<T>(string url)
    {
        using (var response = await _httpClient.DeleteAsync(url))
        {
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                if (!string.IsNullOrWhiteSpace(content))
                {
                    return JsonSerializer.Deserialize<T>(content, _jsonOptions);
                }
                else
                {
                    return default;
                }
            }
            else
            {
                throw new HttpRequestException($"Erro ao chamar a API. Status code: {response.StatusCode}");
            }
        }
    }

    public async Task DeleteFromApiAsync(string url)
    {
        var response = await _httpClient.DeleteAsync(url);
        response.EnsureSuccessStatusCode();
    }

    public async Task PutToApiAsync<T>(string url, T data)
    {
        try
        {
            var response = await _httpClient.PutAsJsonAsync(url, data);
            response.EnsureSuccessStatusCode();
        }
        catch (HttpRequestException e)
        {
            // Handle exception
            throw new Exception($"Error updating to API: {e.Message}");
        }
    }
}
