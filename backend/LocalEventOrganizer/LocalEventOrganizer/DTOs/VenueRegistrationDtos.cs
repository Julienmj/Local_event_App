namespace LocalEventOrganizer.DTOs
{
    public class VenueDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }
        public int? Capacity { get; set; }
    }

    public class CreateRegistrationDto
    {
        public Guid UserID { get; set; }
        public int EventID { get; set; }
        public string Status { get; set; } = "Confirmed";
    }
}
