using Application.Models;

namespace Application.Repositories
{
    public interface IGreenhouseRepository
    {
        IQueryable<Greenhouse> GetGreenhouses();
        Greenhouse GetGreenhouseById(int id);
        void AddGreenhouse(Greenhouse greenhouse);
        void UpdateGreenhouse(Greenhouse greenhouse);
        void DeleteGreenhouse(int id);
        List<Greenhouse> GetGreenhousesByUserId(int userId);
    }
}
