package br.com.flavalia.avalia.service;

import br.com.flavalia.avalia.dto.MateriaDTO;
import br.com.flavalia.avalia.dto.ProfessorSimplificadoDTO;
import br.com.flavalia.avalia.model.Materia;
import br.com.flavalia.avalia.model.Usuario;
import br.com.flavalia.avalia.repository.MateriaRepository;
import br.com.flavalia.avalia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MateriaService {
    
    @Autowired
    private MateriaRepository materiaRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public List<MateriaDTO> listarTodas() {
        return materiaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<Materia> listarAtivas() {
        return materiaRepository.findByAtivaTrue();
    }
    
    private MateriaDTO convertToDTO(Materia materia) {
        MateriaDTO dto = new MateriaDTO();
        dto.setId(materia.getId());
        dto.setNome(materia.getNome());
        dto.setDescricao(materia.getDescricao());
        dto.setAtiva(materia.getAtiva());
        dto.setCriadaEm(materia.getCriadaEm());
        
        List<ProfessorSimplificadoDTO> professores = materia.getProfessores().stream()
                .map(prof -> new ProfessorSimplificadoDTO(prof.getId(), prof.getNome(), prof.getLogin()))
                .collect(Collectors.toList());
        dto.setProfessores(professores);
        
        return dto;
    }
    
    public Materia buscarPorId(Long id) {
        return materiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matéria não encontrada"));
    }
    
    @Transactional
    public Materia criarMateria(Materia materia) {
        if (materiaRepository.existsByNome(materia.getNome())) {
            throw new RuntimeException("Já existe uma matéria com este nome");
        }
        return materiaRepository.save(materia);
    }
    
    @Transactional
    public Materia atualizarMateria(Long id, Materia materiaAtualizada) {
        Materia materia = buscarPorId(id);
        
        if (!materia.getNome().equals(materiaAtualizada.getNome()) && 
            materiaRepository.existsByNome(materiaAtualizada.getNome())) {
            throw new RuntimeException("Já existe uma matéria com este nome");
        }
        
        materia.setNome(materiaAtualizada.getNome());
        materia.setDescricao(materiaAtualizada.getDescricao());
        materia.setAtiva(materiaAtualizada.getAtiva());
        
        return materiaRepository.save(materia);
    }
    
    @Transactional
    public void deletarMateria(Long id) {
        Materia materia = buscarPorId(id);
        materiaRepository.delete(materia);
    }
    
    @Transactional
    public void associarProfessor(Long materiaId, Long professorId) {
        Materia materia = buscarPorId(materiaId);
        Usuario professor = usuarioRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        
        if (professor.getPerfil() != Usuario.Perfil.PROFESSOR) {
            throw new RuntimeException("Usuário não é um professor");
        }
        
        if (!professor.getMaterias().contains(materia)) {
            professor.getMaterias().add(materia);
            usuarioRepository.save(professor);
        }
    }
    
    @Transactional
    public void desassociarProfessor(Long materiaId, Long professorId) {
        Materia materia = buscarPorId(materiaId);
        Usuario professor = usuarioRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        
        professor.getMaterias().remove(materia);
        usuarioRepository.save(professor);
    }
}
