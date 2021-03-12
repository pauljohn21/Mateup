using Volo.Abp.Bundling;

namespace Mateup.Blazor
{
    public class MateupBundleContributor : IBundleContributor
    {
        public void AddScripts(BundleContext context)
        {
        }

        public void AddStyles(BundleContext context)
        {
            context.Add("main.css", true);
        }
    }
}