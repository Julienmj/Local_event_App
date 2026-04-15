using LocalEventOrganizer.Data;
using LocalEventOrganizer.DTOs;
using LocalEventOrganizer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalEventOrganizer.Controllers
{
    [Route("api/v1/registrations")]
    [ApiController]
    [Authorize]
    public class RegistrationsController : ControllerBase
    {
        private readonly ApiContext _context;

        public RegistrationsController(ApiContext context)
        {
            _context = context;
        }

        // POST /api/v1/registrations
        [HttpPost]
        public async Task<IActionResult> Create(CreateRegistrationDto dto)
        {
            var allowedStatuses = new[] { "Confirmed", "Cancelled", "Waitlisted" };
            if (!allowedStatuses.Contains(dto.Status))
                return BadRequest("Invalid status. Allowed: Confirmed, Cancelled, Waitlisted");

            var userExists = await _context.Users.AnyAsync(u => u.UserID == dto.UserID);
            if (!userExists) return BadRequest("User not found.");

            var eventExists = await _context.Events.AnyAsync(e => e.EventID == dto.EventID);
            if (!eventExists) return BadRequest("Event not found.");

            var duplicate = await _context.Registrations
                .AnyAsync(r => r.UserID == dto.UserID && r.EventID == dto.EventID);
            if (duplicate) return Conflict("User is already registered for this event.");

            var registration = new Registration
            {
                UserID = dto.UserID,
                EventID = dto.EventID,
                Status = dto.Status
            };

            _context.Registrations.Add(registration);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetByUser), new { userId = registration.UserID }, registration);
        }

        // GET /api/v1/registrations/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(Guid userId)
        {
            var registrations = await _context.Registrations
                .Where(r => r.UserID == userId)
                .Include(r => r.Event)
                .Select(r => new
                {
                    r.RegistrationID, r.UserID, r.RegisteredAt, r.Status,
                    Event = new { r.Event!.EventID, r.Event.Title, r.Event.EventDate, r.Event.Status }
                })
                .ToListAsync();

            return Ok(registrations);
        }

        // GET /api/v1/registrations/event/{eventId}
        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetByEvent(int eventId)
        {
            var registrations = await _context.Registrations
                .Where(r => r.EventID == eventId)
                .Include(r => r.User)
                .Select(r => new
                {
                    r.RegistrationID, r.EventID, r.RegisteredAt, r.Status,
                    User = new { r.User!.UserID, r.User.FullName, r.User.Email }
                })
                .ToListAsync();

            return Ok(registrations);
        }

        // DELETE /api/v1/registrations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var registration = await _context.Registrations.FindAsync(id);
            if (registration == null) return NotFound();

            _context.Registrations.Remove(registration);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
