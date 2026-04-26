namespace LocalEventOrganizer.Models
{
    public class Venue
    {
        public int VenueID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }
        public int? Capacity { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }
}
