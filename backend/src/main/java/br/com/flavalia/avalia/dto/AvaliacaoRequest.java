package br.com.flavalia.avalia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoRequest {
    @NotBlank(message = "Título é obrigatório")
    private String titulo;
    
    private String turma;
    private String nomeFaculdade;
    private String logoFaculdade;
    
    @NotEmpty(message = "Selecione ao menos uma questão")
    private List<Long> questoesIds;
}
