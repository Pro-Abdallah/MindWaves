using Microsoft.EntityFrameworkCore;
using MindWaves.Data.Models;

namespace MindWaves.Data
{
    public class MindWavesDbContext : DbContext
    {
        public MindWavesDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Message> Messages { get; set; }
    }
}
