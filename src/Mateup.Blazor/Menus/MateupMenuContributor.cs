﻿using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mateup.Localization;
using Volo.Abp.Account.Localization;
using Volo.Abp.UI.Navigation;
using Volo.Abp.Users;

namespace Mateup.Blazor.Menus
{
    public class MateupMenuContributor : IMenuContributor
    {
        private readonly IConfiguration _configuration;

        public MateupMenuContributor(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task ConfigureMenuAsync(MenuConfigurationContext context)
        {
            if (context.Menu.Name == StandardMenus.Main)
            {
                await ConfigureMainMenuAsync(context);
            }
            else if (context.Menu.Name == StandardMenus.User)
            {
                await ConfigureUserMenuAsync(context);
            }
        }

        private Task ConfigureMainMenuAsync(MenuConfigurationContext context)
        {
            var l = context.GetLocalizer<MateupResource>();

            context.Menu.Items.Insert(
                0,
                new ApplicationMenuItem(
                    MateupMenus.Home,
                    l["Menu:Home"],
                    "/",
                    icon: "fas fa-home"
                )
            );
            AddMenu(context);
            return Task.CompletedTask;
        }

        private Task ConfigureUserMenuAsync(MenuConfigurationContext context)
        {
            var accountStringLocalizer = context.GetLocalizer<AccountResource>();
            var currentUser = context.ServiceProvider.GetRequiredService<ICurrentUser>();

            var identityServerUrl = _configuration["AuthServer:Authority"] ?? "";
            AddMenu(context);
            if (currentUser.IsAuthenticated)
            {
                context.Menu.AddItem(new ApplicationMenuItem(
                    "Account.Manage",
                    accountStringLocalizer["ManageYourProfile"],
                    $"{identityServerUrl.EnsureEndsWith('/')}Account/Manage?returnUrl={_configuration["App:SelfUrl"]}",
                    icon: "fa fa-cog",
                    order: 1000,
                    null));
            }

            return Task.CompletedTask;
        }

        private void AddMenu(MenuConfigurationContext context)
        {
            var accountStringLocalizer = context.GetLocalizer<AccountResource>();
            var currentUser = context.ServiceProvider.GetRequiredService<ICurrentUser>();

            var identityServerUrl = _configuration["AuthServer:Authority"] ?? "";

            var l = context.GetLocalizer<MateupResource>();

            context.Menu.AddItem(
               new ApplicationMenuItem(name: "Mateup.Clients",displayName: l["MateUp:Clients"], url: "/clients"));
            context.Menu.AddItem(
             new ApplicationMenuItem(name: "Mateup.IdentityResources", displayName: l["MateUp:IdentityResources"], url: "/identity-resources") );
            context.Menu.AddItem(
       new ApplicationMenuItem(name: "Mateup.ApiResources", displayName: l["MateUp:ApiResources"], url: "/api-resources"));
            context.Menu.AddItem(
     new ApplicationMenuItem(name: "Mateup.PersistedGrants", displayName: l["MateUp:PersistedGrants"], url: "/persisted-grants"));
            context.Menu.AddItem(
 new ApplicationMenuItem(name: "Mateup.Users", displayName: l["MateUp:Users"], url: "/users"));
            context.Menu.AddItem(
new ApplicationMenuItem(name: "Mateup.Roles", displayName: l["MateUp:Roles"], url: "/roles"));
        }
    }
}
