using AutoMapper;
using Mateup.Models;

namespace Mateup.Blazor
{
    public class MateupBlazorAutoMapperProfile : Profile
    {
        public MateupBlazorAutoMapperProfile()
        {
            //Define your AutoMapper configuration here for the Blazor project.

            CreateMap<ApiResource, ApiResourceListViewModel>();
        }
    }
}
