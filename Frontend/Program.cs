using Frontend.Components;
using Frontend.Helpers;
using Frontend.Services;
using Helpers;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;





var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// Configure HttpClient with API base URL
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("http://localhost:5295/") });

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ApiHelper>();
builder.Services.AddScoped<VoteService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts(); // The default HSTS value is 30 days
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();