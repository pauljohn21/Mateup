using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace Mateup.Data
{
    /* This is used if database provider does't define
     * IMateupDbSchemaMigrator implementation.
     */
    public class NullMateupDbSchemaMigrator : IMateupDbSchemaMigrator, ITransientDependency
    {
        public Task MigrateAsync()
        {
            return Task.CompletedTask;
        }
    }
}