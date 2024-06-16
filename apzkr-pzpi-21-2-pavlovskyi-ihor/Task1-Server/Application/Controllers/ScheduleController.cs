using Microsoft.AspNetCore.Mvc;
using Application.Models;
using Application.Repositories;
using Application.ViewModels;
using Application.DBContext;

[ApiController]
[Route("api/schedules")]
public class ScheduleController : ControllerBase
{
    private readonly IScheduleRepository _scheduleRepository;
    private readonly ISensorRepository _sensorRepository;
    private readonly AppDbContext _dbContext;

    public ScheduleController(IScheduleRepository scheduleRepository, ISensorRepository sensorRepository, AppDbContext dbContext)
    {
        _scheduleRepository = scheduleRepository;
        _sensorRepository = sensorRepository;

        _dbContext = dbContext;
    }


    [HttpGet]
    public IActionResult GetSchedules()
    {
        try
        {
            var schedule = _scheduleRepository.GetSchedules().ToList();
            return Ok(schedule);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    [HttpGet("{scheduleId}")]
    public IActionResult GetScheduleById(int scheduleId)
    {
        var schedule = _scheduleRepository.GetScheduleById(scheduleId);
        if (schedule == null)
        {
            return NotFound();
        }

        return Ok(schedule);
    }


    [HttpGet("bySensorId/{sensorId}")]
    public IActionResult GetScheduleBySensorId(int sensorId)
    {
        try
        {
            var existingSensor = _sensorRepository.GetSensorById(sensorId);

            if (existingSensor == null)
            {
                return NotFound($"Sensor with ID {sensorId} not found");
            }

            var greenhouseSchedules = _scheduleRepository.GetScheduleBySensorId(sensorId).ToList();
            return Ok(greenhouseSchedules);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error getting user schedules: {ex.Message}");
        }
    }


    [HttpPost]
    [ProducesResponseType(201)]
    [ProducesResponseType(400)]
    public IActionResult CreateSchedule([FromBody] ScheduleView scheduleView)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingSensor = _sensorRepository.GetSensorById(scheduleView.SensorId);

        var schedule = new Schedule
        {
            StartTime = scheduleView.StartTime,
            EndTime = scheduleView.EndTime,
            Sensor = existingSensor
        };

        _scheduleRepository.CreateSchedule(schedule);

        return CreatedAtAction(nameof(GetScheduleById), new { scheduleId = schedule.ScheduleId }, schedule);
    }


    [HttpPut("{scheduleId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateSchedule([FromRoute] int scheduleId, [FromBody] ScheduleView scheduleView)
    {
        try
        {
            var existingSchedule = _scheduleRepository.GetScheduleById(scheduleId);

            if (existingSchedule == null)
            {
                return NotFound();
            }

            var existingSensor = _sensorRepository.GetSensorById(scheduleView.SensorId);

            existingSchedule.StartTime = scheduleView.StartTime;
            existingSchedule.EndTime = scheduleView.EndTime;
            existingSchedule.Sensor = existingSensor;

            _scheduleRepository.UpdateSchedule(existingSchedule);

            return Ok(existingSchedule);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    [HttpDelete("{scheduleId}")]
    public IActionResult DeleteSchedule(int scheduleId)
    {
        try
        {
            _scheduleRepository.DeleteSchedule(scheduleId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Server error");
        }
    }
}
