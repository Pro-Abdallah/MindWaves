using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindWaves.Data;
using MindWaves.Data.Models;
using MindWaves.DTOs;

namespace MindWaves.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        public MindWavesDbContext _context;

        public MessagesController(MindWavesDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllMessages()
        {
            var messages = await _context.Messages.ToListAsync();

            if (messages.Count <= 0)
                return NotFound("There aren't any Messages Right Now");

            return Ok(messages);
        }


        [HttpPost]
        public async Task<IActionResult> CreateMessage(MessageDto dto)
        {
            var message = new Message
            {
                Content = dto.Content,
                CreatedAt = DateTime.Now
            };

            _context.Add(message);
            await _context.SaveChangesAsync();

            return Ok("Message Created Successfully");
        }
    }
}
