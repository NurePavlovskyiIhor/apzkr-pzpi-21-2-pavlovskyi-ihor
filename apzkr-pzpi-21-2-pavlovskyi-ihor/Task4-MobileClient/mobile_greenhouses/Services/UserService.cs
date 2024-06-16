// Services/UserService.cs
using mobile_greenhouses.Models;
using Newtonsoft.Json;
using System.Text;

namespace mobile_greenhouses.Services
{
    public class UserService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiBaseUrl;

        public UserService()
        {
            _httpClient = new HttpClient();
            _apiBaseUrl = "http://though-forget.gl.at.ply.gg:9088"; 
        }

        public async Task<List<User>> GetAllUsers()
        {
            var response = await _httpClient.GetAsync($"{_apiBaseUrl}/api/users");
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var users = JsonConvert.DeserializeObject<List<User>>(responseContent);
                return users;
            }
            else
            {
                return null;
            }
        }

        public async Task<bool> DeleteUser(int userId)
        {
            var response = await _httpClient.DeleteAsync($"{_apiBaseUrl}/api/users/{userId}");

            return response.IsSuccessStatusCode;
        }

        public async Task<bool> UpdateUser(int userId, User userData)
        {
            var json = JsonConvert.SerializeObject(userData);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"{_apiBaseUrl}/api/users/{userId}", content);

            if (response.IsSuccessStatusCode)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<User> CreateUser(User userData, string password)
        {

            var userWithPassword = new
            {
                password = password,
                email = userData.Email,
                userName = userData.UserName
            };

            var json = JsonConvert.SerializeObject(userWithPassword);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"{_apiBaseUrl}/api/users", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var createdUser = JsonConvert.DeserializeObject<User>(responseContent);
                return createdUser;
            }
            else
            {
                return null;
            }
        }
    }
}