using Volo.Abp.Modularity;

namespace Mateup
{
    [DependsOn(
        typeof(MateupApplicationModule),
        typeof(MateupDomainTestModule)
        )]
    public class MateupApplicationTestModule : AbpModule
    {

    }
}