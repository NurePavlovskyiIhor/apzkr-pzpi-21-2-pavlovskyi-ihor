#include <HTTPClient.h>
#include <ArduinoJson.h>

int InitUserId(String user_email_arg, String user_password_arg, int controlSystemId_arg, String serverUrl)
{
  int localUserId = -1;
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    http.begin(serverUrl + "api/users/login");

    // Setup headers
    http.addHeader("Content-Type", "application/json");
    http.addHeader("ngrok-skip-browser-warning", "true");

    // Create JSON payload
    DynamicJsonDocument jsonDocument(1024);
    jsonDocument["email"] = user_email_arg;
    jsonDocument["password"] = user_password_arg;

    String jsonPayload;
    serializeJson(jsonDocument, jsonPayload);

    // Make the POST request
    int httpResponseCode = http.POST(jsonPayload);

    Serial.printf("HTTP Response code: %d\n", httpResponseCode);
    if (httpResponseCode >= 200 && httpResponseCode <= 400) 
    {
      // Parse JSON response
      DynamicJsonDocument jsonDocumentResponse(1024); // Adjust the size according to your response
      deserializeJson(jsonDocumentResponse, http.getString());

      //serializeJsonPretty(jsonDocumentResponse, Serial);

      // Extract user ID
      localUserId = jsonDocumentResponse["userId"].as<int>();

      // Save the user ID or perform further actions
      Serial.print("User ID: ");
      Serial.println(localUserId);

      http.begin(serverUrl + "api/greenhouses");
      httpResponseCode = http.GET();
      Serial.printf("HTTP Response code: %d\n", httpResponseCode);
      DynamicJsonDocument jsonDocumentResponseControl(1024); // Adjust the size according to your response
      deserializeJson(jsonDocumentResponseControl, http.getString());

      bool belongsToUser = false;

      // Ensure that the response is an array
      JsonArray usersArray = jsonDocumentResponseControl.as<JsonArray>();
      // Iterate through the array and check if userId matches any user
      for (const JsonVariant& userVariant : usersArray) {
          if (userVariant["user"]["userId"].as<int>() == localUserId) 
          {
              belongsToUser = true;
              break;
          }
      }

      // Close connection
      http.end();

      if(!belongsToUser)
      {
        Serial.print("Wrong credentials for this system \n");
      }
      else
      {
        Serial.print("Successful authentification \n");
      }
    }
    else 
    {
      Serial.printf("HTTP Request failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
    }  
  }
  return localUserId;
}