using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application.Models
{
    public enum SensorTypes
    {
        Temperature,
        Humidity,
        Lighting,
        Acidity
    }
    public class Sensor
    {
        public int SensorId { get; set; }
        public SensorTypes SensorType { get; set; }
        public float MinValue { get; set; }
        public float MaxValue { get; set; }
        public bool IsActive { get; set; }

        [ForeignKey("GreenhouseId")]
        public Greenhouse Greenhouse { get; set; }
    }
}