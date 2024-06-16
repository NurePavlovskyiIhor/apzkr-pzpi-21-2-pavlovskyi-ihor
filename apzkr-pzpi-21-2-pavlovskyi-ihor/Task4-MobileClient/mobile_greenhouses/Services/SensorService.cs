using mobile_greenhouses.Models;
using Newtonsoft.Json;

namespace mobile_greenhouses.Services
{
    public class SensorService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiBaseUrl;

        public SensorService()
        {
            _httpClient = new HttpClient();
            _apiBaseUrl = "http://though-forget.gl.at.ply.gg:9088";
        }

        public async Task<List<Sensor>> GetUserSensors(int userId)
        {
            var response = await _httpClient.GetAsync($"{_apiBaseUrl}/api/sensors/byUserId/{userId}");
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var history = JsonConvert.DeserializeObject<List<Sensor>>(responseContent);
                return history;
            }
            else
            {
                return null;
            }
        }
    }
}
