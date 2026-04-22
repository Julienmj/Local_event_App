namespace LocalEventOrganizer.DTOs
{
    public class CategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreateEventDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime EventDate { get; set; }
        public int? MaxAttendees { get; set; }
        public string Status { get; set; } = "Pending";
        public Guid OrganizerID { get; set; }
        public int CategoryID { get; set; }
        public int VenueID { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class UpdateEventDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? EventDate { get; set; }
        public int? MaxAttendees { get; set; }
        public string? Status { get; set; }
        public int? CategoryID { get; set; }
        public int? VenueID { get; set; }
        public string? ImageUrl { get; set; }
    }
}
