package br.com.flavalia.avalia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String tipo = "Bearer";
    private Long id;
    private String nome;
    private String login;
    private String perfil;
    
    public LoginResponse(String token, Long id, String nome, String login, String perfil) {
        this.token = token;
        this.id = id;
        this.nome = nome;
        this.login = login;
        this.perfil = perfil;
    }
}
