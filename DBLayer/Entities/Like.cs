﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities;

public class Like
{
    [Key]
    public Guid like_id{ get; set; }
    
    [ForeignKey("user_id")]
    public User user{ get; set; }
    
    [ForeignKey("video_id")]
    public Video video{ get; set; }
    
    [Required]
    public DateTime created_at{ get; set; }
}