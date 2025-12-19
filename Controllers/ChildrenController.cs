using System.Diagnostics;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Core.ViewModel;
using Infrastructure.Interfaces;
using ConstantManager;
using ConstantManager.Messages;



namespace HPLFelixMecca.Controllers
{
    public class ChildrenController : Controller
    {
        private readonly IChildrenRepository _childrenRepository;

        public ChildrenController(IChildrenRepository dependentRepository)
        {
            _childrenRepository = dependentRepository;
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

                var models = await _childrenRepository.ListAsync(filter.search.value, filter.Start, filter.Length, filter.order[0]);
                var vms = new List<ChildrenListVM>();
                foreach (var model in models.Data)
                {

                    var user = await _childrenRepository.GetAsync(model.UserId);
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
                        UserId = model.User.Id,
                        
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
