package br.com.flavalia.avalia.repository;

import br.com.flavalia.avalia.model.Avaliacao;
import br.com.flavalia.avalia.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByProfessor(Usuario professor);
    List<Avaliacao> findByProfessorId(Long professorId);
}
