package br.com.flavalia.avalia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Questao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Matéria é obrigatória")
    @Column(nullable = false)
    private String materia;
    
    @Column(name = "topico")
    private String topico;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_dificuldade")
    private NivelDificuldade nivelDificuldade;
    
    @Column(name = "pontuacao")
    private Integer pontuacao = 1;
    
    @NotBlank(message = "Enunciado é obrigatório")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String enunciado;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_questao")
    private TipoQuestao tipoQuestao = TipoQuestao.MULTIPLA_ESCOLHA;
    
    @ManyToOne
    @JoinColumn(name = "id_professor_criador", nullable = false)
    @JsonIgnore
    private Usuario professor;
    
    @OneToMany(mappedBy = "questao", cascade = CascadeType.ALL, orphanRemoval = true)
    @Size(min = 2, message = "A questão deve ter no mínimo 2 alternativas")
    private List<Alternativa> alternativas = new ArrayList<>();
    
    @Column(name = "criada_em")
    private LocalDateTime criadaEm;
    
    @PrePersist
    protected void onCreate() {
        criadaEm = LocalDateTime.now();
    }
    
    public enum NivelDificuldade {
        FACIL,
        MEDIO,
        DIFICIL
    }
    
    public enum TipoQuestao {
        MULTIPLA_ESCOLHA,
        DISSERTATIVA
    }
}
