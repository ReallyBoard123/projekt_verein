import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.*;

@Service
public class OpenRouterService {

    private static final String API_KEY = "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";

    public String callAI(String userMessage) throws Exception {
        String body = """
        {
          "model": "openai/gpt-4o-mini",
          "messages": [
            {"role": "user", "content": "%s"}
          ]
        }
        """.formatted(userMessage);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://openrouter.ai/api/v1/chat/completions"))
                .header("Authorization", "Bearer " + API_KEY)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response =
                client.send(request, HttpResponse.BodyHandlers.ofString());

        return response.body();
    }
}