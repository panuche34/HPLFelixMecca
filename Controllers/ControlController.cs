using System.Diagnostics;
using System.Reflection;
using ConstantManager;
using ConstantManager.Messages;
using Core.ViewModel;
using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Crmf;



namespace HPLFelixMecca.Controllers
{
    public class ControlController : Controller
    {
        private readonly IUserRepository _controlRepository;

        public ControlController(IUserRepository controlRepository)
        {
            _controlRepository = controlRepository;
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
        public async Task<IActionResult> ListForDataTable([FromForm] ControlVM filter)
        {
            try
            {

                var models = await _controlRepository.ListAsync(filter.search.value, filter.Start, filter.Length, filter.order[0]);
                var vms = new List<ControlVM>();
                foreach (var model in models.Data)
                {

                    var user = await _controlRepository.GetAsync(model.Id);
                    // regra de botões
                    string buttons;
                    if (model.IsDeleted && !model.IsActive)
                        buttons = ButtonsVM.BTN_REACTIVE;
                    else
                        buttons = ButtonsVM.BTN_EDIT + ButtonsVM.BTN_DELETE; // acesso completo


                    vms.Add(new ControlVM
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
