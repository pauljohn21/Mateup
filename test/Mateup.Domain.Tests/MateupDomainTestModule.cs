using Mateup.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace Mateup
{
    [DependsOn(
        typeof(MateupEntityFrameworkCoreTestModule)
        )]
    public class MateupDomainTestModule : AbpModule
    {

    }
}