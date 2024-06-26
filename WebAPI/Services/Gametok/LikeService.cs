using ESOF.WebApp.DBLayer.Context;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.WebAPI.DtoClasses.Response;
using ESOF.WebApp.WebAPI.DtoClasses.Create;

namespace ESOF.WebApp.WebAPI.Services;
    
public class LikeService {
    private readonly ApplicationDbContext _context;

    public LikeService(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public bool IsLiked(Guid videoId, Guid userId)
    {
        return _context.Likes.Any(like => like.VideoId == videoId && like.UserId == userId);
    }

    public ResponseLikeDto CreateLike(CreateLikeDto createLikeDto)
    {
        var like = new Like
        {
            UserId = createLikeDto.userid,
            VideoId = createLikeDto.videoid,
        };

        _context.Likes.Add(like);
        _context.SaveChanges();

        return new ResponseLikeDto
        {
            userid = like.UserId,
            videoid = like.VideoId
        };
    }
    
    public void DeleteLike(Guid videoId, Guid userId)
    {
        var like = _context.Likes.SingleOrDefault(l => l.VideoId == videoId && l.UserId == userId);
        if (like == null)
        {
            throw new ArgumentException("Like not found.");
        }

        _context.Likes.Remove(like);
        _context.SaveChanges();
    }
}

