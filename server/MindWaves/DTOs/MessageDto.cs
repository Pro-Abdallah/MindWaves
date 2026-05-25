using System.ComponentModel.DataAnnotations;

namespace MindWaves.DTOs
{
    public class MessageDto
    {
        [Required]
        public string Content { get; set; } = string.Empty;
    }
}
