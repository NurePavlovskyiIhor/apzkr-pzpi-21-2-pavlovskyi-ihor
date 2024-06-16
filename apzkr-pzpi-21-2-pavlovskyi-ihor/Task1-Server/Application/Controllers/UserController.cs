using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Application.Models;
using Application.Repositories;
using Application.ViewModels;
using Microsoft.EntityFrameworkCore;
using Application.DBContext;

namespace Application.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly AppDbContext _dbContext;

        public UserController(IUserRepository userService, DBContext.AppDbContext dbContext)
        {
            _userRepository = userService;
            _dbContext = dbContext;
        }


        [HttpGet]
        public IActionResult GetUsers()
        {
            try
            {
                var users = _userRepository.GetUsers().ToList();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("{userId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public IActionResult GetUserById(int userId)
        {
            var user = _userRepository.GetUserById(userId);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }


        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        public IActionResult CreateUser([FromBody] UserView userView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = _userRepository.GetUserByEmail(userView.Email);

            if (existingUser != null)
            {
                ModelState.AddModelError("Email", "Цей електронний лист вже використовується.");
                return BadRequest(ModelState);
            }

            var user = new User
            {
                UserName = userView.UserName,
                Email = userView.Email,
                Password = userView.Password
            };

            _userRepository.CreateUser(user);

            return CreatedAtAction(nameof(GetUserById), new { userId = user.UserId }, user);
        }


        [HttpPut("{userId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateUser([FromRoute] int userId, [FromBody] UserView viewUser)
        {
            try
            {
                var existingUser = _userRepository.GetUserById(userId);

                if (existingUser == null)
                {
                    return NotFound();
                }

                existingUser.UserName = viewUser.UserName;
                existingUser.Email = viewUser.Email;
                existingUser.Password = viewUser.Password;

                _userRepository.UpdateUser(existingUser);

                return Ok(existingUser);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpDelete("{userId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public IActionResult DeleteUser(int userId)
        {
            var existingUser = _userRepository.GetUserById(userId);
            if (existingUser == null)
            {
                return NotFound();
            }

            _userRepository.DeleteUser(userId);
            return NoContent();
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginView model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await FindUserByEmailAsync(model.Email);

            if (user == null)
            {
                return BadRequest("Невірна електронна пошта або пароль");
            }

            var passwordVerificationResult = VerifyPassword(user, model.Password);

            if (passwordVerificationResult == PasswordVerificationResult.Success)
            {
                return Ok(user);
            }

            return BadRequest("Невірна електронна пошта або пароль");
        }


        [NonAction]
        private async Task<User> FindUserByEmailAsync(string email)
        {
            var user = await _dbContext.User.FirstOrDefaultAsync(u => u.Email == email);
            return user;
        }


        [NonAction]
        public PasswordVerificationResult VerifyPassword(User user, string providedPassword)
        {
            try
            {
                if (user != null)
                {
                    bool passwordMatches = false;

                    if (user.Password.StartsWith("$2a$"))
                    {
                        passwordMatches = BCrypt.Net.BCrypt.Verify(providedPassword, user.Password);
                    }
                    else
                    {
                        passwordMatches = providedPassword == user.Password;
                    }

                    if (passwordMatches)
                    {
                        string newHashedPassword = BCrypt.Net.BCrypt.HashPassword(providedPassword);
                        user.Password = newHashedPassword;
                    }

                    return passwordMatches ? PasswordVerificationResult.Success : PasswordVerificationResult.Failed;
                }

                return PasswordVerificationResult.Failed;
            }
            catch (Exception ex)
            {
                return PasswordVerificationResult.Failed;
            }
        }

        public enum PasswordVerificationResult
        {
            Success,
            Failed
        }


        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            HttpContext.SignOutAsync();
            return Ok("Вихід успішний");
        }
    }
}