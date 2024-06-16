namespace mobile_greenhouses.Models
{
    public class Sensor
    {
        public int SensorId { get; set; }
        public SensorTypes SensorType { get; set; }
        public int MinValue { get; set; }
        public int MaxValue { get; set; }
        public bool isActive { get; set; }
        public int UserId { get; set; }
    }

    public enum SensorTypes
    {
        Temperature,
        Humidity,
        Lighting,
        Acidity
    }
}
