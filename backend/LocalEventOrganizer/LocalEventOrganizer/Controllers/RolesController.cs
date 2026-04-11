using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LocalEventOrganizer.Controllers
{
    [Route("api/v1/roles")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class RolesController : ControllerBase
    {
        private static readonly List<string> AllowedRoles = new() { "Attendee", "Organizer", "Admin" };

        // GET /api/v1/roles
        [HttpGet]
        public IActionResult GetRoles()
        {
            return Ok(AllowedRoles);
        }

        // POST /api/v1/roles  - validate a role value
        [HttpPost]
        public IActionResult ValidateRole([FromBody] string role)
        {
            if (!AllowedRoles.Contains(role))
                return BadRequest($"'{role}' is not a valid role. Allowed: {string.Join(", ", AllowedRoles)}");

            return Ok(new { message = $"'{role}' is a valid role." });
        }
    }
}
