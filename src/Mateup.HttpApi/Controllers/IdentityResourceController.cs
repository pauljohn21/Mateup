using AutoMapper;
using Mateup.EntityFrameworkCore;
using Mateup.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.IdentityServer.EntityFrameworkCore;
using Volo.Abp.IdentityServer.IdentityResources;

namespace Mateup.Controllers
{
    [Route("api/[controller]")]
    public class IdentityResourceController : AbpController
    {
        private readonly IdentityResourceRepository _identityResourceRepository;
        private readonly IMapper _mapper;
        private readonly IIdentityServerDbContext _mateupDbContext;

        public IdentityResourceController(IdentityResourceRepository apiResourceRepository, IMapper mapper, IIdentityServerDbContext mateupDbContext)
        {
            _identityResourceRepository = apiResourceRepository;
            _mapper = mapper;
            _mateupDbContext = mateupDbContext;
        }

        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<IdentityResourceListView>>> List()
        {
            var irs = await _identityResourceRepository.GetListAsync();
            return Ok(_mapper.Map<IEnumerable<IdentityResourceListView>>(irs));
        }

        [HttpGet("{resource}")]
        public async Task<ActionResult<IdentityResource>> Details(Guid resource)
        {
            var irs = await _identityResourceRepository.GetAsync(resource, true);
            return Ok(irs);
        }

        [HttpPost("")]
        public async Task<ActionResult<IdentityResource>> Save([FromBody] IdentityResource model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }

            await _identityResourceRepository.InsertAsync(model, true);
            var idr = await _identityResourceRepository.GetAsync(model.Id, true);
            return CreatedAtAction(nameof(Details), new { resource = model.Name }, idr);
        }

        [HttpPut("{resource}")]
        public async Task<ActionResult> Update(Guid resource, [FromBody] IdentityResource model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }

            await _identityResourceRepository.UpdateAsync(model, true);
            return NoContent();
        }

        [HttpPatch("{resource}")]
        public async Task<ActionResult> PartialUpdate(Guid resource,
            [FromBody] JsonPatchDocument<IdentityResource> model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }

            var ir = await _identityResourceRepository.GetAsync(resource, true);
            if (ir == null)
            {
                return NotFound();
            }

            model.ApplyTo(ir);
            await _identityResourceRepository.UpdateAsync(ir);
            return NoContent();
        }

        [HttpDelete("{resource}")]
        public async Task<ActionResult<bool>> Remove(Guid resource)
        {

            await _identityResourceRepository.DeleteAsync(resource, true);
            return NoContent();
        }
    }
}
