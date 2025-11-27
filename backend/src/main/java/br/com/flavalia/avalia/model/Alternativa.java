package br.com.flavalia.avalia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "alternativas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alternativa {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Texto da alternativa é obrigatório")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String textoAlternativa;
    
    @Column(name = "letra")
    private String letra;
    
    @Column(name = "correta")
    private Boolean correta = false;
    
    @ManyToOne
    @JoinColumn(name = "id_questao", nullable = false)
    @JsonIgnore
    private Questao questao;
}
