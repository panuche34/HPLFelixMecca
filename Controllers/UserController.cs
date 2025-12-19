using System.Diagnostics;
using ConstantManager;
using ConstantManager.Messages;
using Core.ViewModel;
using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HPLFelixMecca.Controllers
{
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepository ;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Crud()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ListForDataTable([FromForm] ChildrenListVM filter)
        {
            try
            {

                var models = await _userRepository.ListAsync(filter.search.value, filter.Start, filter.Length, filter.order[0]);
                var vms = new List<ChildrenListVM>();
                foreach (var model in models.Data)
                {

                    var user = await _userRepository.GetAsync(model.Id);
                    // regra de botões
                    string buttons;
                    if (model.IsDeleted && !model.IsActive)
                        buttons = ButtonsVM.BTN_REACTIVE;
                    else
                        buttons = ButtonsVM.BTN_EDIT + ButtonsVM.BTN_DELETE; // acesso completo


                    vms.Add(new ChildrenListVM
                    {

                        Id = model.Id,
                        Name = model.Name,
                        Buttons = buttons //(model.IsDeleted && !model.IsActive) ? ButtonsVM.BTN_REACTIVE : string.Empty
                    });

                }
                var result = new
                {
                    draw = filter.Draw,
                    recordsTotal = models.TotalRecords,
                    recordsFiltered = models.TotalRecords, //Se você aplicar filtros, atualize essa contagem.
                    data = vms
                };

                return Json(result);
            }
            catch (Exception e)
            {
                return BadRequest(BaseConstant.Msg(CommonMessageConstant.ErrorReturnMethodListToTable, e.Message));
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
