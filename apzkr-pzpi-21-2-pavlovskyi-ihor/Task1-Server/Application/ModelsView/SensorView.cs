using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Application.Models;

namespace Application.ViewModels
{
    public enum SensorTypes
    {
        Projector,
        Coffeemaker
    }

    [NotMapped]
    public class SensorView
    {
        public SensorTypes SensorType { get; set; }
        public float MinValue { get; set; }
        public float MaxValue { get; set; }
        public bool IsActive { get; set; }
        public int GreenhouseId { get; set; }
    }
}
