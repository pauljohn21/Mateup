using Mateup.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace Mateup.Controllers
{
    /* Inherit your controllers from this class.
     */
    public abstract class MateupController : AbpController
    {
        protected MateupController()
        {
            LocalizationResource = typeof(MateupResource);
        }
    }
}