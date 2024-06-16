#include "WiFi.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <RTClib.h>
#include "InitUserGreenhouse.h"
#include "Greenhouse.h"

#define NTP_SERVER     "pool.ntp.org"
#define UTC_OFFSET     3600
#define UTC_OFFSET_DST 0

const String ssid = "Wokwi-GUEST";
const String password = "";
const String serverUrl = "http://0.tcp.eu.ngrok.io:15573/";

int userId = -1;

String user_email = "user3@example.com";
String user_password = "stringA";

int controlSystemId = 2;

const int DHTPin = 4;
const int switchPin = 17;

Greenhouse greenhouse;
DHT dht(DHTPin, DHT22);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  userId = InitUserId(user_email, user_password, controlSystemId, serverUrl);

  configTime(UTC_OFFSET, UTC_OFFSET_DST, NTP_SERVER);
  tm timeInfo;
  getLocalTime(&timeInfo);
  char formattedTime[20];
  strftime(formattedTime, sizeof(formattedTime), "%Y-%m-%d %H:%M:%S", &timeInfo);
  Serial.println("Local time: " + String(formattedTime)); 

  greenhouse = Greenhouse(controlSystemId, serverUrl);
}

void loop() 
{
  static tm timeInfo;
  getLocalTime(&timeInfo);
  
  if(digitalRead(switchPin) == 0)
  {
    for(auto& sensor : greenhouse.sensors)
    {
      float currentReadings;
      float acceptableDeviation;

      switch(sensor.sensorType)
      {
      case 0:
      currentReadings = dht.readTemperature();
      acceptableDeviation = 1.0;
      break;

      case 1:
      currentReadings = dht.readHumidity();
      acceptableDeviation = 0.75;
      break;
      }

      sensor.CheckStateAndReportIfNeeded(currentReadings, acceptableDeviation, controlSystemId, timeInfo, serverUrl);
    }
  }
  else
  {
    Serial.println("controller is disabled"); 
  }

  delay(5000);
}