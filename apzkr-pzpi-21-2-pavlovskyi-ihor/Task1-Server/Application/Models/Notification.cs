using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations.Schema;

namespace Application.Models
{

    public class Notification
    {
        public int NotificationId { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public bool IsSent { get; set; }
    
        [ForeignKey("SensorReadingId")]
        public SensorReading SensorReading { get; set; }
    }
}