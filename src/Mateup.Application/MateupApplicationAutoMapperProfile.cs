using AutoMapper;
using Mateup.Models;
using Volo.Abp.IdentityServer.ApiResources;

namespace Mateup
{
    public class MateupApplicationAutoMapperProfile : Profile
    {
        public MateupApplicationAutoMapperProfile()
        {
            /* You can configure your AutoMapper mapping configuration here.
             * Alternatively, you can split your mapping configurations
             * into multiple profile classes for a better organization. */

            CreateMap<ApiResource, ApiResourceListViewModel>();
         

        }
    }
}
