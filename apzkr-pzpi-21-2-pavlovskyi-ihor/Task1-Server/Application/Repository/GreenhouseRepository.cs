using Microsoft.EntityFrameworkCore;
using System.Linq;
using Application.Models;
using Application.DBContext;
using Application.Repositories;

namespace Application.Repositories
{
    public class GreenhouseRepository : IGreenhouseRepository
    {
        private readonly AppDbContext _dbContext;

        public GreenhouseRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<Greenhouse> GetGreenhouses()
        {
            return _dbContext.Greenhouse.Include(d => d.User).AsQueryable();
        }

        public Greenhouse GetGreenhouseById(int id)
        {
            return _dbContext.Greenhouse.Include(d => d.User).FirstOrDefault(d => d.GreenhouseId == id);
        }

        public List<Greenhouse> GetGreenhousesByUserId(int userId)
        {
            return _dbContext.Greenhouse
                .Where(greenhouse => greenhouse.User.UserId == userId)
                .ToList();
        }

        public void AddGreenhouse(Greenhouse greenhouse)
        {
            _dbContext.Greenhouse.Add(greenhouse);
            _dbContext.SaveChanges();
        }

        public void UpdateGreenhouse(Greenhouse greenhouse)
        {
            _dbContext.Entry(greenhouse).State = EntityState.Modified;
            _dbContext.SaveChanges();
        }

        public void DeleteGreenhouse(int id)
        {
            var greenhouse = _dbContext.Greenhouse.FirstOrDefault(n => n.GreenhouseId == id);

            if (greenhouse != null)
            {
                _dbContext.Greenhouse.Remove(greenhouse);
                _dbContext.SaveChanges();
            }
        }
    }
}
