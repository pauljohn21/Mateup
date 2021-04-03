using AutoMapper;
using Mateup.EntityFrameworkCore;
using Mateup.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.IdentityServer;
using Volo.Abp.IdentityServer.Clients;
using System.Linq;
using Newtonsoft.Json;
using Volo.Abp.IdentityServer.EntityFrameworkCore;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Authorization.Permissions;

namespace Mateup.Controllers
{
    [Route("api/[controller]")]
    public class ClientsController : AbpController
    {
        private readonly IPermissionGrantRepository _permissionGrantRepository;
        private readonly IClientRepository _clientRepository;
        private readonly IMapper _mapper;
        private readonly IIdentityServerDbContext _mateupDbContext;

        public ClientsController(IClientRepository apiResourceRepository, IPermissionGrantRepository permissionGrantRepository, IMapper mapper, IIdentityServerDbContext mateupDbContext)
        {
            _clientRepository = apiResourceRepository;
            _permissionGrantRepository = permissionGrantRepository;
            _mapper = mapper;
            _mateupDbContext = mateupDbContext;
        }

        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<ClientListViewModel>>> ListClients()
        {
            var clients = await _clientRepository.GetListAsync();
            return Ok(_mapper.Map<IEnumerable<ClientListViewModel>>(clients));
        }

        [HttpGet("{client}")]
        public async Task<ActionResult<Client>> GetClient(Guid client)
        {
            var clients = await _clientRepository.GetAsync(client, true);
            return Ok(clients);
        }

        [HttpPost("")]
        public async Task<ActionResult<Client>> Post([FromBody] SaveClientViewModel clientVm)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }

            var client = await _clientRepository.FindByClientIdAsync(clientVm.Name);
            if (client == null)
            {
                client = await _clientRepository.InsertAsync(
                    new Client(
                        Guid.NewGuid(),
                        clientVm.Name
                    )
                    {
                        ClientName = clientVm.Name,
                        ProtocolType = "oidc",
                        Description = clientVm.Name,
                        AlwaysIncludeUserClaimsInIdToken = true,
                        AllowOfflineAccess = true,
                        AbsoluteRefreshTokenLifetime = 31536000, //365 days
                        AccessTokenLifetime = 31536000, //365 days
                        AuthorizationCodeLifetime = 300,
                        IdentityTokenLifetime = 300,
                        RequireConsent = false
                    },
                    autoSave: true
                );
            }

            foreach (var scope in clientVm.Scopes)
            {
                if (client.FindScope(scope) == null)
                {
                    client.AddScope(scope);
                }
            }

            foreach (var grantType in clientVm.GrantTypes)
            {
                if (client.FindGrantType(grantType) == null)
                {
                    client.AddGrantType(grantType);
                }
            }

            if (client.FindSecret(clientVm.Secret) == null)
            {
                client.AddSecret(clientVm.Secret);
            }

            if (clientVm.RedirectUri != null)
            {
                if (client.FindRedirectUri(clientVm.RedirectUri) == null)
                {
                    client.AddRedirectUri(clientVm.RedirectUri);
                }
            }

            if (clientVm.PostLogoutRedirectUri != null)
            {
                if (client.FindPostLogoutRedirectUri(clientVm.PostLogoutRedirectUri) == null)
                {
                    client.AddPostLogoutRedirectUri(clientVm.PostLogoutRedirectUri);
                }
            }

            if (clientVm.Permissions != null)
            {


                foreach (var permissionName in clientVm.Permissions)
                {
                    if (await _permissionGrantRepository.FindAsync(permissionName, ClientPermissionValueProvider.ProviderName, clientVm.Name) != null)
                    {
                        continue;
                    }

                    await _permissionGrantRepository.InsertAsync(
                        new PermissionGrant(
                            GuidGenerator.Create(),
                            permissionName,
                             ClientPermissionValueProvider.ProviderName,
                            clientVm.Name,
                            null
                        )
                    );
                }

            }

             await _clientRepository.UpdateAsync(client);

            var newClient = await _clientRepository.GetAsync(client.Id, true);

