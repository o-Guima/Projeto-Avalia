package br.com.flavalia.avalia.repository;

import br.com.flavalia.avalia.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MateriaRepository extends JpaRepository<Materia, Long> {
    Optional<Materia> findByNome(String nome);
    List<Materia> findByAtivaTrue();
    boolean existsByNome(String nome);
}
