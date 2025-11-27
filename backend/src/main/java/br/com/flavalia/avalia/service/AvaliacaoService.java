package br.com.flavalia.avalia.service;

import br.com.flavalia.avalia.dto.AvaliacaoRequest;
import br.com.flavalia.avalia.model.Avaliacao;
import br.com.flavalia.avalia.model.Questao;
import br.com.flavalia.avalia.model.Usuario;
import br.com.flavalia.avalia.repository.AvaliacaoRepository;
import br.com.flavalia.avalia.repository.QuestaoRepository;
import br.com.flavalia.avalia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AvaliacaoService {
    
    @Autowired
    private AvaliacaoRepository avaliacaoRepository;
    
    @Autowired
    private QuestaoRepository questaoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public List<Avaliacao> listarTodasDoProfessor(Long professorId) {
        return avaliacaoRepository.findByProfessorId(professorId);
    }
    
    public List<Avaliacao> listarTodas() {
        return avaliacaoRepository.findAll();
    }
    
    public Avaliacao buscarPorId(Long id) {
        return avaliacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));
    }
    
    @Transactional
    public Avaliacao criarAvaliacao(AvaliacaoRequest request, Long professorId) {
        if (request.getQuestoesIds() == null || request.getQuestoesIds().isEmpty()) {
            throw new RuntimeException("Selecione ao menos uma questão");
        }
        
        Usuario professor = null;
        // Se professorId não é null, buscar o professor (criação por professor)
        // Se professorId é null, não precisa de professor (criação por admin)
        if (professorId != null) {
            professor = usuarioRepository.findById(professorId)
                    .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        }
        
        List<Questao> questoes = questaoRepository.findAllById(request.getQuestoesIds());
        
        if (questoes.size() != request.getQuestoesIds().size()) {
            throw new RuntimeException("Algumas questões não foram encontradas");
        }
        
        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setTitulo(request.getTitulo());
        avaliacao.setTurma(request.getTurma());
        avaliacao.setNomeFaculdade(request.getNomeFaculdade());
        avaliacao.setProfessor(professor);
        avaliacao.setQuestoes(questoes);
        
        return avaliacaoRepository.save(avaliacao);
    }
    
    @Transactional
    public Avaliacao atualizarAvaliacao(Long id, AvaliacaoRequest request, Long professorId) {
        Avaliacao avaliacao = buscarPorId(id);
        
        if (!avaliacao.getProfessor().getId().equals(professorId)) {
            throw new RuntimeException("Você não tem permissão para editar esta avaliação");
        }
        
        if (request.getQuestoesIds() == null || request.getQuestoesIds().isEmpty()) {
            throw new RuntimeException("Selecione ao menos uma questão");
        }
        
        List<Questao> questoes = questaoRepository.findAllById(request.getQuestoesIds());
        
        if (questoes.size() != request.getQuestoesIds().size()) {
            throw new RuntimeException("Algumas questões não foram encontradas");
        }
        
        avaliacao.setTitulo(request.getTitulo());
        avaliacao.setTurma(request.getTurma());
        avaliacao.setNomeFaculdade(request.getNomeFaculdade());
        avaliacao.setLogoFaculdade(request.getLogoFaculdade());
        avaliacao.setQuestoes(questoes);
        
        return avaliacaoRepository.save(avaliacao);
    }
    
    public void deletarAvaliacao(Long id, Long professorId) {
        Avaliacao avaliacao = buscarPorId(id);
        
        // Se professorId não é null, verificar permissão (professor deletando)
        // Se professorId é null, permitir (admin deletando)
        if (professorId != null && avaliacao.getProfessor() != null && 
            !avaliacao.getProfessor().getId().equals(professorId)) {
            throw new RuntimeException("Você não tem permissão para deletar esta avaliação");
        }
        
        avaliacaoRepository.deleteById(id);
    }
    
    public void deletarAvaliacao(Long id) {
        avaliacaoRepository.deleteById(id);
    }
}
