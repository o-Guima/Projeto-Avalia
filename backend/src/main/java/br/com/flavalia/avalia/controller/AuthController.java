package br.com.flavalia.avalia.controller;

import br.com.flavalia.avalia.dto.LoginRequest;
import br.com.flavalia.avalia.dto.LoginResponse;
import br.com.flavalia.avalia.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("🔐 Tentativa de login - Usuário: " + loginRequest.getLogin());
            LoginResponse response = authService.login(loginRequest);
            System.out.println("✅ Login bem-sucedido - Usuário: " + loginRequest.getLogin());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Erro no login - Usuário: " + loginRequest.getLogin());
            System.err.println("   Erro: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Credenciais inválidas");
        }
    }
}
