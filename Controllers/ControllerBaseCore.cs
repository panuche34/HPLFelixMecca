using Application.Security;
//using Core.BO;
using Core.Entity;
using Core.Enumerators;
using Core.ViewModel;
//using Infrastructure.Intefaces;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

public class ControllerBaseCore : Controller
{
    protected readonly IWebHostEnvironment _webHostEnvironment;
    protected readonly string _basePath;   


    public ControllerBaseCore() { _basePath = string.Empty; }

    public ControllerBaseCore(IWebHostEnvironment env) : this()
    {
        _webHostEnvironment = env;
        _basePath = env.WebRootPath;
    }

    public ControllerBaseCore(IConfiguration configuration, IWebHostEnvironment env) : this()
    {
        _basePath = env.WebRootPath;
    }

    public async Task<string> GetPathFoto(string locale, string id)
    {
        var path = GetFormatDirectory(locale, id);
        if (!Directory.Exists(path)) return "";

        var filesName = Directory.GetFiles(path);
        if (filesName == null || filesName.Length <= 0) return "";

        var url = $"../../attachments/{locale}/{id}/{System.IO.Path.GetFileName(filesName[0])}";
        return url;
    }

    // >>> TORNAR PROTECTED
    protected string GetFormatDirectory(string modelName, string modelId)
    {
        if (string.IsNullOrEmpty(_basePath))
            throw new Exception("IWebHostEnvironment not inject");

        return string.IsNullOrEmpty(modelId)
            ? Path.Combine(_basePath, "attachments", modelName)
            : Path.Combine(_basePath, "attachments", modelName, modelId);
    }

    public async Task<List<string>> GetOperationPhotoUrls(string modelName, string modelId)
    {
        var urls = new List<string>();
        if (string.IsNullOrWhiteSpace(modelId)) return urls;

        var physicalDir = GetFormatDirectory(modelName, modelId);
        if (!Directory.Exists(physicalDir)) return urls;

        var rel = physicalDir
            .Replace(_basePath, string.Empty)
            .TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar)
            .Replace('\\', '/');

        foreach (var file in Directory.EnumerateFiles(physicalDir))
        {
            var name = Path.GetFileName(file);
            var web = "/" + Path.Combine(rel, name).Replace('\\', '/');
            urls.Add(web);
        }
        return urls;
    }

    // ====================== HELPERS PRIVADOS ======================
    protected async Task<bool> HasViewAccessAsync(long permissionLevelId, TpModule module)
    {
        var repo = HttpContext?.RequestServices?.GetService<IPermissionLevelRepository>();
        if (repo == null) throw new InvalidOperationException("IPermissionLevelRepository não registrado no DI.");
        return await repo.HasViewAccessAsync(permissionLevelId, module);
    }

    private long? GetPermissionLevelIdFromClaims()
    {
        var claimValue = User.FindFirstValue(TokenService.ClaimAccess);
        if (string.IsNullOrWhiteSpace(claimValue)) return null;
        return long.TryParse(claimValue, out var id) ? id : null;
    }

    public async Task<bool> GetCanViewAsync(TpModule tpModule)
    {
        var permissionLevelId = GetPermissionLevelIdFromClaims();
        if (!permissionLevelId.HasValue) return false;
        return await HasViewAccessAsync(permissionLevelId.Value, tpModule);
    }



}
