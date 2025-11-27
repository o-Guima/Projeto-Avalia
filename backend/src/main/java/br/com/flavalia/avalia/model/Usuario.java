package br.com.flavalia.avalia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String nome;
    
    @NotBlank(message = "Login é obrigatório")
    @Column(nullable = false, unique = true)
    private String login;
    
    @Email(message = "Email inválido")
    @Column(unique = true)
    private String email;
    
    @NotBlank(message = "Senha é obrigatória")
    @Column(nullable = false)
    private String senha;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil;
    
    @Column(name = "ativo")
    private Boolean ativo = true;
    
    @Column(name = "criado_em")
    private LocalDateTime criadoEm;
    
    @OneToMany(mappedBy = "professor", cascade = CascadeType.ALL)
    private List<Questao> questoes = new ArrayList<>();
    
    @OneToMany(mappedBy = "professor", cascade = CascadeType.ALL)
    private List<Avaliacao> avaliacoes = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "professor_materias",
        joinColumns = @JoinColumn(name = "professor_id"),
        inverseJoinColumns = @JoinColumn(name = "materia_id")
    )
    private List<Materia> materias = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
    }
    
    public enum Perfil {
        ADMIN,
        PROFESSOR
    }
}
