package br.com.flavalia.avalia.dto;

import br.com.flavalia.avalia.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String login;
    private String email;
    private Usuario.Perfil perfil;
    private Boolean ativo;
    private LocalDateTime criadoEm;
    private List<MateriaSimplificadaDTO> materias = new ArrayList<>();
}
