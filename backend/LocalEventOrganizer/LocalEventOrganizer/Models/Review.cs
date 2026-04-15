namespace LocalEventOrganizer.Models
{
    public class Review
    {
        public int ReviewID { get; set; }
        public Guid UserID { get; set; }
        public int EventID { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public Event? Event { get; set; }
    }
}
