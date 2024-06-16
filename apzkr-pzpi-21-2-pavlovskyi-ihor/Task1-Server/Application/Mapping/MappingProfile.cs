using AutoMapper;
using Application.Models;
using Application.ViewModels;

namespace Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, LoginView>().ReverseMap();
            CreateMap<Schedule, ScheduleView>().ReverseMap();
            CreateMap<Notification, NotificationView>().ReverseMap();
            CreateMap<SensorReading, SensorReadingView>().ReverseMap();
            CreateMap<Sensor, SensorView>().ReverseMap();
            CreateMap<Greenhouse, GreenhouseView>().ReverseMap();
        }
    }
}