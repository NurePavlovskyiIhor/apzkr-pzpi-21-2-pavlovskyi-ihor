using Microsoft.AspNetCore.Mvc;
using Application.Repositories;
using Application.Models;
using Application.ViewModels;

[ApiController]
[Route("api/sensors")]
public class SensorController : ControllerBase
{
    private readonly ISensorRepository _sensorRepository;
    private readonly IGreenhouseRepository _greenhouseRepository;

    public SensorController(ISensorRepository sensorRepository, IGreenhouseRepository greenhouseRepository)
    {
        _sensorRepository = sensorRepository;
        _greenhouseRepository = greenhouseRepository;
    }


    [HttpGet]
    public IActionResult GetSensors()
    {
        try
        {
            var sensors = _sensorRepository.GetSensors().ToList();
            return Ok(sensors);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error getting all sensors: {ex.Message}");
        }
    }


    [HttpGet("{sensorId}")]
    public IActionResult GetSensorById(int sensorId)
    {
        try
        {
            var Sensor = _sensorRepository.GetSensorById(sensorId);

            if (Sensor == null)
            {
                return NotFound($"Sensor with ID {sensorId} not found");
            }

            return Ok(Sensor);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error getting sensor: {ex.Message}");
        }
    }


    [HttpGet("byGreenhouseId/{greenhouseId}")]
    public IActionResult GetSensorsByGreenhouseId(int greenhouseId)
    {
        try
        {
            var existingGreenhouse = _greenhouseRepository.GetGreenhouseById(greenhouseId);

            if (existingGreenhouse == null)
            {
                return NotFound($"Greenhouse with ID {greenhouseId} not found");
            }

            var greenhouseSensors = _sensorRepository.GetSensorsByGreenhouseId(greenhouseId).ToList();
            return Ok(greenhouseSensors);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error getting user sensors: {ex.Message}");
        }
    }


    [HttpPost]
    [ProducesResponseType(201)]
    [ProducesResponseType(400)]
    public IActionResult CreateSensor([FromBody] SensorView sensorView)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingGreenhouse = _greenhouseRepository.GetGreenhouseById(sensorView.GreenhouseId);

        var sensor = new Sensor
        {
            SensorType = (Application.Models.SensorTypes)sensorView.SensorType,
            MinValue = sensorView.MinValue,
            MaxValue = sensorView.MaxValue,
            IsActive = sensorView.IsActive,
            Greenhouse = existingGreenhouse
        };

        _sensorRepository.CreateSensor(sensor);

        return CreatedAtAction(nameof(GetSensorById), new { sensorId = sensor.SensorId }, sensor);
    }


    [HttpPut("{sensorId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateSensor([FromRoute] int sensorId, [FromBody] SensorView sensorView)
    {
        try
        {
            var existingSensor = _sensorRepository.GetSensorById(sensorId);

            if (existingSensor == null)
            {
                return NotFound();
            }

            var existingGreenhouse = _greenhouseRepository.GetGreenhouseById(sensorView.GreenhouseId);

            existingSensor.SensorType = (Application.Models.SensorTypes)sensorView.SensorType;
            existingSensor.MinValue = sensorView.MinValue;
            existingSensor.MaxValue = sensorView.MaxValue;
            existingSensor.IsActive = sensorView.IsActive;
            existingSensor.Greenhouse = existingGreenhouse;

            _sensorRepository.UpdateSensor(existingSensor);

            return Ok(existingSensor);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    [HttpDelete("{sensorId}")]
    public IActionResult DeleteSensor(int sensorId)
    {
        try
        {
            _sensorRepository.DeleteSensor(sensorId);

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest($"Error deleting sensor: {ex.Message}");
        }
    }
}
