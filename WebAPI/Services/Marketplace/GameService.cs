using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ESOF.WebApp.WebAPI.Services.Marketplace
{
    public class GameService
    {
        private readonly ApplicationDbContext _context;

        public GameService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ResponseMKP_GameDto> GetAllGames()
        {
            try
            {
                return _context.MarketPlaceGames
                    .Include(g => g.gameGenres)
                        .ThenInclude(gg => gg.genre)
                    .Include(g => g.gamePlatforms)
                        .ThenInclude(gp => gp.platform)
                    .Include(g => g.gameReviews)
                    .Include(g => g.orderItems)
                    .Select(game => new ResponseMKP_GameDto
                    {
                        id = game.game_id,
                        name = game.name,
                        description = game.description,
                        release_date = game.release_date,
                        price = game.price,
                        stock = game.stock,
                        genre_ids = game.gameGenres.Select(gg => gg.genre_id).ToList(),
                        platform_ids = game.gamePlatforms.Select(gp => gp.platform_id).ToList(),
                        review_ids = game.gameReviews.Select(gr => gr.review_id).ToList(),
                        order_ids = game.orderItems.Select(oi => oi.order_id).ToList(),
                        genres = game.gameGenres.Select(gg => new ResponseGenreDto
                        {
                            id = gg.genre_id,
                            name = gg.genre.name
                        }).ToList(),
                        platforms = game.gamePlatforms.Select(gp => new ResponsePlatformDto
                        {
                            id = gp.platform_id,
                            name = gp.platform.name,
                            debut_year = gp.platform.debut_year
                        }).ToList(),
                        reviews = game.gameReviews.Select(gr => new ResponseOrderReviewDto
                        {
                            review_id = gr.review_id,
                            rating = gr.rating,
                            review = gr.review,
                            reviewer_id = gr.reviewer_id
                        }).ToList(),
                        orders = game.orderItems.Select(oi => new ResponseOrderItemDto
                        {
                            order_id = oi.order_id,
                            game_id = oi.game_id,
                            amount = oi.amount
                        }).ToList()
                    }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving games.", ex);
            }
        }

        public ResponseMKP_GameDto GetGameById(Guid id)
        {
            var game = _context.MarketPlaceGames
                .Include(g => g.gameGenres)
                    .ThenInclude(gg => gg.genre)
                .Include(g => g.gamePlatforms)
                    .ThenInclude(gp => gp.platform)
                .Include(g => g.gameReviews)
                .Include(g => g.orderItems)
                .FirstOrDefault(g => g.game_id == id);

            if (game == null)
            {
                throw new ArgumentException("Game not found.");
            }

            return new ResponseMKP_GameDto
            {
                id = game.game_id,
                name = game.name,
                description = game.description,
                release_date = game.release_date,
                price = game.price,
                stock = game.stock,
                genre_ids = game.gameGenres.Select(gg => gg.genre_id).ToList(),
                platform_ids = game.gamePlatforms.Select(gp => gp.platform_id).ToList(),
                review_ids = game.gameReviews.Select(gr => gr.review_id).ToList(),
                order_ids = game.orderItems.Select(oi => oi.order_id).ToList(),
                genres = game.gameGenres.Select(gg => new ResponseGenreDto
                {
                    id = gg.genre_id,
                    name = gg.genre.name
                }).ToList(),
                platforms = game.gamePlatforms.Select(gp => new ResponsePlatformDto
                {
                    id = gp.platform_id,
                    name = gp.platform.name,
                    debut_year = gp.platform.debut_year
                }).ToList(),
                reviews = game.gameReviews.Select(gr => new ResponseOrderReviewDto
                {
                    review_id = gr.review_id,
                    rating = gr.rating,
                    review = gr.review,
                    reviewer_id = gr.reviewer_id
                }).ToList(),
                orders = game.orderItems.Select(oi => new ResponseOrderItemDto
                {
                    order_id = oi.order_id,
                    game_id = oi.game_id,
                    amount = oi.amount
                }).ToList()
            };
        }

        public ResponseMKP_GameDto CreateGame(CreateMKP_GameDto createGameDto)
        {
            try
            {
                var game = new MarketPlace_Game
                {
                    name = createGameDto.name,
                    description = createGameDto.description,
                    release_date = createGameDto.release_date,
                    price = createGameDto.price,
                    stock = createGameDto.stock
                };

                if (createGameDto.genreIds != null && createGameDto.genreIds.Any())
                {
                    var genres = _context.GameGenres
                        .Where(g => createGameDto.genreIds.Contains(g.genre_id))
                        .ToList();
                    game.gameGenres = genres;
                }

                if (createGameDto.platformIds != null && createGameDto.platformIds.Any())
                {
                    var platforms = _context.GamePlatforms
                        .Where(p => createGameDto.platformIds.Contains(p.platform_id))
                        .ToList();
                    game.gamePlatforms = platforms;
                }

                if (createGameDto.reviewIds != null && createGameDto.reviewIds.Any())
                {
                    var reviews = _context.OrderReviews
                        .Where(r => createGameDto.reviewIds.Contains(r.review_id))
                        .ToList();
                    game.gameReviews = reviews;
                }

                if (createGameDto.orderItemIds != null && createGameDto.orderItemIds.Any())
                {
                    var orderItems = _context.OrderItems
                        .Where(oi => createGameDto.orderItemIds.Contains(oi.order_id))
                        .ToList();
                    game.orderItems = orderItems;
                }

                _context.MarketPlaceGames.Add(game);
                _context.SaveChanges();

                return new ResponseMKP_GameDto
                {
                    id = game.game_id,
                    name = game.name,
                    description = game.description,
                    release_date = game.release_date,
                    price = game.price,
                    stock = game.stock,
                    genre_ids = game.gameGenres.Select(gg => gg.genre_id).ToList(),
                    platform_ids = game.gamePlatforms.Select(gp => gp.platform_id).ToList(),
                    review_ids = game.gameReviews.Select(gr => gr.review_id).ToList(),
                    order_ids = game.orderItems.Select(oi => oi.order_id).ToList(),
                    genres = game.gameGenres.Select(gg => new ResponseGenreDto
                    {
                        id = gg.genre_id,
                        name = gg.genre.name
                    }).ToList(),
                    platforms = game.gamePlatforms.Select(gp => new ResponsePlatformDto
                    {
                        id = gp.platform_id,
                        name = gp.platform.name,
                        debut_year = gp.platform.debut_year
                    }).ToList(),
                    reviews = game.gameReviews.Select(gr => new ResponseOrderReviewDto
                    {
                        review_id = gr.review_id,
                        rating = gr.rating,
                        review = gr.review,
                        reviewer_id = gr.reviewer_id
                    }).ToList(),
                    orders = game.orderItems.Select(oi => new ResponseOrderItemDto
                    {
                        order_id = oi.order_id,
                        game_id = oi.game_id,
                        amount = oi.amount
                    }).ToList()
                };
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("An error occurred while creating the game.", ex);
            }
        }

        public ResponseMKP_GameDto UpdateGame(Guid id, UpdateMKP_GameDto updateGameDto)
        {
            var game = _context.MarketPlaceGames
                .Include(g => g.gameGenres)
                .Include(g => g.gamePlatforms)
                .Include(g => g.gameReviews)
                .Include(g => g.orderItems)
                .FirstOrDefault(g => g.game_id == id);

            if (game == null)
            {
                throw new ArgumentException("Game not found.");
            }

            game.name = updateGameDto.name ?? game.name;
            game.description = updateGameDto.description ?? game.description;
            game.release_date = updateGameDto.release_date ?? game.release_date;
            game.price = updateGameDto.price ?? game.price;
            game.stock = updateGameDto.stock ?? game.stock;

            if (updateGameDto.gameGenres != null)
            {
                var genres = _context.GameGenres
                    .Where(gg => updateGameDto.gameGenres.Contains(gg.genre_id))
                    .ToList();
                game.gameGenres = genres;
            }

            if (updateGameDto.gamePlatforms != null)
            {
                var platforms = _context.GamePlatforms
                    .Where(gp => updateGameDto.gamePlatforms.Contains(gp.platform_id))
                    .ToList();
                game.gamePlatforms = platforms;
            }

            if (updateGameDto.gameReviews != null)
            {
                var reviews = _context.OrderReviews
                    .Where(gr => updateGameDto.gameReviews.Contains(gr.review_id))
                    .ToList();
                game.gameReviews = reviews;
            }

            if (updateGameDto.orderItems != null)
            {
                var orderItems = _context.OrderItems
                    .Where(oi => updateGameDto.orderItems.Contains(oi.order_id))
                    .ToList();
                game.orderItems = orderItems;
            }

            _context.SaveChanges();

            return new ResponseMKP_GameDto
            {
                id = game.game_id,
                name = game.name,
                description = game.description,
                release_date = game.release_date,
                price = game.price,
                stock = game.stock,
                genre_ids = game.gameGenres.Select(gg => gg.genre_id).ToList(),
                platform_ids = game.gamePlatforms.Select(gp => gp.platform_id).ToList(),
                review_ids = game.gameReviews.Select(gr => gr.review_id).ToList(),
                order_ids = game.orderItems.Select(oi => oi.order_id).ToList(),
                genres = game.gameGenres.Select(gg => new ResponseGenreDto
                {
                    id = gg.genre_id,
                    name = gg.genre.name
                }).ToList(),
                platforms = game.gamePlatforms.Select(gp => new ResponsePlatformDto
                {
                    id = gp.platform_id,
                    name = gp.platform.name,
                    debut_year = gp.platform.debut_year
                }).ToList(),
                reviews = game.gameReviews.Select(gr => new ResponseOrderReviewDto
                {
                    review_id = gr.review_id,
                    rating = gr.rating,
                    review = gr.review,
                    reviewer_id = gr.reviewer_id
                }).ToList(),
                orders = game.orderItems.Select(oi => new ResponseOrderItemDto
                {
                    order_id = oi.order_id,
                    game_id = oi.game_id,
                    amount = oi.amount
                }).ToList()
            };
        }

        public void DeleteGame(Guid id)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var game = _context.MarketPlaceGames
                        .FirstOrDefault(g => g.game_id == id);

                    if (game == null)
                    {
                        throw new ArgumentException("Game not found.");
                    }

                    _context.MarketPlaceGames.Remove(game);
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
