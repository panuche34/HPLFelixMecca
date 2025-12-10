using Microsoft.AspNetCore.Mvc;

namespace WebApp.ViewComponents
{
    public class ModalViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke(string id, string type)
        {
            ViewData["id"] = id;

            return type switch
            {
                "delete" => View("Delete"),
                _ => View("Delete"),
            };
        }
    }
}
