using Application.Models;
using Application.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Application.DBContext
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> User { get; set; }
        public DbSet<Schedule> Schedule { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<SensorReading> SensorReading { get; set; }
        public DbSet<Sensor> Sensor { get; set; }
        public DbSet<LoginView> LoginView { get; set; }
        public DbSet<Greenhouse> Greenhouse { get; set; }
    }
}