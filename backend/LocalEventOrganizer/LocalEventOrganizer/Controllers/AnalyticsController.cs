using LocalEventOrganizer.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalEventOrganizer.Controllers
{
    [Route("api/v1/analytics")]
    [ApiController]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly ApiContext _context;

        public AnalyticsController(ApiContext context)
        {
            _context = context;
        }

        // GET /api/v1/analytics/organizer/{userId}
        [HttpGet("organizer/{userId}")]
        public async Task<IActionResult> GetOrganizerAnalytics(Guid userId)
        {
            var events = await _context.Events
                .Where(e => e.OrganizerID == userId)
                .ToListAsync();

            if (!events.Any()) return NotFound("No events found for this organizer.");

            var eventIds = events.Select(e => e.EventID).ToList();

            var registrations = await _context.Registrations
                .Where(r => eventIds.Contains(r.EventID))
                .ToListAsync();

            var stats = events.Select(e =>
            {
                var eventRegs = registrations.Where(r => r.EventID == e.EventID).ToList();
                var confirmed = eventRegs.Count(r => r.Status == "Confirmed");
                var cancelled = eventRegs.Count(r => r.Status == "Cancelled");
                var capacity = e.MaxAttendees ?? 0;
                var fillRate = capacity > 0 ? Math.Round((double)confirmed / capacity * 100, 1) : 0;
                var noShowEstimate = Math.Round(confirmed * 0.1, 1);

                return new
                {
                    e.EventID,
                    e.Title,
                    e.EventDate,
                    e.Status,
                    Capacity = capacity,
                    TicketsSold = confirmed,
                    Cancelled = cancelled,
                    FillRate = $"{fillRate}%",
                    NoShowEstimate = noShowEstimate
                };
            });

            return Ok(new
            {
                OrganizerID = userId,
                TotalEvents = events.Count,
                TotalTicketsSold = registrations.Count(r => r.Status == "Confirmed"),
                Events = stats
            });
        }
    }
}
