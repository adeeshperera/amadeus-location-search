namespace TravelApi.Models;

public record LocationResponse(List<Location> Data);

public record Location(
    string Type,
    string SubType,
    string Name,
    string IataCode,
    Address? Address
);

public record Address(string CityName, string CountryName);