            return CreatedAtAction(nameof(GetClient), new { client = client.Id }, newClient);
        }

        [HttpPut("{client}")]
        public async Task<ActionResult> Update(Guid client, [FromBody] Client model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }

            await _clientRepository.UpdateAsync(model, true);
            return NoContent();
        }

        [HttpPatch("{client}")]
        public async Task<ActionResult> PartialUpdate(Guid client, [FromBody] JsonPatchDocument<Client> model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }

            var clientDb = await _clientRepository.GetAsync(client, true);
            if (clientDb == null)
            {

                return NotFound();
            }

            model.ApplyTo(clientDb);
            await _clientRepository.UpdateAsync(clientDb, true);
            return NoContent();
        }

        [HttpDelete("{client}")]
        public async Task<ActionResult> Delete(Guid client)
        {

            await _clientRepository.DeleteAsync(client, true);
            return NoContent();
        }


        [HttpPost("{client}/copy")]
        public async Task<ActionResult<Client>> Copy(Guid client)
        {
            var clients = await _clientRepository.GetAsync(client, true);
            var newClient = JsonConvert.DeserializeObject<Client>(JsonConvert.SerializeObject(clients));
            await _clientRepository.InsertAsync(newClient, true);
            newClient = await _clientRepository.GetAsync(client, true);
            return CreatedAtAction(nameof(GetClient), new { client }, newClient);
        }

        [HttpGet("{client}/secrets")]
        public async Task<ActionResult<IEnumerable<Secret>>> Secrets(Guid client)
        {
            var clients = await _clientRepository.GetAsync(client, true);
            return Ok(clients.ClientSecrets);
        }

        [HttpDelete("{client}/secrets")]
        public async Task<ActionResult> RemoveSecret(Guid client, string type, string value)
        {
            var clients = await _clientRepository.GetAsync(client, true);
            clients.RemoveSecret(value, type);
            await _mateupDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{client}/secrets")]
        public async Task<ActionResult<IEnumerable<Secret>>> SaveSecret(Guid client, [FromBody] SaveClientSecretViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }

            var clients = await _clientRepository.GetAsync(client, true);
            clients.AddSecret(model.Value, model.Expiration, model.Type, model.Description);
            await _mateupDbContext.SaveChangesAsync();
            var secret = clients.FindSecret(model.Value, model.Type);
            return CreatedAtAction(nameof(Secrets), new { client }, secret);
        }

        [HttpGet("{client}/properties")]
        public async Task<ActionResult<IEnumerable<ClientPropertyViewModel>>> Properties(Guid client)
        {
            var clients = await _clientRepository.GetAsync(client, true);

            return Ok(clients.Properties);
        }

        [HttpDelete("{client}/properties/{key}")]
        public async Task<ActionResult> RemoveProperty(Guid client, string key)
        {
            var clients = await _clientRepository.GetAsync(client, true);
            var property = clients.Properties.FirstOrDefault(x => x.Key == key);
            clients.RemoveProperty(key, property.Value);
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
            var clients = await _clientRepository.GetAsync(client, true);
            clients.AddProperty(model.Key, model.Value);
            await _mateupDbContext.SaveChangesAsync();
            var properties = clients.FindProperty(model.Key, model.Value);

            return CreatedAtAction(nameof(Properties), new { client }, properties);
        }

        [HttpGet("{client}/claims")]
        public async Task<ActionResult<IEnumerable<ClaimViewModel>>> Claims(Guid client)
        {
            var clients = await _clientRepository.GetAsync(client, true);
            return Ok(_mapper.Map<List<ClaimViewModel>>(clients.Claims));
        }

        [HttpDelete("{client}/claims")]
        public async Task<ActionResult> RemoveClaim(Guid client, string type, string value)
        {
            var clients = await _clientRepository.GetAsync(client, true);
            clients.RemoveClaim(value, type);
            await _mateupDbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpPost("{client}/claims")]
        public async Task<ActionResult<IEnumerable<ClaimViewModel>>> SaveClaim(Guid client, [FromBody] SaveClientClaimViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ValidationProblemDetails(ModelState));
            }
            var clients = await _clientRepository.GetAsync(client, true);
            clients.AddClaim(model.Value, model.Type);
            await _mateupDbContext.SaveChangesAsync();

            var claims = clients.FindClaim(model.Value, model.Type);
            return CreatedAtAction(nameof(Claims), new { client }, claims);
        }
    }
}
