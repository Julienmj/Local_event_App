namespace LocalEventOrganizer.DTOs
{
    public class CreateReviewDto
    {
        public Guid UserID { get; set; }
        public int EventID { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
