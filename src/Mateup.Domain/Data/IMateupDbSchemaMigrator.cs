using System.Threading.Tasks;

namespace Mateup.Data
{
    public interface IMateupDbSchemaMigrator
    {
        Task MigrateAsync();
    }
}
