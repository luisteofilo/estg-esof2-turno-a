using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Services.Marketplace
{
    public class OrderService
    {
        private readonly ApplicationDbContext _context;

        public OrderService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ResponseOrderDto> GetAllOrders()
        {
            try
            {
                return _context.Orders
                    .Include(o => o.orderItems)
                    .Include(o => o.reviews)
                    .Select(order => new ResponseOrderDto
                    {
                        order_id = order.order_id,
                        user_id = order.user_id,
                        completed = order.completed,
                        order_type = order.order_type,
                        items = order.orderItems.Select(oi => new ResponseOrderItemDto
                        {
                            order_id = oi.order_id,
                            game_id = oi.game_id,
                            amount = oi.amount,
                            game = new ResponseMKP_GameDto
                            {
                                id = oi.MarketPlaceGame.game_id,
                                name = oi.MarketPlaceGame.name,
                                description = oi.MarketPlaceGame.description,
                                release_date = oi.MarketPlaceGame.release_date,
                                price = oi.MarketPlaceGame.price,
                                stock = oi.MarketPlaceGame.stock
                            }
                        }).ToList(),
                        reviews = order.reviews.Select(or => new ResponseOrderReviewDto
                        {
                            order_id = or.order_id,
                            reviewer_id = or.reviewer_id,
                            rating = or.rating,
                            review = or.review
                        }).ToList()
                    }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving orders.", ex);
            }
        }

        public ResponseOrderDto GetOrderById(Guid id)
        {
            var order = _context.Orders
                .Include(o => o.orderItems)
                .ThenInclude(oi => oi.MarketPlaceGame).Include(order => order.reviews)
                .FirstOrDefault(o => o.order_id == id);

            if (order == null)
            {
                throw new ArgumentException("Order not found.");
            }

            return new ResponseOrderDto
            {
                order_id = order.order_id,
                user_id = order.user_id,
                completed = order.completed,
                order_type = order.order_type,
                items = order.orderItems.Select(oi => new ResponseOrderItemDto
                {
                    order_id = oi.order_id,
                    game_id = oi.game_id,
                    amount = oi.amount,
                    game = new ResponseMKP_GameDto
                    {
                        id = oi.MarketPlaceGame.game_id,
                        name = oi.MarketPlaceGame.name,
                        description = oi.MarketPlaceGame.description,
                        release_date = oi.MarketPlaceGame.release_date,
                        price = oi.MarketPlaceGame.price,
                        stock = oi.MarketPlaceGame.stock
                    }
                }).ToList(),
                reviews = order.reviews.Select(or => new ResponseOrderReviewDto
                {
                    order_id = or.order_id,
                    reviewer_id = or.reviewer_id,
                    rating = or.rating,
                    review = or.review
                }).ToList()
            };
        }

        public ResponseOrderDto CreateOrder(CreateOrderDto createOrderDto)
        {
            try
            {
                var order = new Order
                {
                    user_id = createOrderDto.user_id,
                    completed = createOrderDto.completed,
                    order_type = createOrderDto.order_type
                };

                _context.Orders.Add(order);
                _context.SaveChanges();

                return new ResponseOrderDto
                {
                    order_id = order.order_id,
                    user_id = order.user_id,
                    completed = order.completed,
                    order_type = order.order_type,
                    items = order.orderItems.Select(oi => new ResponseOrderItemDto
                    {
                        order_id = oi.order_id,
                        game_id = oi.game_id,
                        amount = oi.amount,
                        game = new ResponseMKP_GameDto
                        {
                            id = oi.MarketPlaceGame.game_id,
                            name = oi.MarketPlaceGame.name,
                            description = oi.MarketPlaceGame.description,
                            release_date = oi.MarketPlaceGame.release_date,
                            price = oi.MarketPlaceGame.price,
                            stock = oi.MarketPlaceGame.stock
                        }
                    }).ToList(),
                    reviews = order.reviews.Select(or => new ResponseOrderReviewDto
                    {
                        order_id = or.order_id,
                        reviewer_id = or.reviewer_id,
                        rating = or.rating,
                        review = or.review
                    }).ToList()
                };
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("An error occurred while creating the order.", ex);
            }
        }

        public ResponseOrderDto UpdateOrder(Guid id, UpdateOrderDto updateOrderDto)
        {
            var order = _context.Orders
                .Include(o => o.orderItems).ThenInclude(orderItem => orderItem.MarketPlaceGame)
                .Include(o => o.reviews)
                .FirstOrDefault(o => o.order_id == id);

            if (order == null)
            {
                throw new ArgumentException("Order not found.");
            }

            order.user_id = updateOrderDto.user_id ?? order.user_id;
            order.completed = updateOrderDto.completed ?? order.completed;
            order.order_type = updateOrderDto.order_type ?? order.order_type;

            if (updateOrderDto.orderItems != null && updateOrderDto.orderItems.Any())
            {
                var orderItems = _context.OrderItems
                    .Where(oi => updateOrderDto.orderItems.Contains(oi.game_id))
                    .Include(orderItem => orderItem.MarketPlaceGame)
                    .ToList();
                order.orderItems = orderItems;
            }

            _context.SaveChanges();

            return new ResponseOrderDto
            {
                order_id = order.order_id,
                user_id = order.user_id,
                completed = order.completed,
                order_type = order.order_type,
                items = order.orderItems.Select(oi => new ResponseOrderItemDto
                {
                    order_id = oi.order_id,
                    game_id = oi.game_id,
                    amount = oi.amount,
                    game = new ResponseMKP_GameDto
                    {
                        id = oi.MarketPlaceGame.game_id,
                        name = oi.MarketPlaceGame.name,
                        description = oi.MarketPlaceGame.description,
                        release_date = oi.MarketPlaceGame.release_date,
                        price = oi.MarketPlaceGame.price,
                        stock = oi.MarketPlaceGame.stock
                    }
                }).ToList(),
                reviews = order.reviews.Select(or => new ResponseOrderReviewDto
                {
                    order_id = or.order_id,
                    reviewer_id = or.reviewer_id,
                    rating = or.rating,
                    review = or.review
                }).ToList()
            };
        }

        public void DeleteOrder(Guid id)
        {
            var order = _context.Orders
                .Include(o => o.orderItems)
                .FirstOrDefault(o => o.order_id == id);

            if (order == null)
            {
                throw new ArgumentException("Order not found.");
            }

            _context.Orders.Remove(order);
            _context.SaveChanges();
        }
    }
}
