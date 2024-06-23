using System.ComponentModel.DataAnnotations;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ESOF.WebApp.DBLayer.Entities;

public class Games
{
    [Key]
    public Guid GameId { get; set; }

    [Required]
    public String Name { get; set; }

    [Required]
    public DateTime ReleaseDate { get; set; }

    [Required]
    public String Url_Image { get; set; }

    [Required]
    public String Developer { get; set; }

    [Required]
    public String Publisher { get; set; }

    [Required]
    public String Description { get; set; }

    [Required]
    public double Price { get; set; }


    public Roms Rom { get; set; }
    
}