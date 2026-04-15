using LocalEventOrganizer.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalEventOrganizer.Controllers
{
    [Route("api/v1/notifications")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly ApiContext _context;

        public NotificationsController(ApiContext context)
        {
            _context = context;
        }

        // GET /api/v1/notifications/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(Guid userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserID == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    n.NotificationID, n.UserID, n.Title, n.Message, n.IsRead, n.CreatedAt
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // PUT /api/v1/notifications/{id}/read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return Ok(notification);
        }
    }
}
