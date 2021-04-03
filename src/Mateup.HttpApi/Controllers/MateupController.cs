using Abp.WebApi.Controllers;
using Mateup.Localization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;

namespace Mateup.Controllers
{
    /* Inherit your controllers from this class.
     */
    public abstract class MateupController : ControllerBase
    {
        protected MateupController()
        {
            
        }
    }
}