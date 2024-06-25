using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using ESOF.WebApp.WebAPI.Services.Marketplace;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers.Marketplace {
    [Route("api/marketplace/[controller]")]
    [ApiController]
    public class OrderItemController : ControllerBase {
        private readonly OrderItemService _orderItemService = new(new ApplicationDbContext());

        [HttpGet]
        public ActionResult<List<ResponseOrderItemDto>> GetAllOrderItems() {
            return _orderItemService.GetAllOrderItems();
        }
        
        [HttpGet("{orderId:guid}")]
        public ActionResult<ResponseOrderItemDto> GetOrderItemById(Guid orderId, Guid gameId) {
            return _orderItemService.GetOrderItemById(orderId, gameId);
        }
        
        [HttpPost("add")]
        public ActionResult<ResponseOrderItemDto> CreateOrderItem(CreateOrderItemDto orderItem, Guid orderId, Guid gameId) {
            return _orderItemService.CreateOrderItem(orderItem, orderId, gameId);
        }
        
        [HttpPost("update")]
        public ActionResult<ResponseOrderItemDto> UpdateOrderItem(Guid orderId, Guid gameId, UpdateOrderItemDto orderItem) {
            try {
                return _orderItemService.UpdateOrderItem(orderId, gameId, orderItem);
            }
            catch (Exception e) {
                return NotFound();
            }
        }
        
        [HttpDelete("delete")]
        public IActionResult DeleteOrderItem(Guid orderId, Guid gameId) {
            try {
                _orderItemService.DeleteOrderItem(orderId, gameId);
                return NoContent();
            }
            catch (Exception e) {
                return NotFound();
            }
        }
    }
}