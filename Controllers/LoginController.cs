using System.Drawing;
using Application.Security;
using ConstantManager.Messages;
using Core.Entity;
//using Core.Enumerators;
using Core.ViewModel;
//using FastReport;
using Infrastructure.Interfaces;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
//using Util.Extensions;
using Util.Helpers;
using HPLFelixMecca.Middlewares;
//using HPLFelixMecca.VO;

namespace HPLFelixMecca.Controllers
{
    public class LoginController : ControllerBaseCore
    {
        private readonly IUserRepository _userRepository;

        public LoginController(IUserRepository userRepository, IConfiguration configuration, IWebHostEnvironment env) : base(configuration, env)
        {
            _userRepository = userRepository;
        }

        public IActionResult Index()
        {
            return View(new LoginVM());
        }

        [HttpPost]
        public async Task<IActionResult> SignIn([FromForm] LoginVM loginVM)
        {
            try
            {
                if (loginVM == null)
                {
                    loginVM.ErrorMsg = CommonMessageConstant.ErrorMethodParamIsEmpty;
                    return View(nameof(Index), loginVM);
                }

                if ((string.IsNullOrEmpty(loginVM.Name) || (string.IsNullOrEmpty(loginVM.Password))))
                {
                    loginVM.ErrorMsg = CommonMessageConstant.ErrorMethodParamIsInvalid;
                    return View(nameof(Index), loginVM);
                }

                var user = await _userRepository
                    .GetByLoginAsync(loginVM.Name, loginVM.PassordEncrypt);
                if (user == null)
                {
                    loginVM.ErrorMsg = LoginMessageConstant.UserAndPassordInvalid;
                    return View(nameof(Index), loginVM);
                }
                //checar se pode acessar ou somente visualizar

                var token = TokenService.GenerateToken(user);
                CookieToken.Add(HttpContext, token.AccessToken);
                return RedirectToAction("Index", "Home");

            }
            catch (Exception ex)
            {
                loginVM.ErrorMsg = $"Erro: {ex.Message}";
                return View(nameof(Index), loginVM);
            }
        }
        [HttpGet]
        public IActionResult SignOut()
        {
            //return View("~/Views/Login/Index.cshtml");
            return RedirectToAction("Index", "Login");
        }

        [HttpGet("Login/ForgotPassword")]
        public async Task<IActionResult> ForgotPassword()
        {



            var loginVM = new LoginVM
            {
                IsInvalid = "",
                DsLogin = "",
                DsPassword = ""

            };
            return View(loginVM);
        }

        //[HttpGet("Login/ChangePassword")]
        //public async Task<IActionResult> ChangePassword(string id)
        //{
        //    if (String.IsNullOrEmpty(id))
        //        return RedirectToAction("Index", "Login");


        //    byte[] bytesID = Convert.FromBase64String(id);
        //    string paramUrl = System.Text.ASCIIEncoding.Default.GetString(bytesID);
        //    string emailPassadoUrl = paramUrl;
        //    var userDB = await _userRepository.GetAsync(emailPassadoUrl);

        //    if (userDB != null)
        //    {

        //        var loginVM = new LoginVM
        //        {
        //            IsInvalid = "",
        //            DsLogin = userDB.Email,
        //            DsPassword = ""

        //        };

        //        return View(loginVM);
        //    }
        //    else
        //    {
        //        var loginVM = new LoginVM
        //        {
        //            IsInvalid = "",
        //            DsLogin = userDB.Email,
        //            DsPassword = ""

        //        };

        //        loginVM.IsInvalid = "Email não encontrado na base de dados.";
        //        return View(loginVM);

        //    }

        //}

        //[HttpPost("Login/ChangePassword")]
        //public async Task<IActionResult> ChangePassword(string email, string password, string confirmPassword)
        //{
        //    var loginVM = new LoginVM
        //    {
        //        IsInvalid = "",
        //        DsLogin = email,
        //        DsPassword = ""
        //    };

        //    var user = await _userRepository.GetAsync(email);
        //    if (user == null)
        //    {
        //        loginVM.IsInvalid = "Email não encontrado na base de dados.";
        //        return View(loginVM);
        //    }



        //    if (password != confirmPassword)
        //    {
        //        loginVM.IsInvalid = "As senhas se diferem";
        //        return View(loginVM);
        //    }

        //    //var customerDB = await _customerRepo.GetLoginAsync(company.Id, email);
        //    user.Password = EncodeDecode.Encrypt(password);

        //    await _userRepository.UpdateAsync(user);
        //    loginVM.IsSuccess = "Alteramos sua senha, tente logar novamente.";
        //    return View(loginVM);

        //}



    }
}
