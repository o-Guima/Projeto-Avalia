package br.com.flavalia.avalia.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class IAvaliaService {
    
    private static final Logger logger = LoggerFactory.getLogger(IAvaliaService.class);
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    @Value("${gemini.api.model}")
    private String model;
    
    private static final String SYSTEM_PROMPT = """
        Você é o IAvalia, um assistente especializado em criar questões de múltipla escolha para avaliações acadêmicas.
        
        Suas responsabilidades:
        1. Criar questões objetivas de alta qualidade com 4 ou 5 alternativas
        2. Sempre indicar claramente qual é a alternativa correta
        3. Formatar as questões de forma clara e organizada
        4. Adaptar o nível de dificuldade conforme solicitado (FACIL, MEDIO, DIFICIL)
        5. Criar questões sobre qualquer matéria ou tópico solicitado
        
        Formato de resposta esperado:
        
        **Enunciado:** [texto da questão]
        
        **Alternativas:**
        a) [alternativa 1]
        b) [alternativa 2]
        c) [alternativa 3]
        d) [alternativa 4]
        e) [alternativa 5] (opcional)
        
        **Resposta Correta:** [letra da alternativa correta]
        
        **Nível de Dificuldade:** [FACIL/MEDIO/DIFICIL]
        
        Seja sempre educado, profissional e focado em criar questões de qualidade pedagógica.
        """;
    
    public IAvaliaService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
                .build();
        this.objectMapper = new ObjectMapper();
    }
    
    public String chat(String userMessage) {
        String fullPrompt = SYSTEM_PROMPT + "\n\nUsuário: " + userMessage;
        
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of(
                    "parts", List.of(
                        Map.of("text", fullPrompt)
                    )
                )
            ),
            "generationConfig", Map.of(
                "temperature", 0.7,
                "maxOutputTokens", 2048
            )
        );
        
        try {
            logger.info("Enviando requisição para Gemini API - Modelo: {}", model);
            
            String response = webClient.post()
                    .uri("/" + model + ":generateContent")
                    .header("Content-Type", "application/json")
                    .header("X-goog-api-key", apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            JsonNode root = objectMapper.readTree(response);
            
            if (root.has("error")) {
                String errorMsg = root.path("error").path("message").asText();
                logger.error("Erro da API Gemini: {}", errorMsg);
                throw new RuntimeException("Erro da API Gemini: " + errorMsg);
            }
            
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");
                
                if (parts.isArray() && parts.size() > 0) {
                    String result = parts.get(0).path("text").asText();
                    logger.info("Resposta gerada com sucesso - {} caracteres", result.length());
                    return result;
                }
            }
            
            logger.warn("Resposta vazia da API Gemini");
            throw new RuntimeException("Não foi possível gerar uma resposta");
            
        } catch (Exception e) {
            logger.error("Erro ao comunicar com a API do Gemini: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao comunicar com a API do Gemini: " + e.getMessage());
        }
    }
}
