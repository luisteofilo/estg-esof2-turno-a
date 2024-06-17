using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ESOF.WebApp.DBLayer.Entities
{
	public class Platform{
		[Key]
		public Guid platform_id { get; set; }
		
		[Required]
		public int debut_year { get; set; }
		
		[NotMapped]
		public DateTime DebutYear{
			get => new DateTime(debut_year, 1, 1);
			set => debut_year = value.Year;
		}
		public ICollection<GamePlatform> gamePlatform { get; set; }

	}

}