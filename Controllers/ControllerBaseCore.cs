using Application.Security;
//using Core.BO;
using Core.Entity;
//using Core.Enumerators;
using Core.ViewModel;
//using Infrastructure.Intefaces;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

public class ControllerBaseCore : Controller
{
    protected readonly IWebHostEnvironment _webHostEnvironment;
    protected readonly string _basePath;
    //protected readonly AppSettingsAppVM _appSettings;
   


    public ControllerBaseCore() { _basePath = string.Empty; }

    public ControllerBaseCore(IWebHostEnvironment env) : this()
    {
        _webHostEnvironment = env;
        _basePath = env.WebRootPath;
    }

    public ControllerBaseCore(IConfiguration configuration, IWebHostEnvironment env) : this()
    {
        _basePath = env.WebRootPath;
        //_appSettings = configuration.GetSection("Config").Get<AppSettingsAppVM>();
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

    public async Task SaveFoto(string locale, string id, IFormFile foto)
    {
        var path = GetFormatDirectory(locale, id);
        if (!Directory.Exists(path)) Directory.CreateDirectory(path);

        if (locale != "operacao") DeleteAllFiles(path);

        path = Path.Combine(path, foto.FileName);
        using var stream = new FileStream(path, FileMode.Create);
        foto.CopyTo(stream);
    }

    private bool DeleteAllFiles(string path)
    {
        if (!Directory.Exists(path)) return true;
        var filesName = Directory.GetFiles(path);
        if (filesName == null || filesName.Length <= 0) return true;

        foreach (var file in filesName) System.IO.File.Delete(file);
        return true;
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


}
