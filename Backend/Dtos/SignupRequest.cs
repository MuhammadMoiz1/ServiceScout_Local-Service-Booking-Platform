namespace Backend.Dtos
{
    public class SignupRequest
    {
        public string Name { get; set; }
        public string Area { get; set; }
        public string CnicNumber { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ContactInfo { get; set; }
        public List<int> ServiceIds { get; set; }
    }
}
