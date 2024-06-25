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

        public List<ResponseOrderReviewDto> GetAllReviews()
        {
            try
            {
                return _context.OrderReviews
                    .Include(or => or.MarketPlaceGame)
                    .Include(or => or.Reviewer)
                    .Select(review => new ResponseOrderReviewDto
                    {
                        review_id = review.review_id,
                        game_id = review.game_id,
                        reviewer_id = review.reviewer_id,
                        rating = review.rating,
                        review = review.review,
                        game = new ResponseMKP_GameDto
                        {
                            id = review.MarketPlaceGame.game_id,
                            name = review.MarketPlaceGame.name,
                            description = review.MarketPlaceGame.description,
                            release_date = review.MarketPlaceGame.release_date,
                            price = review.MarketPlaceGame.price,
                            stock = review.MarketPlaceGame.stock
                        }
                    }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving reviews.", ex);
            }
        }

        public ResponseOrderReviewDto GetReviewById(Guid review_id)
        {
            var review = _context.OrderReviews
                .Include(or => or.MarketPlaceGame)
                .Include(or => or.Reviewer)
                .FirstOrDefault(or => or.review_id == review_id);

            if (review == null)
            {
                throw new ArgumentException("Review not found.");
            }

            return new ResponseOrderReviewDto
            {
                review_id = review.review_id,
                game_id = review.game_id,
                reviewer_id = review.reviewer_id,
                rating = review.rating,
                review = review.review,
                game = new ResponseMKP_GameDto
                {
                    id = review.MarketPlaceGame.game_id,
                    name = review.MarketPlaceGame.name,
                    description = review.MarketPlaceGame.description,
                    release_date = review.MarketPlaceGame.release_date,
                    price = review.MarketPlaceGame.price,
                    stock = review.MarketPlaceGame.stock
                }
            };
        }

        public ResponseOrderReviewDto CreateReview(CreateOrderReviewDto createReviewDto, Guid game_id, Guid reviewer_id)
        {
            try
            {
                var game = _context.MarketPlaceGames.Find(game_id);
                if (game == null)
                {
                    throw new ArgumentException("Game not found.");
                }

                var reviewer = _context.Users.Find(reviewer_id);
                if (reviewer == null)
                {
                    throw new ArgumentException("Reviewer not found.");
                }

                var review = new OrderReview
                {
                    review_id = Guid.NewGuid(),
                    game_id = game_id,
                    reviewer_id = reviewer_id,
                    rating = createReviewDto.rating,
                    review = createReviewDto.review
                };

                _context.OrderReviews.Add(review);
                _context.SaveChanges();

                return new ResponseOrderReviewDto
                {
                    review_id = review.review_id,
                    game_id = review.game_id,
                    reviewer_id = review.reviewer_id,
                    rating = review.rating,
                    review = review.review,
                    game = new ResponseMKP_GameDto
                    {
                        id = game.game_id,
                        name = game.name,
                        description = game.description,
                        release_date = game.release_date,
                        price = game.price,
                        stock = game.stock
                    }
                };
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("An error occurred while creating the review.", ex);
            }
        }

        public ResponseOrderReviewDto UpdateReview(Guid review_id, UpdateOrderReviewDto updateReviewDtoDto)
        {
            var review = _context.OrderReviews
                .Include(or => or.MarketPlaceGame)
                .Include(or => or.Reviewer)
                .FirstOrDefault(or => or.review_id == review_id);

            if (review == null)
            {
                throw new ArgumentException("Review not found.");
            }

            review.rating = updateReviewDtoDto.rating ?? review.rating;
            review.review = updateReviewDtoDto.comment ?? review.review;

            _context.SaveChanges();

            return new ResponseOrderReviewDto
            {
                review_id = review.review_id,
                game_id = review.game_id,
                reviewer_id = review.reviewer_id,
                rating = review.rating,
                review = review.review,
                game = new ResponseMKP_GameDto
                {
                    id = review.MarketPlaceGame.game_id,
                    name = review.MarketPlaceGame.name,
                    description = review.MarketPlaceGame.description,
                    release_date = review.MarketPlaceGame.release_date,
                    price = review.MarketPlaceGame.price,
                    stock = review.MarketPlaceGame.stock
                }
            };
        }

        public void DeleteReview(Guid review_id)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var review = _context.OrderReviews
                        .FirstOrDefault(or => or.review_id == review_id);

                    if (review == null)
                    {
                        throw new ArgumentException("Review not found.");
                    }

                    _context.OrderReviews.Remove(review);
                    _context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }
            }
        }
    }
}
