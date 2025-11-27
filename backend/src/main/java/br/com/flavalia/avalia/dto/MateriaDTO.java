package br.com.flavalia.avalia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MateriaDTO {
    private Long id;
    private String nome;
    private String descricao;
    private Boolean ativa;
    private LocalDateTime criadaEm;
    private List<ProfessorSimplificadoDTO> professores = new ArrayList<>();
}
