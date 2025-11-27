package br.com.flavalia.avalia.repository;

import br.com.flavalia.avalia.model.Questao;
import br.com.flavalia.avalia.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestaoRepository extends JpaRepository<Questao, Long> {
    List<Questao> findByProfessor(Usuario professor);
    List<Questao> findByProfessorId(Long professorId);
    List<Questao> findByMateria(String materia);
    List<Questao> findByNivelDificuldade(Questao.NivelDificuldade nivelDificuldade);
    
    @Query("SELECT DISTINCT q FROM Questao q " +
           "JOIN q.professor p " +
           "JOIN p.materias m " +
           "WHERE m.nome IN :materias")
    List<Questao> findByMateriasCompartilhadas(@Param("materias") List<String> materias);
}
