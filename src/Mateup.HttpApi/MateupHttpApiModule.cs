using Localization.Resources.AbpUi;
using Mateup.Localization;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Account;
using Volo.Abp.AutoMapper;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement.HttpApi;
using Volo.Abp.TenantManagement;

namespace Mateup
{
    [DependsOn(
        typeof(MateupApplicationContractsModule),
        typeof(AbpAccountHttpApiModule),
        typeof(AbpIdentityHttpApiModule),
        typeof(AbpPermissionManagementHttpApiModule),
        typeof(AbpTenantManagementHttpApiModule),
        typeof(AbpFeatureManagementHttpApiModule),
        typeof(AbpAutoMapperModule)
        )]
    public class MateupHttpApiModule : AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAutoMapperObjectMapper<MateupHttpApiModule>();

            Configure<AbpAutoMapperOptions>(options =>
            {
                options.AddMaps<MateupHttpApiModule>();
            });

            ConfigureLocalization();
        }

        private void ConfigureLocalization()
        {
            Configure<AbpLocalizationOptions>(options =>
            {
                options.Resources
                    .Get<MateupResource>()
                    .AddBaseTypes(
                        typeof(AbpUiResource)
                    );

               
            });
           

        }
    }
}
