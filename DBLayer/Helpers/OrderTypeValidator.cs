using System.ComponentModel.DataAnnotations;
using ESOF.WebApp.DBLayer.Entities;
using ESOF.WebApp.DBLayer.Entities.Marketplace;

namespace ESOF.WebApp.DBLayer.Helpers;

public class OrderTypeValidator : ValidationAttribute{
	protected ValidationResult IsValid(object value, ValidationContext validationContext){
		if (value is string orderType){
			if (Enum.TryParse(typeof(OrderType), orderType, true, out var result) && Enum.IsDefined(typeof(OrderType), result)){
				return ValidationResult.Success;
			}
		}
		return new ValidationResult("Invalid order type. Allowed values are 'Purchase' or 'Sale'.");
	}
}