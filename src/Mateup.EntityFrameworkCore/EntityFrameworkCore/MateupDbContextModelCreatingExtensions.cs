using Microsoft.EntityFrameworkCore;
using Volo.Abp;

namespace Mateup.EntityFrameworkCore
{
    public static class MateupDbContextModelCreatingExtensions
    {
        public static void ConfigureMateup(this ModelBuilder builder)
        {
            Check.NotNull(builder, nameof(builder));

            /* Configure your own tables/entities inside here */

            //builder.Entity<YourEntity>(b =>
            //{
            //    b.ToTable(MateupConsts.DbTablePrefix + "YourEntities", MateupConsts.DbSchema);
            //    b.ConfigureByConvention(); //auto configure for the base class props
            //    //...
            //});
        }
    }
}