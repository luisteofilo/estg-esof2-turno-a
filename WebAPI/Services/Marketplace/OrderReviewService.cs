using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Services.Marketplace
{
    public class OrderReviewService
    {
        private readonly ApplicationDbContext _context;

        public OrderReviewService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ResponseOrderReviewDto> GetOrderReviews(Guid orderId)
        {
            try
            {
                return _context.OrderReviews
                    .Include(or => or.Reviewer)
                    .Where(o => o.order_id == orderId)
                    .Select(review => new ResponseOrderReviewDto
                    {
                        order_id = review.order_id,
                        reviewer_id = review.reviewer_id,
                        rating = review.rating,
                        review = review.review
                    }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving reviews.", ex);
            }
        }

        public ResponseOrderReviewDto GetReviewById(Guid orderId, Guid reviewerId)
        {
            var review = _context.OrderReviews
                .Include(or => or.Reviewer)
                .FirstOrDefault(or => or.order_id == orderId && or.reviewer_id == reviewerId);

            if (review == null)
            {
                throw new ArgumentException("Review not found.");
            }

            return new ResponseOrderReviewDto
            {
                order_id = review.order_id,
                reviewer_id = review.reviewer_id,
                rating = review.rating,
                review = review.review
            };
        }

        public ResponseOrderReviewDto CreateReview(CreateOrderReviewDto createReviewDto, Guid orderId, Guid reviewerId)
        {
            try
            {
                var order = _context.Orders.Find(orderId);
                if (order == null)
                {
                    throw new ArgumentException("Order not found.");
                }

                var reviewer = _context.Users.Find(reviewerId);
                if (reviewer == null)
                {
                    throw new ArgumentException("Reviewer not found.");
                }

                var review = new OrderReview
                {
                    order_id = orderId,
                    reviewer_id = reviewerId,
                    rating = createReviewDto.rating,
                    review = createReviewDto.review
                };

                _context.OrderReviews.Add(review);
                _context.SaveChanges();

                return new ResponseOrderReviewDto
                {
                    order_id = orderId,
                    reviewer_id = review.reviewer_id,
                    rating = review.rating,
                    review = review.review
                };
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("An error occurred while creating the review.", ex);
            }
        }

        public ResponseOrderReviewDto UpdateReview(Guid orderId, Guid reviewerId, UpdateOrderReviewDto updateReviewDtoDto)
        {
            var review = _context.OrderReviews
                .Include(or => or.Reviewer)
                .FirstOrDefault(or => or.order_id == orderId && or.reviewer_id == reviewerId);

            if (review == null)
            {
                throw new ArgumentException("Review not found.");
            }

            review.rating = updateReviewDtoDto.rating ?? review.rating;
            review.review = updateReviewDtoDto.comment ?? review.review;

            _context.SaveChanges();

            return new ResponseOrderReviewDto
            {
                order_id = orderId,
                reviewer_id = review.reviewer_id,
                rating = review.rating,
                review = review.review
            };
        }

        public void DeleteReview(Guid orderId, Guid reviewerId)
        {
            var review = _context.OrderReviews
                .FirstOrDefault(or => or.order_id == orderId && or.reviewer_id == reviewerId);

            if (review == null)
            {
                throw new ArgumentException("Review not found.");
            }

            _context.OrderReviews.Remove(review);
            _context.SaveChanges();
        }
    }
}
