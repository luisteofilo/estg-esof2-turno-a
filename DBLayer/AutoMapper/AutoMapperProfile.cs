using AutoMapper;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Dto;

namespace ESOF.WebApp.DBLayer.AutoMapper;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<GameDto, Game>()
            .ForMember(dest => dest.GameId, opt => opt.Ignore())
            .ForMember(dest => dest.Rom, opt => opt.MapFrom(src => Convert.FromBase64String(src.RomBase64)))
            .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres))
            .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Categories))
            .ForMember(dest => dest.Consoles, opt => opt.MapFrom(src => src.Consoles));

        CreateMap<Game, GameDto>()
            .ForMember(dest => dest.RomBase64, opt => opt.MapFrom(src => src.Rom != null ? Convert.ToBase64String(src.Rom) : null))
            .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres))
            .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Categories))
            .ForMember(dest => dest.Consoles, opt => opt.MapFrom(src => src.Consoles));
    }
}
