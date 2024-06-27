using System.Text;
using System.Text.Json;

namespace Frontend.Helpers;

public class ApiHelper(HttpClient httpClient)
{
    private JsonSerializerOptions? _jsonOptions;

    public async Task<T?> GetFromApiAsync<T>(string url)
    {
        try
        {
            var response = await httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<T>();
        }
        catch (HttpRequestException e)
        {
            // Handle exception
            throw new ApplicationException($"Error fetching data from {url}: {e.Message}");
        }
    }
    
    public async Task<T?> PostToApiAsync<T>(string url)
    {
        try
        {
            var response = await httpClient.PostAsync(url, null);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"API Response: {responseContent}");

            return JsonSerializer.Deserialize<T>(responseContent);
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

    
    public async Task PutToApiAsync(string url)
    {
        try
        {
            var response = await httpClient.PutAsync(url, null);
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
            var response = await httpClient.PatchAsync(url, null);
            response.EnsureSuccessStatusCode();
        }
        catch (HttpRequestException e)
        {
            throw new ApplicationException($"Error putting data to {url}: {e.Message}");
        }
    }
    
    public async Task<T> DeleteFromApiAsync<T>(string url)
    {
        using (var response = await httpClient.DeleteAsync(url))
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
    
    public async Task<T?> PostToApiAsync<T>(string url, T data)
    {
        try
        {
            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(url, content);
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


    public async Task DeleteFromApiAsync(string url)
    {
        var response = await httpClient.DeleteAsync(url);
        response.EnsureSuccessStatusCode();
    }

}