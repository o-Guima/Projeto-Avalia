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
@Table(name = "materias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Materia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nome da matéria é obrigatório")
    @Column(nullable = false, unique = true)
    private String nome;
    
    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;
    
    @Column(name = "ativa")
    private Boolean ativa = true;
    
    @Column(name = "criada_em")
    private LocalDateTime criadaEm;
    
    @ManyToMany(mappedBy = "materias")
    @JsonIgnore
    private List<Usuario> professores = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        criadaEm = LocalDateTime.now();
    }
}
