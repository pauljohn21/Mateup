using Mateup.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Modularity;

namespace Mateup.DbMigrator
{
    [DependsOn(
        typeof(AbpAutofacModule),
        typeof(MateupEntityFrameworkCoreDbMigrationsModule),
        typeof(MateupApplicationContractsModule)
        )]
    public class MateupDbMigratorModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpBackgroundJobOptions>(options => options.IsJobExecutionEnabled = false);
        }
    }
}
