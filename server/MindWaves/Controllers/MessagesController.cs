using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MindWaves.Data;

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
    }
}
