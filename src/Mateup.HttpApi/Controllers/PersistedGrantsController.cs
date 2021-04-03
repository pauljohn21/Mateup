using AutoMapper;
using Mateup.EntityFrameworkCore;
using Mateup.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.IdentityServer.EntityFrameworkCore;
using Volo.Abp.IdentityServer.Grants;

namespace Mateup.Controllers
{
    [Route("api/[controller]")]
    public class PersistedGrantsController : AbpController
    {
        private readonly PersistentGrantRepository _persistentGrantRepository;


        private readonly IMapper _mapper;
        private readonly IIdentityServerDbContext _mateupDbContext;

        public PersistedGrantsController(PersistentGrantRepository persistentGrantRepository, IMapper mapper, IIdentityServerDbContext mateupDbContext)
        {
            _persistentGrantRepository = persistentGrantRepository;
            _mapper = mapper;
            _mateupDbContext = mateupDbContext;
        }


        [HttpGet, Route("")]
        public async Task<ActionResult<List<PersistedGrantViewModel>>> List([Range(1, 50)] int? limit = 10, [Range(1, int.MaxValue)] int? offset = 1)
        {
            var irs = await _persistentGrantRepository.GetPagedListAsync(limit.Value * offset.Value, limit.Value, "");
            return Ok(_mapper.Map<List<PersistedGrantViewModel>>(irs));
        }

        [HttpDelete, Route("{id}")]
        public async Task<ActionResult> Remove(string id)
        {
            await _persistentGrantRepository.DeleteAsync(id);
            await _mateupDbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
