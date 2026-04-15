namespace LocalEventOrganizer.Models
{
    public class Registration
    {
        public int RegistrationID { get; set; }
        public Guid UserID { get; set; }
        public int EventID { get; set; }
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Confirmed";

        public User? User { get; set; }
        public Event? Event { get; set; }
    }
}
