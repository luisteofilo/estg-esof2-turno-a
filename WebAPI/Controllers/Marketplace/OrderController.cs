using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using ESOF.WebApp.WebAPI.Services.Marketplace;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Controllers.Marketplace
{
    [Route("api/marketplace/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService = new(new ApplicationDbContext());

        [HttpGet]
        public ActionResult<List<ResponseOrderDto>> GetAllOrders() {
            return _orderService.GetAllOrders();
        }
        
        [HttpGet("{id:guid}")]
        public ActionResult<ResponseOrderDto> GetOrderById(Guid id) {
            return _orderService.GetOrderById(id);
        }
        
        [HttpPost("add")]
        public ActionResult<ResponseOrderDto> CreateOrder(CreateOrderDto order) {
            return _orderService.CreateOrder(order);
        }
        
        [HttpPost("update")]
        public ActionResult<ResponseOrderDto> UpdateOrder(Guid id, UpdateOrderDto order) {
            try {
                return _orderService.UpdateOrder(id, order);
            }
            catch (Exception e) {
                return NotFound();
            }
        }
        
        [HttpDelete("delete")]
        public IActionResult DeleteOrder(Guid id) {
            try {
                _orderService.DeleteOrder(id);
                return NoContent();
            }
            catch (Exception e) {
                return NotFound();
            }
        }
    }
}
