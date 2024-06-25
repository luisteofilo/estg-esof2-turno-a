using System;
using System.ComponentModel.DataAnnotations;

namespace ESOF.WebApp.DBLayer.Entities;

public class GameReplay
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string FilePath { get; set; }
    public DateTime UploadDate { get; set; } = DateTime.UtcNow;
    public byte[] VideoData { get; set; } // Add field to store
    [Required]
    public Guid UserId { get; set; }
    public User User { get; set; }
}