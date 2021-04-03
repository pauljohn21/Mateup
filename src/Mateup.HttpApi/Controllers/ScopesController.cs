using AutoMapper;
using Mateup.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.IdentityServer.ApiScopes;
using Volo.Abp.IdentityServer.EntityFrameworkCore;

namespace Mateup.Controllers
{
    [Route("api/[controller]")]
    public class ScopesController : AbpController
    {
        private readonly IApiScopeRepository _apiScopeRepository;


        private readonly IMapper _mapper;
        private readonly IdentityServerDbContext _mateupDbContext;

        public ScopesController(IApiScopeRepository persistentGrantRepository, IMapper mapper, IdentityServerDbContext mateupDbContext)
        {
            _apiScopeRepository = persistentGrantRepository;
            _mapper = mapper;
            _mateupDbContext = mateupDbContext;
        }


        [HttpGet, Route("{scope}")]
        public async Task<ActionResult<IEnumerable<string>>> Search(string scope)
        {
        
            var scopes = await _apiScopeRepository.GetListByNameAsync(new[] { scope }, false);
            //return ResponseGet(clients);
            return Ok(scopes.Select(x => x.Name));
        }
    }
}
