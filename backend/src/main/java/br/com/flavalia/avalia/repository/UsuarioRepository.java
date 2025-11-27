package br.com.flavalia.avalia.repository;

import br.com.flavalia.avalia.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByLogin(String login);
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByPerfil(Usuario.Perfil perfil);
    boolean existsByLogin(String login);
    boolean existsByEmail(String email);
}
