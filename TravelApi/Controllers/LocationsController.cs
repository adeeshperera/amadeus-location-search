using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using TravelApi.Models;
using TravelApi.Services;

namespace TravelApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly AmadeusService _amadeus;
    private readonly IDistributedCache _cache;

    public LocationsController(AmadeusService amadeus, IDistributedCache cache)
    {
        _amadeus = amadeus;
        _cache = cache;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword) || keyword.Length < 2)
            return BadRequest("Keyword must be at least 2 characters");

        var cacheKey = $"locations:{keyword.ToLower()}";
        
        // Try cache first
        var cached = await _cache.GetStringAsync(cacheKey);
        if (cached != null)
            return Ok(JsonSerializer.Deserialize<LocationResponse>(cached));

        // Fetch from API
        var result = await _amadeus.SearchLocationsAsync(keyword);
        
        // Cache for 10 minutes
        if (result != null)
        {
            await _cache.SetStringAsync(cacheKey, 
                JsonSerializer.Serialize(result),
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                });
        }

        return Ok(result);
    }
}
