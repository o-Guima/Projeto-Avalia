package br.com.flavalia.avalia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorSimplificadoDTO {
    private Long id;
    private String nome;
    private String login;
}
