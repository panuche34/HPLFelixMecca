using System.Diagnostics;
using Core.Enumerators;
using Core.ViewModel;
using Microsoft.AspNetCore.Mvc;
using HPLFelixMecca.Controllers;

namespace HPLFelixMecca.Controllers
{
    public class HomeController : ControllerBaseCore
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            var canView = await GetCanViewAsync(model.);

            ViewBag.CanView = canView;

            return View();
        }

        
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
