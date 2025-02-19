using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class DriversController : ControllerBase
{
    private readonly IHttpClientFactory _clientFactory;
    private const string ApiKey = "7303c8ef-d91a-4964-a7e7-78c26ee17ec4";

    public DriversController(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }

    [HttpGet("{season}")]
    public async Task<IActionResult> GetStandings(int season)
    {
        var client = _clientFactory.CreateClient();
        client.DefaultRequestHeaders.Clear();
        client.DefaultRequestHeaders.Add("x-api-key", ApiKey);

        var url = $"https://pitwall.redbullracing.com/api/standings/drivers/{season}";

        var response = await client.GetAsync(url);

        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            return StatusCode((int)response.StatusCode, $"Error: {response.StatusCode}, Details: {responseContent}");
        }

        return Content(responseContent, "application/json");
    }
}
