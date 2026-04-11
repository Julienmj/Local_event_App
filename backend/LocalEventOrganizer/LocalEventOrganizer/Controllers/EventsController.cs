using LocalEventOrganizer.Data;
using LocalEventOrganizer.DTOs;
using LocalEventOrganizer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalEventOrganizer.Controllers
{
    [Route("api/v1/events")]
    [ApiController]
    [Authorize]
    public class EventsController : ControllerBase
    {
        private readonly ApiContext _context;

        public EventsController(ApiContext context)
        {
            _context = context;
        }

        // GET /api/v1/events
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var events = await _context.Events
                .Include(e => e.Organizer)
                .Include(e => e.Category)
                .Select(e => new
                {
                    e.EventID, e.Title, e.Description, e.EventDate,
                    e.MaxAttendees, e.Status, e.VenueID, e.CreatedAt,
                    Organizer = new { e.Organizer!.UserID, e.Organizer.FullName },
                    Category = new { e.Category!.CategoryID, e.Category.Name }
                })
                .ToListAsync();

            return Ok(events);
        }

        // GET /api/v1/events/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var e = await _context.Events
                .Include(e => e.Organizer)
                .Include(e => e.Category)
                .FirstOrDefaultAsync(e => e.EventID == id);

            if (e == null) return NotFound();

            return Ok(new
            {
                e.EventID, e.Title, e.Description, e.EventDate,
                e.MaxAttendees, e.Status, e.VenueID, e.CreatedAt,
                Organizer = new { e.Organizer!.UserID, e.Organizer.FullName },
                Category = new { e.Category!.CategoryID, e.Category.Name }
            });
        }

        // GET /api/v1/events/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var events = await _context.Events
                .Where(e => e.CategoryID == categoryId)
                .Include(e => e.Organizer)
                .Include(e => e.Category)
                .Select(e => new
                {
                    e.EventID, e.Title, e.EventDate, e.Status, e.MaxAttendees,
                    Organizer = new { e.Organizer!.UserID, e.Organizer.FullName },
                    Category = new { e.Category!.CategoryID, e.Category.Name }
                })
                .ToListAsync();

            return Ok(events);
        }

        // GET /api/v1/events/organizer/{userId}
        [HttpGet("organizer/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByOrganizer(Guid userId)
        {
            var events = await _context.Events
                .Where(e => e.OrganizerID == userId)
                .Include(e => e.Category)
                .Select(e => new
                {
                    e.EventID, e.Title, e.EventDate, e.Status, e.MaxAttendees,
                    Category = new { e.Category!.CategoryID, e.Category.Name }
                })
                .ToListAsync();

            return Ok(events);
        }

        // POST /api/v1/events  (Admin, Organizer)
        [HttpPost]
        [Authorize(Roles = "Admin,Organizer")]
        public async Task<IActionResult> Create(CreateEventDto dto)
        {
            var allowedStatuses = new[] { "Pending", "Active", "Cancelled", "Completed" };
            if (!allowedStatuses.Contains(dto.Status))
                return BadRequest("Invalid status. Allowed: Pending, Active, Cancelled, Completed");

            var organizerExists = await _context.Users.AnyAsync(u => u.UserID == dto.OrganizerID);
            if (!organizerExists) return BadRequest("Organizer not found.");

            var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryID == dto.CategoryID);
            if (!categoryExists) return BadRequest("Category not found.");

            var newEvent = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                EventDate = dto.EventDate,
                MaxAttendees = dto.MaxAttendees,
                Status = dto.Status,
                OrganizerID = dto.OrganizerID,
                CategoryID = dto.CategoryID,
                VenueID = dto.VenueID
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = newEvent.EventID }, newEvent);
        }

        // PUT /api/v1/events/{id}  (Admin, Organizer)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Organizer")]
        public async Task<IActionResult> Update(int id, UpdateEventDto dto)
        {
            var e = await _context.Events.FindAsync(id);
            if (e == null) return NotFound();

            var allowedStatuses = new[] { "Pending", "Active", "Cancelled", "Completed" };
            if (!string.IsNullOrEmpty(dto.Status) && !allowedStatuses.Contains(dto.Status))
                return BadRequest("Invalid status. Allowed: Pending, Active, Cancelled, Completed");

            e.Title = dto.Title ?? e.Title;
            e.Description = dto.Description ?? e.Description;
            e.EventDate = dto.EventDate ?? e.EventDate;
            e.MaxAttendees = dto.MaxAttendees ?? e.MaxAttendees;
            e.Status = dto.Status ?? e.Status;
            e.CategoryID = dto.CategoryID ?? e.CategoryID;
            e.VenueID = dto.VenueID ?? e.VenueID;

            await _context.SaveChangesAsync();
            return Ok(e);
        }

        // DELETE /api/v1/events/{id}  (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var e = await _context.Events.FindAsync(id);
            if (e == null) return NotFound();

            _context.Events.Remove(e);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
