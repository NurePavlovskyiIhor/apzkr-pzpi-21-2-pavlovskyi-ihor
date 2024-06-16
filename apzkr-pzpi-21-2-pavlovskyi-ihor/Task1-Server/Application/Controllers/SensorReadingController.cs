using Microsoft.AspNetCore.Mvc;
using Application.Models;
using Application.Repositories;
using Application.ViewModels;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/sensorReadings")]
public class SensorReadingController : ControllerBase
{
    private readonly ISensorReadingRepository _sensorReadingRepository;
    private readonly ISensorRepository _sensorRepository;

    public SensorReadingController(ISensorReadingRepository sensorReadingRepository, ISensorRepository sensorRepository)
    {
        _sensorReadingRepository = sensorReadingRepository;
        _sensorRepository = sensorRepository;
    }


    [HttpGet]
    public IActionResult GetSensorReadings()
    {
        try
        {
            var sensorReading = _sensorReadingRepository.GetSensorReadings().ToList();
            return Ok(sensorReading);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    [HttpGet("{sensorReadingId}")]
    public IActionResult GetSensorReadingById(int sensorReadingId)
    {
        var sensorReading = _sensorReadingRepository.GetSensorReadingById(sensorReadingId);

        if (sensorReading == null)
        {
            return NotFound("Not found");
        }

        return Ok(sensorReading);
    }


    [HttpPost]
    [ProducesResponseType(201)]
    [ProducesResponseType(400)]
    public IActionResult CreateSensorReading([FromBody] SensorReadingView sensorReadingView)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingSensor = _sensorRepository.GetSensorById(sensorReadingView.SensorId);

        var sensorReading = new SensorReading
        {
            Value = sensorReadingView.Value,
            Timestamp = sensorReadingView.Timestamp,
            Sensor = existingSensor
        };

        _sensorReadingRepository.CreateSensorReading(sensorReading);

        return CreatedAtAction(nameof(GetSensorReadingById), new { sensorReadingId = sensorReading.SensorReadingId }, sensorReading);
    }


    [HttpPut("{sensorReadingId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateSensorReading([FromRoute] int sensorReadingId, [FromBody] SensorReadingView sensorReadingView)
    {
        try
        {
            var existingSensorReading = _sensorReadingRepository.GetSensorReadingById(sensorReadingId);

            if (existingSensorReading == null)
            {
                return NotFound();
            }

            var existingSensor = _sensorRepository.GetSensorById(sensorReadingView.SensorId);

            existingSensorReading.Value = sensorReadingView.Value;
            existingSensorReading.Timestamp = sensorReadingView.Timestamp;
            existingSensorReading.Sensor = existingSensor;

            _sensorReadingRepository.UpdateSensorReading(existingSensorReading);

            return Ok(existingSensorReading);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpDelete("{sensorReadingId}")]
    public IActionResult DeleteSensorReading(int sensorReadingId)
    {
        try
        {
            _sensorReadingRepository.DeleteSensorReading(sensorReadingId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Server error");
        }
    }
}