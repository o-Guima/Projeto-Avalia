package br.com.flavalia.avalia.controller;

import br.com.flavalia.avalia.dto.AvaliacaoRequest;
import br.com.flavalia.avalia.dto.MateriaDTO;
import br.com.flavalia.avalia.dto.ProfessorSimplificadoDTO;
import br.com.flavalia.avalia.dto.QuestaoDTO;
import br.com.flavalia.avalia.dto.UsuarioDTO;
import br.com.flavalia.avalia.model.Avaliacao;
import br.com.flavalia.avalia.model.Materia;
import br.com.flavalia.avalia.model.Questao;
import br.com.flavalia.avalia.model.Usuario;
import br.com.flavalia.avalia.service.AvaliacaoService;
import br.com.flavalia.avalia.service.MateriaService;
import br.com.flavalia.avalia.service.PdfService;
import br.com.flavalia.avalia.service.QuestaoService;
import br.com.flavalia.avalia.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"}, allowCredentials = "true")
public class AdminController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private QuestaoService questaoService;
    
    @Autowired
    private MateriaService materiaService;
    
    @Autowired
    private AvaliacaoService avaliacaoService;
    
    @Autowired
    private PdfService pdfService;
    
    @GetMapping("/professores")
    public ResponseEntity<List<UsuarioDTO>> listarProfessores() {
        return ResponseEntity.ok(usuarioService.listarProfessores());
    }
    
    @GetMapping("/professores/{id}")
    public ResponseEntity<Usuario> buscarProfessor(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.buscarPorId(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/professores")
    public ResponseEntity<Usuario> criarProfessor(@Valid @RequestBody Usuario usuario) {
        try {
            Usuario novoProfessor = usuarioService.criarProfessor(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoProfessor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/professores/{id}")
    public ResponseEntity<Usuario> atualizarProfessor(@PathVariable Long id, @Valid @RequestBody Usuario usuario) {
        try {
            Usuario professorAtualizado = usuarioService.atualizarProfessor(id, usuario);
            return ResponseEntity.ok(professorAtualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/professores/{id}")
    public ResponseEntity<Void> deletarProfessor(@PathVariable Long id) {
        try {
            usuarioService.deletarProfessor(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ===== QUESTÕES =====
    
    @GetMapping("/questoes")
    public ResponseEntity<List<QuestaoDTO>> listarTodasQuestoes() {
        List<Questao> questoes = questaoService.listarTodas();
        List<QuestaoDTO> questoesDTO = questoes.stream()
                .map(this::convertToDTO)
                .toList();
        return ResponseEntity.ok(questoesDTO);
    }
    
    private QuestaoDTO convertToDTO(Questao questao) {
        QuestaoDTO dto = new QuestaoDTO();
        dto.setId(questao.getId());
        dto.setMateria(questao.getMateria());
        dto.setTopico(questao.getTopico());
        dto.setNivelDificuldade(questao.getNivelDificuldade());
        dto.setPontuacao(questao.getPontuacao());
        dto.setEnunciado(questao.getEnunciado());
        dto.setTipoQuestao(questao.getTipoQuestao());
        dto.setAlternativas(questao.getAlternativas());
        dto.setCriadaEm(questao.getCriadaEm());
        
        if (questao.getProfessor() != null) {
            ProfessorSimplificadoDTO prof = new ProfessorSimplificadoDTO(
                questao.getProfessor().getId(),
                questao.getProfessor().getNome(),
                questao.getProfessor().getLogin()
            );
            dto.setProfessor(prof);
        }
        
        return dto;
    }
    
    @DeleteMapping("/questoes/{id}")
    public ResponseEntity<Void> deletarQuestao(@PathVariable Long id) {
        try {
            questaoService.deletarQuestao(id, null); // Admin pode deletar qualquer questão
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ===== MATÉRIAS =====
    
    @GetMapping("/materias")
    public ResponseEntity<List<MateriaDTO>> listarMaterias() {
        return ResponseEntity.ok(materiaService.listarTodas());
    }
    
    @GetMapping("/materias/{id}")
    public ResponseEntity<Materia> buscarMateria(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(materiaService.buscarPorId(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/materias")
    public ResponseEntity<Materia> criarMateria(@Valid @RequestBody Materia materia) {
        try {
            Materia novaMateria = materiaService.criarMateria(materia);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaMateria);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/materias/{id}")
    public ResponseEntity<Materia> atualizarMateria(@PathVariable Long id, @Valid @RequestBody Materia materia) {
        try {
            Materia materiaAtualizada = materiaService.atualizarMateria(id, materia);
            return ResponseEntity.ok(materiaAtualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/materias/{id}")
    public ResponseEntity<Void> deletarMateria(@PathVariable Long id) {
        try {
            materiaService.deletarMateria(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/materias/{materiaId}/professores/{professorId}")
    public ResponseEntity<Void> associarProfessor(@PathVariable Long materiaId, @PathVariable Long professorId) {
        try {
            materiaService.associarProfessor(materiaId, professorId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/materias/{materiaId}/professores/{professorId}")
    public ResponseEntity<Void> desassociarProfessor(@PathVariable Long materiaId, @PathVariable Long professorId) {
        try {
            materiaService.desassociarProfessor(materiaId, professorId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ===== AVALIAÇÕES =====
    
    @GetMapping("/avaliacoes")
    public ResponseEntity<List<Avaliacao>> listarAvaliacoes() {
        return ResponseEntity.ok(avaliacaoService.listarTodas());
    }
    
    @GetMapping("/avaliacoes/{id}")
    public ResponseEntity<Avaliacao> buscarAvaliacao(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(avaliacaoService.buscarPorId(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/avaliacoes")
    public ResponseEntity<Avaliacao> criarAvaliacao(@Valid @RequestBody AvaliacaoRequest request) {
        try {
            // Admin pode criar avaliação sem professorId
            Avaliacao avaliacao = avaliacaoService.criarAvaliacao(request, null);
            return ResponseEntity.status(HttpStatus.CREATED).body(avaliacao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/avaliacoes/{id}")
    public ResponseEntity<Void> deletarAvaliacao(@PathVariable Long id) {
        try {
            avaliacaoService.deletarAvaliacao(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/avaliacoes/{id}/pdf")
    public ResponseEntity<String> gerarPdfAvaliacao(@PathVariable Long id) {
        try {
            Avaliacao avaliacao = avaliacaoService.buscarPorId(id);
            String pdfBase64 = pdfService.gerarPdfAvaliacao(avaliacao);
            return ResponseEntity.ok(pdfBase64);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
