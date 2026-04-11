using LocalEventOrganizer.Data;
using LocalEventOrganizer.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalEventOrganizer.Controllers
{
    [Route("api/v1/users")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApiContext _context;

        public UsersController(ApiContext context)
        {
            _context = context;
        }

        // GET /api/v1/users  (Admin only)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users
                .Select(u => new { u.UserID, u.FullName, u.Email, u.Role, u.CreatedAt })
                .ToListAsync();
            return Ok(users);
        }

        // GET /api/v1/users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(new { user.UserID, user.FullName, user.Email, user.Role, user.CreatedAt });
        }

        // PUT /api/v1/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            var allowedRoles = new[] { "Attendee", "Organizer", "Admin" };
            if (!string.IsNullOrEmpty(dto.Role) && !allowedRoles.Contains(dto.Role))
                return BadRequest("Invalid role. Allowed: Attendee, Organizer, Admin");

            user.FullName = string.IsNullOrEmpty(dto.FullName) ? user.FullName : dto.FullName;
            user.Email = string.IsNullOrEmpty(dto.Email) ? user.Email : dto.Email;
            user.Role = string.IsNullOrEmpty(dto.Role) ? user.Role : dto.Role;

            await _context.SaveChangesAsync();
            return Ok(new { user.UserID, user.FullName, user.Email, user.Role });
        }

        // DELETE /api/v1/users/{id}  (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
