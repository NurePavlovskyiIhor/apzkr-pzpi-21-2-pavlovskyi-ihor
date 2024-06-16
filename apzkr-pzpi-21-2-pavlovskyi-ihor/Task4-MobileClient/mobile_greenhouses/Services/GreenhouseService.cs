using mobile_greenhouses.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace mobile_greenhouses.Services
{
    public class GreenhouseService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiBaseUrl;

        public GreenhouseService()
        {
            _httpClient = new HttpClient();
            _apiBaseUrl = "http://though-forget.gl.at.ply.gg:9088";
        }

        public async Task<List<Greenhouse>> GetUserGreenhouses(int userId)
        {
            var response = await _httpClient.GetAsync($"{_apiBaseUrl}/api/greenhouses/byUserId/{userId}");
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var history = JsonConvert.DeserializeObject<List<Greenhouse>>(responseContent);
                return history;
            }
            else
            {
                return null;
            }
        }
    }
}
