using LocalEventOrganizer.Data;
using LocalEventOrganizer.DTOs;
using LocalEventOrganizer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalEventOrganizer.Controllers
{
    [Route("api/v1/reviews")]
    [ApiController]
    [Authorize]
    public class ReviewsController : ControllerBase
    {
        private readonly ApiContext _context;

        public ReviewsController(ApiContext context)
        {
            _context = context;
        }

        // POST /api/v1/reviews
        [HttpPost]
        public async Task<IActionResult> Create(CreateReviewDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest("Rating must be between 1 and 5.");

            var userExists = await _context.Users.AnyAsync(u => u.UserID == dto.UserID);
            if (!userExists) return BadRequest("User not found.");

            var eventExists = await _context.Events.AnyAsync(e => e.EventID == dto.EventID);
            if (!eventExists) return BadRequest("Event not found.");

            var review = new Review
            {
                UserID = dto.UserID,
                EventID = dto.EventID,
                Rating = dto.Rating,
                Comment = dto.Comment
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetByEvent), new { eventId = review.EventID }, review);
        }

        // GET /api/v1/reviews/event/{eventId}
        [HttpGet("event/{eventId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByEvent(int eventId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.EventID == eventId)
                .Include(r => r.User)
                .Select(r => new
                {
                    r.ReviewID, r.EventID, r.Rating, r.Comment, r.CreatedAt,
                    User = new { r.User!.UserID, r.User.FullName }
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // DELETE /api/v1/reviews/{id}  (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
