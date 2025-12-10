using ConstantManager;
using ConstantManager.Messages;
using Core.Entity;
using Core.Enumerators;
using Core.ViewModel;
using Infrastructure.Intefaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace WebApp.Adm.Controllers
{
    [Authorize]
    public class SectorController : ControllerBaseCore
    {
        private readonly ISectorRepository _sectorRepository;
        private readonly IUserRepository _userRepository;

        public SectorController(ISectorRepository sectorRepository, IUserRepository userRepository)
        {
            _sectorRepository = sectorRepository;
            _userRepository = userRepository;
        }

        public async Task<IActionResult> Index()
        {
            //checar  é somente visualização
            var canView = await GetCanViewAsync(TpModule.Sectors);

            ViewBag.CanView = canView;

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
                        buttons = ButtonsVM.BTN_EDIT; // somente visualização → só Editar
                    else
                        buttons = ButtonsVM.BTN_EDIT + ButtonsVM.BTN_DELETE; // acesso completo


                        vms.Add(new SectorListVM
                        {

                            Id = model.Id,
                            Name = model.Name,
                            MaxTime = model.MaxTime,
                            LimitTime =model.LimitTime,
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

        [HttpGet]
        public async Task<IActionResult> Crud(int id)
        {
            try
            {
                //checar se é somente visualização
                var canView = await GetCanViewAsync(TpModule.Sectors);

                var model = await _sectorRepository.GetAsync(id);
                if (model == null)
                {
                    var vm2 = new SectorVM();
                    vm2.UserId = 0;
                    vm2.justCanView = canView;


                    return View(vm2);
                }
                var vm = new SectorVM
                {
                    Id = model.Id,
                    Name = model.Name,
                    LimitTime = model.LimitTime,
                    MaxTime = model.MaxTime,
                    Remarks = model.Remarks,
                    UserId = model.UserId,
                    justCanView = canView
                };
                return View(vm);
            }
            catch (Exception e)
            {
                return BadRequest(BaseConstant.Msg(CommonMessageConstant.ErrorReturnMethodListToTable, e.Message));
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Crud(SectorVM viewModel)
        {
            try
            {
                if ((!ModelState.IsValid) || (viewModel == null))
                {
                    ViewBag.ErrorMsg = CommonMessageConstant.ErrorInvalidViewModel;
                    return View(nameof(Crud));
                }

                var model = await _sectorRepository
                    .GetAsync((viewModel.Id.HasValue ? viewModel.Id.Value : 0));
                if (model == null)
                {
                    model = new Sector();
                    model.Name = viewModel.Name;
                    model.LimitTime = viewModel.LimitTime;
                    model.MaxTime = viewModel.MaxTime;
                    model.Remarks = viewModel.Remarks;
                    model.UserId = viewModel.UserId;


                    await _sectorRepository.AddAsync(model);
                }
                else
                {
                    model.Name = viewModel.Name;
                    model.LimitTime = viewModel.LimitTime;
                    model.MaxTime = viewModel.MaxTime;
                    model.Remarks = viewModel.Remarks;
                    model.UserId = viewModel.UserId;
                    await _sectorRepository.UpdateAsync(model);
                }
                return RedirectToAction(nameof(Index));
            }
            catch (Exception e)
            {
                ViewBag.ErrorMsg = e.Message;
                return View(viewModel);
            }
        }

        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var model = await _sectorRepository.GetAsync(id);
                if (model == null)
                {
                    return BadRequest(CommonMessageConstant.ErrorEntityIdNotFound);
                }

                await _sectorRepository.DeleteAsync(model);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        public async Task<IActionResult> Reactive(int id)
        {
            try
            {
                var model = await _sectorRepository.GetAsync(id);
                if (model == null)
                {
                    return BadRequest(CommonMessageConstant.ErrorEntityIdNotFound);
                }

                await _sectorRepository.ReactiveAsync(model);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
