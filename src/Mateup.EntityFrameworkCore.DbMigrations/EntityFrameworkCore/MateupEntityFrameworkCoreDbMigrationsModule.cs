using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Modularity;

namespace Mateup.EntityFrameworkCore
{
    [DependsOn(
        typeof(MateupEntityFrameworkCoreModule)
        )]
    public class MateupEntityFrameworkCoreDbMigrationsModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAbpDbContext<MateupMigrationsDbContext>();
        }
    }
}
