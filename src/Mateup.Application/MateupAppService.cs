using System;
using System.Collections.Generic;
using System.Text;
using Mateup.Localization;
using Volo.Abp.Application.Services;

namespace Mateup
{
    /* Inherit your application services from this class.
     */
    public abstract class MateupAppService : ApplicationService
    {
        protected MateupAppService()
        {
            LocalizationResource = typeof(MateupResource);
        }
    }
}
