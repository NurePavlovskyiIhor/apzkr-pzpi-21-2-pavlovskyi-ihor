﻿// Models/LoginCredentials.cs
namespace mobile_greenhouses.Models
{
    public class LoginCredentials
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }
}