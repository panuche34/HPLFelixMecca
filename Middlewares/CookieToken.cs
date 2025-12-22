using Application.Security;

namespace HPLFelixMecca.Middlewares
{
    public static class CookieToken
    {
        public static void Add(HttpContext httpContext, string accessToken)
        {
            httpContext.Response.Cookies.Append(TokenService.COOKIE_NAME, accessToken);
            httpContext.Session.SetString(TokenService.TYPE_JWT, accessToken);
        }

        public static void Remove(HttpContext httpContext)
        {
            httpContext.Response.Cookies.Delete(TokenService.COOKIE_NAME);
            httpContext.Session.Remove(TokenService.TYPE_JWT);

        }
    }
}
