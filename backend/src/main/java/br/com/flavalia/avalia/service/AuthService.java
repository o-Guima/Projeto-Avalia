package br.com.flavalia.avalia.service;

import br.com.flavalia.avalia.dto.LoginRequest;
import br.com.flavalia.avalia.dto.LoginResponse;
import br.com.flavalia.avalia.model.Usuario;
import br.com.flavalia.avalia.repository.UsuarioRepository;
import br.com.flavalia.avalia.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // Autentica o usuário - lança exceção se credenciais inválidas
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getLogin(), loginRequest.getSenha())
            );
            
            Usuario usuario = usuarioRepository.findByLogin(loginRequest.getLogin())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            
            String token = jwtUtil.generateToken(usuario.getLogin(), usuario.getPerfil().name(), usuario.getId());
            
            return new LoginResponse(token, usuario.getId(), usuario.getNome(), usuario.getLogin(), usuario.getPerfil().name());
            
        } catch (AuthenticationException e) {
            throw new RuntimeException("Credenciais inválidas");
        }
    }
}
