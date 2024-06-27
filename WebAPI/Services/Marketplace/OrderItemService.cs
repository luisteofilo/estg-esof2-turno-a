using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities.Marketplace;
using ESOF.WebApp.WebAPI.DtoClasses;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Update;
using Microsoft.EntityFrameworkCore;

namespace ESOF.WebApp.WebAPI.Services.Marketplace
{
    public class OrderItemService
    {
        private readonly ApplicationDbContext _context;

        public OrderItemService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ResponseOrderItemDto> GetOrderItems(Guid orderId)
        {
            try
            {
                return _context.OrderItems
                    .Include(oi => oi.MarketPlaceGame)
                    .Include(oi => oi.order)
                    .Where(o => o.order_id == orderId)
                    .Select(orderItem => new ResponseOrderItemDto
                    {
                        order_id = orderItem.order_id,
                        game_id = orderItem.game_id,
                        amount = orderItem.amount,
                    }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving order items.", ex);
            }
        }

        public ResponseOrderItemDto GetOrderItemById(Guid orderId, Guid gameId)
        {
            var orderItem = _context.OrderItems
                .Include(oi => oi.MarketPlaceGame)
                .Include(oi => oi.order)
                .FirstOrDefault(oi => oi.order_id == orderId && oi.game_id == gameId);

            if (orderItem == null)
            {
                throw new ArgumentException("OrderItem not found.");
            }

            return new ResponseOrderItemDto
            {
                order_id = orderItem.order_id,
                game_id = orderItem.game_id,
                amount = orderItem.amount,
            };
        }

        public ResponseOrderItemDto CreateOrderItem(CreateOrderItemDto createOrderItemDto, Guid orderId, Guid gameId)
        {
            try
            {
                var order = _context.Orders.Find(orderId);
                if (order == null)
                {
                    throw new ArgumentException("Order not found.");
                }

                var game = _context.MarketPlaceGames.Find(gameId);
                if (game == null)
                {
                    throw new ArgumentException("Game not found.");
                }

                var orderItem = new OrderItem
                {
                    order_id = orderId,
                    game_id = gameId,
                    amount = createOrderItemDto.amount
                };

                _context.OrderItems.Add(orderItem);
                _context.SaveChanges();

                return new ResponseOrderItemDto
                {
                    order_id = orderItem.order_id,
                    game_id = orderItem.game_id,
                    amount = orderItem.amount,
                };
            }
            catch (DbUpdateException ex)
            {
                throw new Exception("An error occurred while creating the order item.", ex);
            }
        }

        public ResponseOrderItemDto UpdateOrderItem(Guid orderId, Guid gameId, UpdateOrderItemDto updateOrderItemDto)
        {
            var orderItem = _context.OrderItems
                .FirstOrDefault(oi => oi.order_id == orderId && oi.game_id == gameId);

            if (orderItem == null)
            {
                throw new ArgumentException("OrderItem not found.");
            }

            orderItem.amount = updateOrderItemDto.amount ?? orderItem.amount;

            _context.SaveChanges();

            return new ResponseOrderItemDto
            {
                order_id = orderItem.order_id,
                game_id = orderItem.game_id,
                amount = orderItem.amount,
            };
        }

        public void DeleteOrderItem(Guid orderId, Guid gameId)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var orderItem = _context.OrderItems
                        .FirstOrDefault(oi => oi.order_id == orderId && oi.game_id == gameId);

                    if (orderItem == null)
                    {
                        throw new ArgumentException("OrderItem not found.");
                    }

                    _context.OrderItems.Remove(orderItem);
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
