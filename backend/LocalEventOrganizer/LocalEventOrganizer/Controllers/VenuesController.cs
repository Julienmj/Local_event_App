using LocalEventOrganizer.Data;
using LocalEventOrganizer.DTOs;
using LocalEventOrganizer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocalEventOrganizer.Controllers
{
    [Route("api/v1/venues")]
    [ApiController]
    [Authorize]
    public class VenuesController : ControllerBase
    {
        private readonly ApiContext _context;

        public VenuesController(ApiContext context)
        {
            _context = context;
        }

        // GET /api/v1/venues
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var venues = await _context.Venues.ToListAsync();
            return Ok(venues);
        }

        // POST /api/v1/venues  (Admin, Organizer)
        [HttpPost]
        [Authorize(Roles = "Admin,Organizer")]
        public async Task<IActionResult> Create(VenueDto dto)
        {
            var venue = new Venue
            {
                Name = dto.Name,
                Address = dto.Address,
                City = dto.City,
                Capacity = dto.Capacity,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude
            };

            _context.Venues.Add(venue);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = venue.VenueID }, venue);
        }

        // PUT /api/v1/venues/{id}  (Admin, Organizer)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Organizer")]
        public async Task<IActionResult> Update(int id, VenueDto dto)
        {
            var venue = await _context.Venues.FindAsync(id);
            if (venue == null) return NotFound();

            venue.Name = dto.Name;
            venue.Address = dto.Address;
            venue.City = dto.City;
            venue.Capacity = dto.Capacity;
            venue.Latitude = dto.Latitude;
            venue.Longitude = dto.Longitude;

            await _context.SaveChangesAsync();
            return Ok(venue);
        }

        // DELETE /api/v1/venues/{id}  (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var venue = await _context.Venues.FindAsync(id);
            if (venue == null) return NotFound();

            _context.Venues.Remove(venue);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
