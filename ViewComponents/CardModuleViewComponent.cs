using Microsoft.AspNetCore.Mvc;

namespace WebApp.ViewComponents_old
{
    public class CardModuleViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke(string controllerName, string action, string title, string icon)
        {
            if (string.IsNullOrEmpty(action))
                ViewData["controllerName"] = controllerName;
            else
                ViewData["controllerName"] = $"{controllerName}/{action}/";
            ViewData["action"] = action;
            ViewData["title"] = title;
            ViewData["icon"] = icon;

            return View();
        }
    }
}
