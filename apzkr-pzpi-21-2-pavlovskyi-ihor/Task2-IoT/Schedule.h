#include <HTTPClient.h>
#include <ArduinoJson.h>

struct Schedule
{
  static std::vector<Schedule> GetSchedules(int sensorId, String serverUrl)
  {
    std::vector<Schedule> schedules;

    HTTPClient http;
    String url = serverUrl + "api/schedules/bySensorId/" + String(sensorId);
    http.begin(url);

    int httpResponseCode = http.GET();

    Serial.printf("HTTP Response code: %d\n", httpResponseCode);
    if (httpResponseCode >= 200 && httpResponseCode <= 400) 
    {
      DynamicJsonDocument jsonDocumentResponse(1024);
      deserializeJson(jsonDocumentResponse, http.getString());

      JsonArray jsonArray = jsonDocumentResponse.as<JsonArray>();
      for (const JsonVariant& jsonVariant : jsonArray) 
      {
        Schedule tempSchedule;
        String startTimeStr = jsonVariant["startTime"];
        String endTimeStr = jsonVariant["endTime"];

        sscanf(startTimeStr.c_str(), "%d-%d-%dT%d:%d:%fZ", &tempSchedule.startTime.tm_year, &tempSchedule.startTime.tm_mon, &tempSchedule.startTime.tm_mday,
          &tempSchedule.startTime.tm_hour, &tempSchedule.startTime.tm_min, &tempSchedule.startTime.tm_min);
        sscanf(endTimeStr.c_str(), "%d-%d-%dT%d:%d:%fZ", &tempSchedule.endTime.tm_year, &tempSchedule.endTime.tm_mon, &tempSchedule.endTime.tm_mday,
          &tempSchedule.endTime.tm_hour, &tempSchedule.endTime.tm_min, &tempSchedule.endTime.tm_sec);

        schedules.push_back(tempSchedule);
      }
    }
    http.end();

    return schedules;
  }

  tm startTime;
  tm endTime;
};