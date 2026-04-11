namespace LocalEventOrganizer.Models
{
    public class Event
    {
        public int EventID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime EventDate { get; set; }
        public int? MaxAttendees { get; set; }
        public string Status { get; set; } = "Pending";

        public Guid OrganizerID { get; set; }
        public int CategoryID { get; set; }
        public int VenueID { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User? Organizer { get; set; }
        public Category? Category { get; set; }
    }
}
