using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using ESOF.WebApp.WebAPI.Services.Marketplace;
using Microsoft.AspNetCore.Mvc;

namespace ESOF.WebApp.WebAPI.Controllers.Marketplace {
    [Route("api/marketplace/[controller]")]
    [ApiController]
    public class OrderReviewController : ControllerBase{
        private readonly OrderReviewService _orderReviewService = new(new ApplicationDbContext());

        [HttpGet]
        public ActionResult<List<ResponseOrderReviewDto>> GetAllReviews() {
            return _orderReviewService.GetAllReviews();
        }
        
        [HttpGet("{id:guid}")]
        public ActionResult<ResponseOrderReviewDto> GetReviewById(Guid orderId, Guid reviewerId) {
            return _orderReviewService.GetReviewById(orderId, reviewerId);
        }
        
        [HttpPost("add")]
        public ActionResult<ResponseOrderReviewDto> CreateReview(CreateOrderReviewDto orderReview, Guid orderId, Guid reviewerId) {
            return _orderReviewService.CreateReview(orderReview, orderId, reviewerId);
        }
        
        [HttpPost("update")]
        public ActionResult<ResponseOrderReviewDto> UpdateOrderReview(Guid orderId, Guid reviewerId, UpdateOrderReviewDto orderReview) {
            try {
                return _orderReviewService.UpdateReview(orderId, reviewerId, orderReview);
            }
            catch (Exception e) {
                return NotFound();
            }
        }
        
        [HttpDelete("delete")]
        public IActionResult DeleteReview(Guid orderId, Guid reviewerId) {
            try {
                _orderReviewService.DeleteReview(orderId, reviewerId);
                return NoContent();
            }
            catch (Exception e) {
                return NotFound();
            }
        }
    }
}