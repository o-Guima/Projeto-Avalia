package br.com.flavalia.avalia.service;

import br.com.flavalia.avalia.dto.QuestaoRequest;
import br.com.flavalia.avalia.model.Alternativa;
import br.com.flavalia.avalia.model.Questao;
import br.com.flavalia.avalia.model.Usuario;
import br.com.flavalia.avalia.repository.QuestaoRepository;
import br.com.flavalia.avalia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QuestaoService {
    
    @Autowired
    private QuestaoRepository questaoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public List<Questao> listarTodasDoProfessor(Long professorId) {
        Usuario professor = usuarioRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        
        // Pega as matérias do professor
        List<String> materiasProfessor = professor.getMaterias().stream()
                .map(m -> m.getNome())
                .toList();
        
        if (materiasProfessor.isEmpty()) {
            // Se não tem matérias, retorna só as próprias questões
            return questaoRepository.findByProfessorId(professorId);
        }
        
        // Retorna questões de todos os professores que compartilham as mesmas matérias
        return questaoRepository.findByMateriasCompartilhadas(materiasProfessor);
    }
    
    public List<Questao> listarTodas() {
        return questaoRepository.findAll();
    }
    
    public Questao buscarPorId(Long id) {
        return questaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Questão não encontrada"));
    }
    
    @Transactional
    public Questao criarQuestao(QuestaoRequest request, Long professorId) {
        if (request.getAlternativas() == null || request.getAlternativas().size() < 2) {
            throw new RuntimeException("A questão deve ter no mínimo 2 alternativas");
        }
        
        Usuario professor = usuarioRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        
        Questao questao = new Questao();
        questao.setMateria(request.getMateria());
        questao.setTopico(request.getTopico());
        questao.setEnunciado(request.getEnunciado());
        questao.setPontuacao(request.getPontuacao() != null ? request.getPontuacao() : 1);
        questao.setProfessor(professor);
        
        if (request.getNivelDificuldade() != null) {
            questao.setNivelDificuldade(Questao.NivelDificuldade.valueOf(request.getNivelDificuldade()));
        }
        
        if (request.getTipoQuestao() != null) {
            questao.setTipoQuestao(Questao.TipoQuestao.valueOf(request.getTipoQuestao()));
        } else {
            questao.setTipoQuestao(Questao.TipoQuestao.MULTIPLA_ESCOLHA);
        }
        
        // Criar alternativas
        for (int i = 0; i < request.getAlternativas().size(); i++) {
            QuestaoRequest.AlternativaRequest altRequest = request.getAlternativas().get(i);
            Alternativa alternativa = new Alternativa();
            alternativa.setTextoAlternativa(altRequest.getTextoAlternativa());
            alternativa.setLetra(altRequest.getLetra() != null ? altRequest.getLetra() : String.valueOf((char) ('A' + i)));
            alternativa.setCorreta(altRequest.getCorreta() != null ? altRequest.getCorreta() : false);
            alternativa.setQuestao(questao);
            questao.getAlternativas().add(alternativa);
        }
        
        return questaoRepository.save(questao);
    }
    
    @Transactional
    public Questao atualizarQuestao(Long id, QuestaoRequest request, Long professorId) {
        Questao questao = buscarPorId(id);
        
        if (!questao.getProfessor().getId().equals(professorId)) {
            throw new RuntimeException("Você não tem permissão para editar esta questão");
        }
        
        if (request.getAlternativas() == null || request.getAlternativas().size() < 2) {
            throw new RuntimeException("A questão deve ter no mínimo 2 alternativas");
        }
        
        questao.setMateria(request.getMateria());
        questao.setTopico(request.getTopico());
        questao.setEnunciado(request.getEnunciado());
        questao.setPontuacao(request.getPontuacao() != null ? request.getPontuacao() : 1);
        
        if (request.getNivelDificuldade() != null) {
            questao.setNivelDificuldade(Questao.NivelDificuldade.valueOf(request.getNivelDificuldade()));
        }
        
        // Atualizar alternativas
        questao.getAlternativas().clear();
        for (int i = 0; i < request.getAlternativas().size(); i++) {
            QuestaoRequest.AlternativaRequest altRequest = request.getAlternativas().get(i);
            Alternativa alternativa = new Alternativa();
            alternativa.setTextoAlternativa(altRequest.getTextoAlternativa());
            alternativa.setLetra(altRequest.getLetra() != null ? altRequest.getLetra() : String.valueOf((char) ('A' + i)));
            alternativa.setCorreta(altRequest.getCorreta() != null ? altRequest.getCorreta() : false);
            alternativa.setQuestao(questao);
            questao.getAlternativas().add(alternativa);
        }
        
        return questaoRepository.save(questao);
    }
    
    @Transactional
    public void deletarQuestao(Long id, Long professorId) {
        Questao questao = buscarPorId(id);
        
        // Se professorId for null, é admin e pode deletar qualquer questão
        if (professorId != null && !questao.getProfessor().getId().equals(professorId)) {
            throw new RuntimeException("Você não tem permissão para deletar esta questão");
        }
        
        try {
            questaoRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Não é possível deletar esta questão pois ela está sendo usada em avaliações ativas.");
        }
    }
}
