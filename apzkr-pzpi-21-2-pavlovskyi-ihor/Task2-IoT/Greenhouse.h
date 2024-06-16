#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "Sensor.h"
#include <vector>

struct Greenhouse
{
  Greenhouse() {}
  Greenhouse(int controlSystemId, String serverUrl)
  {
    HTTPClient http;
    String url = serverUrl + "api/sensors/byGreenhouseId/" + String(controlSystemId);

    // Begin HTTP communication with the server
    http.begin(url);

    // Make the POST request
    int httpResponseCode = http.GET();

    Serial.printf("HTTP Response code: %d\n", httpResponseCode);
    if (httpResponseCode >= 200 && httpResponseCode <= 400) 
    {
      DynamicJsonDocument jsonDocumentResponse(1024);
      deserializeJson(jsonDocumentResponse, http.getString());

      //serializeJsonPretty(jsonDocumentResponse, Serial);

      JsonArray jsonArray = jsonDocumentResponse.as<JsonArray>();
      for (const JsonVariant& jsonVariant : jsonArray) 
      {
          int sensorId = jsonVariant["sensorId"];
          int sensorType = jsonVariant["sensorType"];
          float minRefValue = jsonVariant["minValue"];
          float maxRefValue = jsonVariant["maxValue"];
          bool isActive = jsonVariant["isActive"];
          std::vector<Schedule> schedules = Schedule::GetSchedules(sensorId, serverUrl);

          Sensor tempSensor = Sensor(sensorId, sensorType, minRefValue, maxRefValue,
                                     isActive, schedules);
          sensors.push_back(tempSensor);
      }
    }

    http.end();
  }

  std::vector<Sensor> sensors;
};