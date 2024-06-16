using Microsoft.EntityFrameworkCore;
using System.Linq;
using Application.Models;
using Application.DBContext;


namespace Application.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _dbContext;

        public UserRepository(AppDbContext context)
        {
            _dbContext = context;
        }
        public IQueryable<User> GetUsers()
        {
            return _dbContext.User.AsQueryable();
        }

        public User GetUserById(int userId)
        {
            return _dbContext.User.Find(userId);
        }

        public User GetUserByEmail(string email)
        {
            return _dbContext.User.FirstOrDefault(u => u.Email == email);
        }

        public void CreateUser(User user)
        {
            _dbContext.User.Add(user);
            _dbContext.SaveChanges();
        }

        public void UpdateUser(User user)
        {
            _dbContext.Entry(user).State = EntityState.Modified;
            _dbContext.SaveChanges();
        }

        public void DeleteUser(int userId)
        {
            var user = _dbContext.User.Find(userId);
            if (user != null)
            {
                _dbContext.User.Remove(user);
                _dbContext.SaveChanges();
            }
        }
    }
}