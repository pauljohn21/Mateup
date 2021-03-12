using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace Mateup
{
    [Dependency(ReplaceServices = true)]
    public class MateupBrandingProvider : DefaultBrandingProvider
    {
        public override string AppName => "Mateup";
    }
}
