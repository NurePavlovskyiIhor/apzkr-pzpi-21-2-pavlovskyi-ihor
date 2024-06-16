#include <HTTPClient.h>
#include <ArduinoJson.h>

static int PostSensorReading(String serverUrl, float value, tm timestamp, int sensorId)
{
  char formattedTime[25];
  strftime(formattedTime, sizeof(formattedTime), "%Y-%m-%dT%H:%M:%S.000Z", &timestamp);
  String notificationDateTime = String(formattedTime);

  HTTPClient http;
  http.begin(serverUrl + "api/sensorReadings");

  http.addHeader("Content-Type", "application/json");

  DynamicJsonDocument jsonDocument(1024);
  jsonDocument["value"] = value;
  jsonDocument["timestamp"] = formattedTime;
  jsonDocument["sensorId"] = sensorId; 

  String jsonPayload;
  serializeJson(jsonDocument, jsonPayload);

  int httpResponseCode = http.POST(jsonPayload);

  Serial.printf("HTTP Response code: %d\n", httpResponseCode);

  if (httpResponseCode >= 200 && httpResponseCode <= 400) 
  {
    DynamicJsonDocument jsonDocumentResponse(1024);
    deserializeJson(jsonDocumentResponse, http.getString());

    return jsonDocumentResponse["sensorReadingId"].as<int>();
  }
  return -1;
}

static void PostNotification(String serverUrl, int sensorReadingId, float value, float minRefValue, float maxRefValue, int sensorType)
{
  String sensorName;
  switch(sensorType)
  {
    case 0:
    sensorName = "Temperature";
    break;

    case 1:
    sensorName = "Humidity";
    break;

    case 2:
    sensorName = "Lighting";
    break;

    case 3:
    sensorName = "Acidity";
    break;

    default:
    sensorName = "Undefined";
    break;
  }

  String title = "Readings diverse from configuration";
  String notificationMessage = String("The readings of ") + sensorName + " sensor are our of range. " + "Expected value from " + minRefValue + " to " + maxRefValue + ". Currently, the value is " + value;

  HTTPClient http;
  http.begin(serverUrl + "api/notifications");

  http.addHeader("Content-Type", "application/json");

  DynamicJsonDocument jsonDocument(1024);
  jsonDocument["title"] = title;
  jsonDocument["message"] = notificationMessage;
  jsonDocument["isSent"] = true; 
  jsonDocument["sensorReadingId"] = sensorReadingId; 

  String jsonPayload;
  serializeJson(jsonDocument, jsonPayload);

  int httpResponseCode = http.POST(jsonPayload);

  Serial.printf("HTTP Response code: %d\n", httpResponseCode);
}