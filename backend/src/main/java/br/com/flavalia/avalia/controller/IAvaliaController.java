package br.com.flavalia.avalia.controller;

import br.com.flavalia.avalia.security.JwtUtil;
import br.com.flavalia.avalia.service.IAvaliaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/professor/iavalia")
public class IAvaliaController {
    
    private static final Logger logger = LoggerFactory.getLogger(IAvaliaController.class);
    
    @Autowired
    private IAvaliaService iavaliaService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Value("${gemini.api.model}")
    private String model;
    
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        
        try {
            // Validar token
            String jwtToken = token.replace("Bearer ", "");
            String login = jwtUtil.extractUsername(jwtToken);
            
            if (login == null || !jwtUtil.validateToken(jwtToken, login)) {
                logger.warn("Tentativa de acesso com token inválido");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Token inválido"));
            }
            
            // Validar mensagem
            String message = request.get("message");
            if (message == null || message.trim().isEmpty()) {
                logger.warn("Requisição recebida sem mensagem - Usuário: {}", login);
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Mensagem não pode ser vazia"));
            }
            
            logger.info("Processando chat para usuário: {} - Mensagem: {} caracteres", 
                    login, message.length());
            
            String response = iavaliaService.chat(message);
            return ResponseEntity.ok(Map.of("response", response));
            
        } catch (Exception e) {
            logger.error("Erro ao processar chat: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao processar sua mensagem: " + e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "online",
            "service", "IAvalia",
            "model", model,
            "version", "1.0.0"
        ));
    }
}
