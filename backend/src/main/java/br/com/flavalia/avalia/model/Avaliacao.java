package br.com.flavalia.avalia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "avaliacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Avaliacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Título é obrigatório")
    @Column(nullable = false)
    private String titulo;
    
    @Column(name = "turma")
    private String turma;
    
    @Column(name = "nome_faculdade")
    private String nomeFaculdade;
    
    @Column(name = "logo_faculdade", columnDefinition = "TEXT")
    private String logoFaculdade; // Base64 da imagem
    
    @Column(name = "criada_em")
    private LocalDateTime criadaEm;
    
    @ManyToOne
    @JoinColumn(name = "id_professor", nullable = false)
    @JsonIgnore
    private Usuario professor;
    
    @ManyToMany
    @JoinTable(
        name = "avaliacao_questoes",
        joinColumns = @JoinColumn(name = "avaliacao_id"),
        inverseJoinColumns = @JoinColumn(name = "questao_id")
    )
    private List<Questao> questoes = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        criadaEm = LocalDateTime.now();
    }
}
