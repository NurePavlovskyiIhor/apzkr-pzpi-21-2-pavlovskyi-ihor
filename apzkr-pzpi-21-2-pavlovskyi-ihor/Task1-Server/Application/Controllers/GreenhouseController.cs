using Microsoft.AspNetCore.Mvc;
using Application.Models;
using Application.Repositories;
using Application.ViewModels;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System.ComponentModel.DataAnnotations.Schema;

[ApiController]
[Route("api/greenhouses")]
public class GreenhouseController : ControllerBase
{
    private readonly IGreenhouseRepository _greenhouseRepository;
    private readonly ISensorRepository _sensorRepository;
    private readonly IUserRepository _userRepository;

    public GreenhouseController(IGreenhouseRepository greenhouseRepository, IUserRepository userRepository, ISensorRepository sensorRepository)
    {
        _greenhouseRepository = greenhouseRepository;
        _userRepository = userRepository;
        _sensorRepository = sensorRepository;
    }


    [HttpGet]
    public IActionResult GetGreenhouses()
    {
        var greenhouse = _greenhouseRepository.GetGreenhouses().ToList();
        return Ok(greenhouse);
    }


    [HttpGet("{greenhouseId}")]
    public IActionResult GetGreenhouseById(int greenhouseId)
    {
        var greenhouse = _greenhouseRepository.GetGreenhouseById(greenhouseId);

        if (greenhouse == null)
        {
            return NotFound();
        }

        return Ok(greenhouse);
    }


    [HttpGet("byUserId/{userId}")]
    public IActionResult GetGreenhousesByUserId(int userId)
    {
        try
        {
            var existingUser = _userRepository.GetUserById(userId);

            if (existingUser == null)
            {
                return NotFound($"User with ID {userId} not found");
            }

            var greenhouseUsers = _greenhouseRepository.GetGreenhousesByUserId(userId).ToList();
            return Ok(greenhouseUsers);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error getting user schedules: {ex.Message}");
        }
    }


    [HttpPost]
    public IActionResult AddGreenhouse([FromBody] GreenhouseView greenhouseView)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingUser = _userRepository.GetUserById(greenhouseView.UserId);

        var greenhouse = new Greenhouse
        {
            Name = greenhouseView.Name,
            User = existingUser
        };

        _greenhouseRepository.AddGreenhouse(greenhouse);

        return CreatedAtAction(nameof(GetGreenhouseById), new { greenhouseId = greenhouse.GreenhouseId }, greenhouse);
    }


    [HttpPut("{greenhouseId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateGreenhouse([FromRoute] int greenhouseId, [FromBody] GreenhouseView greenhouseView)
    {
        try
        {
            var existingGreenhouse = _greenhouseRepository.GetGreenhouseById(greenhouseId);
            var existingUser = _userRepository.GetUserById(greenhouseView.UserId);

            if (existingGreenhouse == null)
            {
                return NotFound();
            }

            existingGreenhouse.Name = greenhouseView.Name;
            existingGreenhouse.User = existingUser;

            _greenhouseRepository.UpdateGreenhouse(existingGreenhouse);

            return Ok(existingGreenhouse);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    [HttpDelete("{greenhouseId}")]
    public IActionResult DeleteGreenhouse(int greenhouseId)
    {
        var existingGreenhouse = _greenhouseRepository.GetGreenhouseById(greenhouseId);

        if (existingGreenhouse == null)
        {
            return NotFound();
        }

        _greenhouseRepository.DeleteGreenhouse(greenhouseId);

        return NoContent();
    }

    public static double CalculateDewPoint(double temperature, double humidity)
    {
        // Constants for the Magnus formula
        const double A = 17.27;
        const double B = 237.7;

        double alpha = ((A * temperature) / (B + temperature)) + Math.Log(humidity / 100.0);
        double dewPoint = (B * alpha) / (A - alpha);
        return dewPoint;
    }

    [HttpGet("getDewPoint/{greenhouseId}")]
    public IActionResult GetDewPoint(int greenhouseId)
    {
        var sensors = _sensorRepository.GetSensorsByGreenhouseId(greenhouseId);

        Sensor? humiditySensor = null;
        Sensor? temperatureSensor = null;

        foreach (var sensor in sensors)
        {
            switch(sensor.SensorType)
            {
                case Application.Models.SensorTypes.Temperature:
                {
                    temperatureSensor = sensor;
                    break;
                }   
                case Application.Models.SensorTypes.Humidity:
                {
                    humiditySensor = sensor;
                    break;
                }
            }
        }

        if (temperatureSensor == null || humiditySensor == null)
        {
            return NoContent();
        }
        List<double> dewPoints = new List<double>();
        dewPoints.Add(CalculateDewPoint(temperatureSensor.MinValue, temperatureSensor.MinValue));
        dewPoints.Add(CalculateDewPoint(temperatureSensor.MaxValue, temperatureSensor.MaxValue));
        return Ok(dewPoints.ToArray());
    }
}
