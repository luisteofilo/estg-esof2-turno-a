using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ESOF.WebApp.DBLayer.Entities;

public class Mod
{
    [Key]
    public Guid ModId { get; set; }  // Unique identifier for the mod

    [Required, StringLength(255)]
    public string Name { get; set; }  // Name of the mod

    [Required, StringLength(255)]
    public string Game { get; set; }  // Name of the mod

    [Required, StringLength(4000)]
    public string Description { get; set; }  // A brief description of what the mod does

    [DataType(DataType.DateTime)]
    public DateTime ReleaseDate { get; set; }  // The release date of the mod

    [Required, StringLength(255)]
    public string Author { get; set; }  // Navigation property for the mod's author

    public string Version { get; set; }  // Version of the mod

  // Collection of tags for categorizing the mod

    [DataType(DataType.Url)]
    public string DownloadLink { get; set; }  // URL to download the mod

    // You may want to track downloads or ratings:
    public int DownloadCount { get; set; }  // How many times the mod has been downloaded

    public double Rating { get; set; }  // Average rating of the mod
    
    [JsonIgnore] // Ignore durante a serialização JSON
    public ICollection<ModTag> Tags { get; set; }  = new List<ModTag>();
}
