using mobile_greenhouses.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace mobile_greenhouses.Services
{
    public class NotificationService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiBaseUrl;

        public NotificationService()
        {
            _httpClient = new HttpClient();
            _apiBaseUrl = "http://though-forget.gl.at.ply.gg:9088";
        }

        public async Task<List<Notification>> GetUserNotifications(int userId)
        {
            var response = await _httpClient.GetAsync($"{_apiBaseUrl}/api/notifications/byUserId/{userId}");
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var history = JsonConvert.DeserializeObject<List<Notification>>(responseContent);
                return history;
            }
            else
            {
                return null;
            }
        }
    }
}
