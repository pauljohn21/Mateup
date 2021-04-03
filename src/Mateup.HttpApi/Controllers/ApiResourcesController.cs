using Abp.EntityFrameworkCore;
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
using Volo.Abp.IdentityServer.ApiResources;
using Volo.Abp.IdentityServer.EntityFrameworkCore;
using Volo.Abp.ObjectMapping;

namespace Mateup.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiResourcesController : ControllerBase
    {
        private readonly IApiResourceRepository _apiResourceRepository;

        private readonly IIdentityServerDbContext _mateupDbContext;
        private readonly IObjectMapper<MateupHttpApiModule> _mapper;
        public ApiResourcesController(IApiResourceRepository apiResourceRepository, IObjectMapper<MateupHttpApiModule> mapper, IIdentityServerDbContext mateupDbContext)
        {
            _apiResourceRepository = apiResourceRepository;
            _mapper = mapper;
            _mateupDbContext = mateupDbContext;
        }

        [HttpGet]
        public async Task<ActionResult> ListAsync()
        {
            //ApiResource
            var apiResources = await _apiResourceRepository.GetListAsync();
            return Ok(_mapper.Map<List<ApiResource>, List<ApiResourceListViewModel>>(apiResources));
        }

        [HttpGet("{resource}")]
        public async Task<ActionResult<ApiResource>> Details(Guid resource)
        {
            var irs = await _apiResourceRepository.GetAsync(resource);
            return irs;
        }

        [HttpPost("")]
        public async Task<ActionResult> Save(CreateApiResourceViewModel model)
        {
            if (!ModelState.IsValid)
            {
                //NotifyModelStateErrors();
                return BadRequest(new ValidationProblemDetails(ModelState));
            }
            ApiResource apiResource = new ApiResource(Guid.NewGuid(), model.Name, model.DisplayName, model.Description);
            apiResource.Enabled = true;
            foreach (var claim in model.UserClaims)
            {
                apiResource.AddUserClaim(claim);
            }
            await _apiResourceRepository.InsertAsync(apiResource, true);
            var apires = await _apiResourceRepository.GetAsync(apiResource.Id);

            return CreatedAtAction(nameof(Details), new { resource = apiResource.Id }, apires);
        }

        [HttpPut("{resource}")]
        public async Task<ActionResult<bool>> Update(string resource, [FromBody] ApiResource model)
        {
            if (!ModelState.IsValid)
            {
                //NotifyModelStateErrors();
                //return ModelStateErrorResponseError();
                return BadRequest(new ValidationProblemDetails(ModelState));
            }

            await _apiResourceRepository.UpdateAsync(model, true);
            return NoContent();
        }

        [HttpPatch("{resource}")]
        public async Task<ActionResult<bool>> PartialUpdate(Guid resource, [FromBody] JsonPatchDocument<ApiResource> model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }

            var ar = await _apiResourceRepository.GetAsync(resource);
            if (ar == null)
            {
                ModelState.AddModelError("resource", "Invalid Api Resource");
                return NotFound();
            }
            model.ApplyTo(ar);
            await _apiResourceRepository.UpdateAsync(ar, true);
            return NoContent();
        }

        [HttpDelete("{resource}")]
        public async Task<ActionResult> Remove(Guid resource)
        {
            await _apiResourceRepository.DeleteAsync(resource, true);
            return NoContent();
        }

        [HttpGet("{resource}/secrets")]
        public async Task<ActionResult<IEnumerable<ApiResourceSecret>>> Secrets(Guid resource)
        {
            var clients = await _apiResourceRepository.GetAsync(resource);

            return Ok(clients.Secrets);
        }

        [HttpDelete("{resource}/secrets")]
        public async Task<ActionResult<bool>> RemoveSecret(Guid resource, string type, string value)
        {
            var clients = await _apiResourceRepository.GetAsync(resource);
            clients.RemoveSecret(value, type);
            await _apiResourceRepository.UpdateAsync(clients, true);
            return NoContent();
        }


        [HttpPost("{resource}/secrets")]
        public async Task<ActionResult<IEnumerable<ApiResourceSecret>>> SaveSecret(Guid resource, [FromBody] SaveApiSecretViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }
            var clients = await _apiResourceRepository.GetAsync(resource);

            clients.AddSecret(model.Value, model.Expiration, model.Type, model.Description);
            await _apiResourceRepository.UpdateAsync(clients);


            return CreatedAtAction(nameof(Secrets), new { resource }, clients.Secrets);
        }

        [HttpGet("{resource}/scopes")]
        public async Task<ActionResult<IEnumerable<ApiResourceScope>>> Scopes(Guid resource)
        {
            var clients = await _apiResourceRepository.GetAsync(resource);
            return clients.Scopes;
        }

        [HttpDelete("{resource}/scopes/{scope}")]
        public async Task<ActionResult> RemoveScope(Guid resource, string scope)
        {
            var clients = await _apiResourceRepository.GetAsync(resource);
            clients.RemoveScope(scope);
            await _apiResourceRepository.UpdateAsync(clients);
            return NoContent();
        }


        [HttpPost("{resource}/scopes")]
        public async Task<ActionResult<IEnumerable<ApiResourceScope>>> SaveScope(Guid resource, [FromBody] SaveApiScopeViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }
            var clients = await _apiResourceRepository.GetAsync(resource);


            clients.AddScope(model.Scope);
            await _apiResourceRepository.UpdateAsync(clients);
            var scopes = clients.FindScope(model.Scope);
            return CreatedAtAction(nameof(Scopes), new { resource }, scopes);
        }

        [HttpGet("{client}/properties")]
        public async Task<ActionResult<IEnumerable<ClientPropertyViewModel>>> Properties(Guid client)
        {
            var clients = await _apiResourceRepository.GetAsync(client, true);

            return Ok(clients.Properties);
        }

        [HttpDelete("{client}/properties/{key}")]
        public async Task<ActionResult> RemoveProperty(Guid client, string key)
        {
            var clients = await _apiResourceRepository.GetAsync(client, true);
            var property = clients.Properties.FirstOrDefault(x => x.Key == key);
            clients.RemoveProperty(key);
            await _mateupDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("{client}/properties")]
        public async Task<ActionResult<IEnumerable<ClientPropertyViewModel>>> SaveProperty(Guid client, [FromBody] SaveClientPropertyViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }
            var clients = await _apiResourceRepository.GetAsync(client, true);
            clients.AddProperty(model.Key, model.Value);
            await _mateupDbContext.SaveChangesAsync();
            var properties = clients.FindProperty(model.Key);

            return CreatedAtAction(nameof(Properties), new { client }, properties);
        }

    }
}
