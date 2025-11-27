package br.com.flavalia.avalia.controller;

import br.com.flavalia.avalia.model.Materia;

import br.com.flavalia.avalia.dto.AvaliacaoRequest;
import br.com.flavalia.avalia.dto.QuestaoRequest;
import br.com.flavalia.avalia.model.Avaliacao;
import br.com.flavalia.avalia.model.Questao;
import br.com.flavalia.avalia.security.JwtUtil;
import br.com.flavalia.avalia.service.AvaliacaoService;
import br.com.flavalia.avalia.service.MateriaService;
import br.com.flavalia.avalia.service.PdfService;
import br.com.flavalia.avalia.service.QuestaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professor")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"}, allowCredentials = "true")
public class ProfessorController {
    
    @Autowired
    private QuestaoService questaoService;
    
    @Autowired
    private AvaliacaoService avaliacaoService;
    
    @Autowired
    private PdfService pdfService;
    
    @Autowired
    private MateriaService materiaService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private Long extrairProfessorId(String token) {
        String jwt = token.substring(7);
        return jwtUtil.extractClaim(jwt, claims -> claims.get("userId", Long.class));
    }
    
    // ===== MATÉRIAS =====
    
    @GetMapping("/materias")
    public ResponseEntity<List<Materia>> listarMateriasAtivas() {
        return ResponseEntity.ok(materiaService.listarAtivas());
    }
    
    // ===== QUESTÕES =====
    
    @GetMapping("/questoes")
    public ResponseEntity<List<Questao>> listarQuestoes(@RequestHeader("Authorization") String token) {
        Long professorId = extrairProfessorId(token);
        return ResponseEntity.ok(questaoService.listarTodasDoProfessor(professorId));
    }
    
    @GetMapping("/questoes/{id}")
    public ResponseEntity<Questao> buscarQuestao(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            return ResponseEntity.ok(questaoService.buscarPorId(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/questoes")
    public ResponseEntity<Questao> criarQuestao(
            @Valid @RequestBody QuestaoRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            Long professorId = extrairProfessorId(token);
            Questao questao = questaoService.criarQuestao(request, professorId);
            return ResponseEntity.status(HttpStatus.CREATED).body(questao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/questoes/{id}")
    public ResponseEntity<Questao> atualizarQuestao(
            @PathVariable Long id,
            @Valid @RequestBody QuestaoRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            Long professorId = extrairProfessorId(token);
            Questao questao = questaoService.atualizarQuestao(id, request, professorId);
            return ResponseEntity.ok(questao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/questoes/{id}")
    public ResponseEntity<Void> deletarQuestao(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            Long professorId = extrairProfessorId(token);
            questaoService.deletarQuestao(id, professorId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ===== AVALIAÇÕES =====
    
    @GetMapping("/avaliacoes")
    public ResponseEntity<List<Avaliacao>> listarAvaliacoes(@RequestHeader("Authorization") String token) {
        Long professorId = extrairProfessorId(token);
        return ResponseEntity.ok(avaliacaoService.listarTodasDoProfessor(professorId));
    }
    
    @GetMapping("/avaliacoes/{id}")
    public ResponseEntity<Avaliacao> buscarAvaliacao(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            return ResponseEntity.ok(avaliacaoService.buscarPorId(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/avaliacoes")
    public ResponseEntity<Avaliacao> criarAvaliacao(
            @Valid @RequestBody AvaliacaoRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            Long professorId = extrairProfessorId(token);
            Avaliacao avaliacao = avaliacaoService.criarAvaliacao(request, professorId);
            return ResponseEntity.status(HttpStatus.CREATED).body(avaliacao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/avaliacoes/{id}")
    public ResponseEntity<Avaliacao> atualizarAvaliacao(
            @PathVariable Long id,
            @Valid @RequestBody AvaliacaoRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            Long professorId = extrairProfessorId(token);
            Avaliacao avaliacao = avaliacaoService.atualizarAvaliacao(id, request, professorId);
            return ResponseEntity.ok(avaliacao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/avaliacoes/{id}")
    public ResponseEntity<Void> deletarAvaliacao(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            Long professorId = extrairProfessorId(token);
            avaliacaoService.deletarAvaliacao(id, professorId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // ===== PDF =====
    
    @GetMapping("/avaliacoes/{id}/pdf")
    public ResponseEntity<byte[]> gerarPdf(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            Long professorId = extrairProfessorId(token);
            Avaliacao avaliacao = avaliacaoService.buscarPorId(id);
            
            if (!avaliacao.getProfessor().getId().equals(professorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            byte[] pdfBytes = pdfService.gerarPdfAvaliacao(avaliacao);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                avaliacao.getTitulo().replaceAll("[^a-zA-Z0-9]", "_") + ".pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
