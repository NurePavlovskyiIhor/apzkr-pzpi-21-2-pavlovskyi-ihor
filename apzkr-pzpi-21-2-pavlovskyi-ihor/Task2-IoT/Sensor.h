#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "Notification.h"
#include "Schedule.h"

struct Sensor
{
  Sensor() {}
  Sensor(int _sensorId, int _sensorType, float _minRefValue, float _maxRefValue,
         bool _isActive, std::vector<Schedule> _schedules)
  {
    sensorId = _sensorId;
    sensorType = _sensorType;
    minRefValue = _minRefValue;
    maxRefValue = _maxRefValue;
    isActive = _isActive;
    schedules = _schedules;
  }

  void CheckStateAndReportIfNeeded(float currentReadings, float acceptableDeviation, int controlSystemId, tm timeInfo, String serverUrl)
  {
    if(!isActive)
    {
      return;
    }
    bool inActiveSchedule = false;
    bool doesScheduleExist = false;
    for(auto& schedule : schedules)
    {
      doesScheduleExist = true;
      if((timeInfo.tm_hour > schedule.startTime.tm_hour || (timeInfo.tm_hour == schedule.startTime.tm_hour && timeInfo.tm_min > schedule.startTime.tm_min)) 
      || (timeInfo.tm_hour < schedule.endTime.tm_hour || (timeInfo.tm_hour == schedule.startTime.tm_hour && timeInfo.tm_min < schedule.startTime.tm_min)))
      {
        inActiveSchedule = true;
        break;
      }
    }
    if(doesScheduleExist && !inActiveSchedule)
    {
      Serial.println("sensor is disabled");
      return;
    }

    if(currentReadings - minRefValue + acceptableDeviation <= 0 || maxRefValue - currentReadings + acceptableDeviation <= 0)
    {
      if(abs(lastReported - currentReadings) >= acceptableDeviation)
      {
        lastReported = currentReadings;
        int sensorReadingId = PostSensorReading(serverUrl, currentReadings, timeInfo, sensorId);
        PostNotification(serverUrl, sensorReadingId, currentReadings, minRefValue, maxRefValue, sensorType);
      }
    }
  }

  float lastReported = 0.0f;
  int sensorId;
  int sensorType;
  float minRefValue;
  float maxRefValue;
  bool isActive;
  std::vector<Schedule> schedules;
};