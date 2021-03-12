using Mateup.Localization;
using Volo.Abp.AspNetCore.Components;

namespace Mateup.Blazor
{
    public abstract class MateupComponentBase : AbpComponentBase
    {
        protected MateupComponentBase()
        {
            LocalizationResource = typeof(MateupResource);
        }
    }
}
