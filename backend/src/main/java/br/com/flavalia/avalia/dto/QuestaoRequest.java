package br.com.flavalia.avalia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestaoRequest {
    @NotBlank(message = "Matéria é obrigatória")
    private String materia;
    
    private String topico;
    
    private String nivelDificuldade;
    
    private Integer pontuacao;
    
    @NotBlank(message = "Enunciado é obrigatório")
    private String enunciado;
    
    private String tipoQuestao;
    
    @NotNull(message = "Alternativas são obrigatórias")
    @Size(min = 2, message = "A questão deve ter no mínimo 2 alternativas")
    private List<AlternativaRequest> alternativas;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlternativaRequest {
        @NotBlank(message = "Texto da alternativa é obrigatório")
        private String textoAlternativa;
        
        private String letra;
        
        private Boolean correta;
    }
}
