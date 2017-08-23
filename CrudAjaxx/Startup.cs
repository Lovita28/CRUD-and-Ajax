using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CrudAjaxx.Startup))]
namespace CrudAjaxx
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
