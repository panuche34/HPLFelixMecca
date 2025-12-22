// Add services to the container.
using Application;
using Application.Security;
using Microsoft.Extensions.FileProviders;
using System.Net;
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// MVC + serviços da aplicação
builder.Services
    .AddControllersWithViews()
    .addApplicationMvc(builder.Configuration);


// ===== Cultura pt-BR (vírgula como separador decimal) =====
var defaultCulture = new CultureInfo("pt-BR");
var supportedCultures = new[] { defaultCulture };

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    options.DefaultRequestCulture = new RequestCulture(defaultCulture);
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
});

// Opcional, mas ajuda em threads novas
CultureInfo.DefaultThreadCurrentCulture = defaultCulture;
CultureInfo.DefaultThreadCurrentUICulture = defaultCulture;
// ==========================================================

var app = builder.Build();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // app.UseHsts(); // ative se quiser HSTS em produção
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Localização deve vir cedo no pipeline
var locOptions = app.Services.GetRequiredService<IOptions<RequestLocalizationOptions>>();
app.UseRequestLocalization(locOptions.Value);

app.UseSession();

// Middleware para injetar o token no header Authorization
app.Use(async (context, next) =>
{
    var JWToken = context.Session.GetString(TokenService.TYPE_JWT);
    if (!string.IsNullOrEmpty(JWToken))
    {
        context.Request.Headers[TokenService.TYPE_HEADER_AUTHORIZATION] =
            TokenService.TYPE_BEARER + JWToken;
    }
    await next();
});

// Redireciona 401 / 403 para /Login
app.UseStatusCodePages(context =>
{
    var response = context.HttpContext.Response;
    if (response.StatusCode == (int)HttpStatusCode.Unauthorized ||
        response.StatusCode == (int)HttpStatusCode.Forbidden)
    {
        response.Redirect("/Login");
    }

    return Task.CompletedTask;
});

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Middleware customizado de permissão
//app.UseMiddleware<PermissionLevelMiddleware>();

if (app.Environment.IsProduction())
{
    // Produção
    app.Urls.Add("http://0.0.0.0:5072");
    app.Urls.Add("https://0.0.0.0:5073");
}

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}/{id?}");

app.Run();
