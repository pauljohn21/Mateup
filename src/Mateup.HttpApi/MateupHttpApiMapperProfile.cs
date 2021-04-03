﻿using AutoMapper;
using Mateup.Models;
using Volo.Abp.IdentityServer.ApiResources;

namespace Mateup
{
    public class MateupHttpApiMapperProfile : Profile
    {
        public MateupHttpApiMapperProfile()
        {
            /* You can configure your AutoMapper mapping configuration here.
             * Alternatively, you can split your mapping configurations
             * into multiple profile classes for a better organization. */

            CreateMap<ApiResource, ApiResourceListViewModel>();
        }
    }
}
