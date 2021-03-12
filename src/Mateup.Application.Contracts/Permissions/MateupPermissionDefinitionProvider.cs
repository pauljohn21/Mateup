using Mateup.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace Mateup.Permissions
{
    public class MateupPermissionDefinitionProvider : PermissionDefinitionProvider
    {
        public override void Define(IPermissionDefinitionContext context)
        {
            var myGroup = context.AddGroup(MateupPermissions.GroupName);

            //Define your own permissions here. Example:
            //myGroup.AddPermission(MateupPermissions.MyPermission1, L("Permission:MyPermission1"));
        }

        private static LocalizableString L(string name)
        {
            return LocalizableString.Create<MateupResource>(name);
        }
    }
}
