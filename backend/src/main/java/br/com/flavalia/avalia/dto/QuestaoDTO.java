package br.com.flavalia.avalia.dto;

import br.com.flavalia.avalia.model.Alternativa;
import br.com.flavalia.avalia.model.Questao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestaoDTO {
    private Long id;
    private String materia;
    private String topico;
    private Questao.NivelDificuldade nivelDificuldade;
    private Integer pontuacao;
    private String enunciado;
    private Questao.TipoQuestao tipoQuestao;
    private List<Alternativa> alternativas;
    private LocalDateTime criadaEm;
    private ProfessorSimplificadoDTO professor;
}
