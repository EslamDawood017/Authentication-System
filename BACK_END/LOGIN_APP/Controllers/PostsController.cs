using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LOGIN_APP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        public ProductController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        [HttpGet()]
        [Authorize]
        public async Task<IActionResult> GetProducts()
        {
            var response = await _httpClient.GetAsync(
                "https://dummyjson.com/products"
            ); 

            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadAsStringAsync();

            return Content(result, "application/json");
        }
    }
}
