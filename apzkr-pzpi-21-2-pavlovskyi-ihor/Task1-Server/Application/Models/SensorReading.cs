using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application.Models
{

    public class SensorReading
    {
        public int SensorReadingId { get; set; }
        public float Value { get; set; }
        public DateTime Timestamp { get; set; }

        [ForeignKey("SensorId")]
        public Sensor Sensor { get; set; }
    }
}