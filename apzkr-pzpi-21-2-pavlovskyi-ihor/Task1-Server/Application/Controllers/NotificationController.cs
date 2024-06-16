using Microsoft.AspNetCore.Mvc;
using Application.Repositories;
using Application.Models;
using System;
using System.Linq;
using Application.Controllers;
using Application.ViewModels;
using System.Text.Json.Serialization;
using Google.Apis.Gmail.v1.Data;
using System.Collections.Generic;

[ApiController]
[Route("api/notifications")]
public class NotificationController : ControllerBase
{
    private readonly INotificationRepository _notificationRepository;
    private readonly ISensorReadingRepository _sensorReadingRepository;
    private readonly ISensorRepository _sensorRepository;

    public NotificationController(INotificationRepository notificationRepository, ISensorReadingRepository sensorReadingRepository, ISensorRepository sensorRepository)
    {
        _notificationRepository = notificationRepository;
        _sensorReadingRepository = sensorReadingRepository;
        _sensorRepository = sensorRepository;
    }


    [HttpGet]
    public IActionResult GetNotifications()
    {
        try
        {
            var notification = _notificationRepository.GetNotifications().ToList();
            return Ok(notification);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    [HttpGet("{notificationId}")]
    public IActionResult GetNotificationById(int notificationId)
    {
        try
        {
            var notification = _notificationRepository.GetNotificationById(notificationId);

            if (notification == null)
            {
                return NotFound($"Notification with ID {notificationId} not found");
            }

            return Ok(notification);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    [HttpGet("bySensorId/{sensorId}")]
    public IActionResult GetNotificationsBySensorId(int sensorId)
    {
        try
        {
            var existingSensor = _sensorRepository.GetSensorById(sensorId);

            if (existingSensor == null)
            {
                return NotFound($"Sensor with ID {sensorId} not found");
            }

            var scheduleSensors = _notificationRepository.GetNotificationsBySensorId(sensorId).ToList();
            return Ok(scheduleSensors);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error getting user schedules: {ex.Message}");
        }
    }


    [HttpPost]
    [ProducesResponseType(201)]
    [ProducesResponseType(400)]
    public IActionResult CreateNotification([FromBody] NotificationView notificationView)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingSensorReading = _sensorReadingRepository.GetSensorReadingById(notificationView.SensorReadingId);

        var notification = new Notification
        {
            Title = notificationView.Title,
            Message = notificationView.Message,
            IsSent = notificationView.IsSent,
            SensorReading = existingSensorReading
        };

        _notificationRepository.CreateNotification(notification);

        return CreatedAtAction(nameof(GetNotificationById), new { notificationId = notification.NotificationId }, notification);
    }


    [HttpPut("{notificationId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public IActionResult UpdateNotification([FromRoute] int notificationId, [FromBody] NotificationView notificationView)
    {
        try
        {
            var existingNotification = _notificationRepository.GetNotificationById(notificationId);

            if (existingNotification == null)
            {
                return NotFound();
            }

            var existingSensorReading = _sensorReadingRepository.GetSensorReadingById(notificationView.SensorReadingId);

            existingNotification.Title = notificationView.Title;
            existingNotification.Message = notificationView.Message;
            existingNotification.IsSent = notificationView.IsSent;
            existingNotification.SensorReading = existingSensorReading;

            _notificationRepository.UpdateNotification(existingNotification);

            return Ok(existingNotification);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    [HttpDelete("{notificationId}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public IActionResult DeleteNotification(int notificationId)
    {
        var existingNotification = _notificationRepository.GetNotificationById(notificationId);
        if (existingNotification == null)
        {
            return NotFound();
        }

        _notificationRepository.DeleteNotification(notificationId);

        return NoContent();
    }
}