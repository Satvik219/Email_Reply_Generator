package org.satvik.email_replier.Service;

import org.satvik.email_replier.DTO.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
public class EmailService {


    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public EmailService(WebClient webClient) {
        this.webClient = webClient;
    }


    public String generateEmail(EmailRequest emailRequest){
        //build the prompt
        String prompt= buildPrompt(emailRequest);

        //craft the request
        Map<String,Object> requestBody= Map.of("contents",new Object[]{
                Map.of("parts",new Object[]{
                        Map.of("text",prompt)
                })
        });

        //send the request and get response
        String response= webClient.post()
                .uri(apiUrl+apiKey)
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        //send the response

        return extractResponse(response);
    }

    private String extractResponse(String response) {
        try{
            ObjectMapper mapper= new ObjectMapper();
            JsonNode rootNode= mapper.readTree(response);
            return rootNode.path("candidates").get(0).path("content").path("parts")
                    .get(0).path("text").asText();

        } catch (Exception e) {
                return "Error Occured"+ e.getMessage();
        }

    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();

        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            prompt.append("generate an email reply for the following email content." +
                    "please don't generate a subject line and dont give options in reply to sender.");
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone");
        }
        else{
            prompt.append("generate a proffesional email reply for the following email content." +
                    "please don't generate a subject line and dont give options in reply to sender.");
        }
        prompt.append("\nOriginal Email Content:").append(emailRequest.getEmailContent());
        return prompt.toString();
    }


}
