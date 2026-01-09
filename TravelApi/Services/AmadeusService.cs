using System.Text.Json;
using TravelApi.Models;

namespace TravelApi.Services;

public class AmadeusService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;
    private string? _token;
    private DateTime _tokenExpiry;

    public AmadeusService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _config = config;
    }

    private async Task<string> GetTokenAsync()
    {
        if (_token != null && DateTime.UtcNow < _tokenExpiry)
            return _token;

        var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["grant_type"] = "client_credentials",
            ["client_id"] = _config["Amadeus:ApiKey"]!,
            ["client_secret"] = _config["Amadeus:ApiSecret"]!
        });

        var response = await _http.PostAsync(
            $"{_config["Amadeus:BaseUrl"]}/v1/security/oauth2/token", content);
        
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        _token = json.GetProperty("access_token").GetString();
        _tokenExpiry = DateTime.UtcNow.AddSeconds(
            json.GetProperty("expires_in").GetInt32() - 60);
        
        return _token!;
    }

    public async Task<LocationResponse?> SearchLocationsAsync(string keyword)
    {
        var token = await GetTokenAsync();
        _http.DefaultRequestHeaders.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var url = $"{_config["Amadeus:BaseUrl"]}/v1/reference-data/locations" +
                  $"?subType=AIRPORT,CITY&keyword={keyword}&page[limit]=10";

        return await _http.GetFromJsonAsync<LocationResponse>(url);
    }
}
