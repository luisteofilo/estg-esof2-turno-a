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
    [Route("marketplace/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;
        private readonly OrderReviewService _orderReviewService;
        private readonly OrderItemService _orderItemService;


        public OrderController() {
            var ctx = new ApplicationDbContext();
            
            _orderService = new OrderService(ctx);
            _orderReviewService = new OrderReviewService(ctx);
            _orderItemService = new OrderItemService(ctx);
        }

        [HttpGet]
        public ActionResult<List<ResponseOrderDto>> GetAllOrders() {
            return _orderService.GetAllOrders();
        }
        
        [HttpGet("{id:guid}")]
        public ActionResult<ResponseOrderDto> GetOrderById(Guid id) {
            return _orderService.GetOrderById(id);
        }
        
        [HttpPost]
        public ActionResult<ResponseOrderDto> CreateOrder(CreateOrderDto order) {
            return _orderService.CreateOrder(order);
        }
        
        [HttpPatch]
        public ActionResult<ResponseOrderDto> UpdateOrder(Guid id, UpdateOrderDto order) {
            try {
                return _orderService.UpdateOrder(id, order);
            }
            catch (Exception e) {
                return NotFound();
            }
        }
        
        [HttpDelete]
        public IActionResult DeleteOrder(Guid id) {
            try {
                _orderService.DeleteOrder(id);
                return NoContent();
            }
            catch (Exception e) {
                return NotFound();
            }
        }
        
        /*
         * Reviews
         */
        
        [HttpGet("{orderId:guid}/reviews")]
        public ActionResult<List<ResponseOrderReviewDto>> GetOrderReviews(Guid orderId) {
            return _orderReviewService.GetOrderReviews(orderId);
        }
        
        [HttpGet("{orderId:guid}/reviews/{reviewerId:guid}")]
        public ActionResult<ResponseOrderReviewDto> GetReviewById(Guid orderId, Guid reviewerId) {
            return _orderReviewService.GetReviewById(orderId, reviewerId);
        }
        
        [HttpPost("{orderId:guid}/reviews")]
        public ActionResult<ResponseOrderReviewDto> CreateReview(CreateOrderReviewDto orderReview, Guid orderId, Guid reviewerId) {
            return _orderReviewService.CreateReview(orderReview, orderId, reviewerId);
        }
        
        [HttpPatch("{orderId:guid}/reviews")]
        public ActionResult<ResponseOrderReviewDto> UpdateOrderReview(Guid orderId, Guid reviewerId, UpdateOrderReviewDto orderReview) {
            try {
                return _orderReviewService.UpdateReview(orderId, reviewerId, orderReview);
            }
            catch (Exception e) {
                return NotFound();
            }
        }
        
        [HttpDelete("{orderId:guid}/reviews")]
        public IActionResult DeleteReview(Guid orderId, Guid reviewerId) {
            try {
                _orderReviewService.DeleteReview(orderId, reviewerId);
                return NoContent();
            }
            catch (Exception e) {
                return NotFound();
            }
        }
        
        /*
         * Items
         */
        
        [HttpGet("{orderId:guid}/items")]
        public ActionResult<List<ResponseOrderItemDto>> GetAllOrderItems(Guid orderId) {
            return _orderItemService.GetOrderItems(orderId);
        }
        
        [HttpGet("{orderId:guid}/items/{gameId:guid}")]
        public ActionResult<ResponseOrderItemDto> GetOrderItemById(Guid orderId, Guid gameId) {
            return _orderItemService.GetOrderItemById(orderId, gameId);
        }
        
        [HttpPost("{orderId:guid}/items")]
        public ActionResult<ResponseOrderItemDto> CreateOrderItem(CreateOrderItemDto orderItem, Guid orderId, Guid gameId) {
            return _orderItemService.CreateOrderItem(orderItem, orderId, gameId);
        }
        
        [HttpPatch("{orderId:guid}/items")]
        public ActionResult<ResponseOrderItemDto> UpdateOrderItem(Guid orderId, Guid gameId, UpdateOrderItemDto orderItem) {
            try {
                return _orderItemService.UpdateOrderItem(orderId, gameId, orderItem);
            }
            catch (Exception e) {
                return NotFound();
            }
        }
        
        [HttpDelete("{orderId:guid}/items")]
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
