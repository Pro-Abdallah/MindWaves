using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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



    }
}
