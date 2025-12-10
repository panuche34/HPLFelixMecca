using System.Diagnostics;
using System.Reflection;
using HPLFelixMecca.Models;
using Microsoft.AspNetCore.Mvc;

namespace HPLFelixMecca.Controllers
{
    public class DependantController : Controller
    {
        private readonly ILogger<DependantController> _logger;

        public DependantController(ILogger<DependantController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ListForDataTable([FromForm] SectorListVM filter)
        {
            try
            {
                //checar se é somente visualização
                var canView = await GetCanViewAsync(TpModule.Sectors);

                var models = await _sectorRepository.ListAsync(filter.search.value, filter.Start, filter.Length, filter.order[0]);
                var vms = new List<SectorListVM>();
                foreach (var model in models.Data)
                {

                    var user = await _userRepository.GetAsync(model.UserId);
                    // regra de botões
                    string buttons;
                    if (model.IsDeleted && !model.IsActive)
                        buttons = ButtonsVM.BTN_REACTIVE;
                    else if (canView)
                        buttons = ButtonsVM.BTN_EDIT; // somente visualização ? só Editar
                    else
                        buttons = ButtonsVM.BTN_EDIT + ButtonsVM.BTN_DELETE; // acesso completo


                    vms.Add(new SectorListVM
                    {

                        Id = model.Id,
                        Name = model.Name,
                        MaxTime = model.MaxTime,
                        LimitTime = model.LimitTime,
                        UserName = user.UserName,
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
