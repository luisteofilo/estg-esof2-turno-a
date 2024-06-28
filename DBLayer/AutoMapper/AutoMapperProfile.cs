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
            .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres))
            .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Categories))
            .ForMember(dest => dest.Consoles, opt => opt.MapFrom(src => src.Consoles));

        CreateMap<Game, GameDto>()
            .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.Genres))
            .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Categories))
            .ForMember(dest => dest.Consoles, opt => opt.MapFrom(src => src.Consoles));
    }
}