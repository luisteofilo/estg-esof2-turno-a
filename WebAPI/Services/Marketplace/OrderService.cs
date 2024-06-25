using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.WebAPI.DtoClasses.Response;

namespace ESOF.WebApp.WebAPI.Services.Marketplace;

public class OrderService {
    private readonly ApplicationDbContext _context;

    public OrderService(ApplicationDbContext context) {
        _context = context;
    }

    public List<ResponseOrderDto> GetAllOrders() {
        try
        {
            return _context.Orders.Select(order => new ResponseOrderDto()
            {
                order_id = order.order_id,
                user_id = order.user_id,
                completed = order.completed,
                order_type = order.order_type,
                //game_ids = order.,
                //items = order.orderItems
            }).ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving orders.", ex);
        }
    }
}