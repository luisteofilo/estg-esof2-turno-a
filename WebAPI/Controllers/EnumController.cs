using ESOF.WebApp.DBLayer.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers;


public static class EnumController
{
    public static void MapEnumController(this WebApplication app){
    app.MapGet("/consoles", () =>
    {
        var consoles = Enum.GetNames(typeof(Consoles)).ToList();
        return consoles;
    })
    .WithName("GetConsoles")
        .WithOpenApi();

    app.MapGet("/genres", () =>
    {
        var genres = Enum.GetNames(typeof(Genre)).ToList();
        return genres;
    })
    .WithName("GetGenres")
        .WithOpenApi();
}
    
}