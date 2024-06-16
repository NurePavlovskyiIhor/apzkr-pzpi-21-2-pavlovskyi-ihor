using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using mobile_greenhouses.Models;
using Newtonsoft.Json;

namespace mobile_greenhouses.Services
{
    public class AuthService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiBaseUrl;
        private const string UserKey = "user_key";

        public AuthService()
        {
            _httpClient = new HttpClient();
            _apiBaseUrl = "http://though-forget.gl.at.ply.gg:9088"; 
        }

        public async Task<User> LoginAsync(LoginCredentials credentials)
        {
            var json = JsonConvert.SerializeObject(credentials);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"{_apiBaseUrl}/api/users/login", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var user = JsonConvert.DeserializeObject<User>(responseContent);
                SaveUser(user);
                return user;
            }
            else
            {
                return null;
            }
        }

        public async Task<User> RegisterAsync(HttpContent content)
        {
            var response = await _httpClient.PostAsync($"{_apiBaseUrl}/api/users", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var registeredUser = JsonConvert.DeserializeObject<User>(responseContent);
                return registeredUser;
            }
            else
            {
                return null;
            }
        }

        public async Task<bool> UpdateUserAsync(int userId, User userData)
        {
            var json = JsonConvert.SerializeObject(userData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"{_apiBaseUrl}/api/users/{userId}", content);

            return response.IsSuccessStatusCode;
        }

        public async Task LogoutAsync()
        {
            var response = await _httpClient.PostAsync($"{_apiBaseUrl}/api/users/logout", null);

            if (response.IsSuccessStatusCode)
            {
                RemoveUser();
            }
        }

        public void SaveUser(User user)
        {
            string userJson = JsonConvert.SerializeObject(user);
            Preferences.Set(UserKey, userJson);
        }

        public User GetUser()
        {
            string userJson = Preferences.Get(UserKey, null);
            if (!string.IsNullOrEmpty(userJson))
            {
                return JsonConvert.DeserializeObject<User>(userJson);
            }
            return null;
        }

        public void RemoveUser()
        {
            Preferences.Remove(UserKey);
        }
    }
}