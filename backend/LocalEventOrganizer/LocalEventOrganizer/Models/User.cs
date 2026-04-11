namespace LocalEventOrganizer.Models
{
    public class User
    {
        public Guid UserID { get; set; } = Guid.NewGuid();
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Attendee";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
