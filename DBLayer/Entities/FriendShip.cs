using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities
{
    public class Friendship
    {
        public Guid FriendshipId { get; set; }
        public Guid UserId1 { get; set; }
        public Guid UserId2 { get; set; }
        public DateTime CreatedAt { get; set; }
        public FriendshipStatus Status { get; set; }

        [ForeignKey("UserId1")]
        public User User1 { get; set; }
        [ForeignKey("UserId2")]
        public User User2 { get; set; }
    }
}