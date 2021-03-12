using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Mateup.Blazor
{
    [Dependency(ReplaceServices = true)]
    public class MateupBrandingProvider : DefaultBrandingProvider
    {
        public override string AppName => "Mateup";
    }
}
