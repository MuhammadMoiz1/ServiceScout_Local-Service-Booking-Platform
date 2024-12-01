using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace Backend.Authentication
{
	public class AuthOptions
	{
		public const string ISSUER = "ServiceScoutIssuer"; // Issuer
		public const string AUDIENCE = "ServiceScoutAudience"; // Audience
		public const string KEY = "ull5pwX0vL7LVsQDwtZp5TPG6p-zPCc9CEQWkeUM5FU"; // Secret key for JWT signing
		public const int LIFETIME = 60; // Token lifetime in minutes

		// Method to get the symmetric security key for signing the JWT token
		public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
			new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
	}
}
