package br.com.flavalia.avalia.service;

import br.com.flavalia.avalia.model.Alternativa;
import br.com.flavalia.avalia.model.Avaliacao;
import br.com.flavalia.avalia.model.Questao;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
public class PdfService {
    
    private static final Color AZUL_FATEC = new Color(0, 51, 102);
    
    public byte[] gerarPdfAvaliacao(Avaliacao avaliacao) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter.getInstance(document, baos);
            
            document.open();
            
            // Cabeçalho
            adicionarCabecalho(document, avaliacao);
            
            // Linha separadora
            adicionarLinhaSeparadora(document, 15);
            
            // Campos do aluno
            adicionarCamposAluno(document);
            
            // Linha separadora
            adicionarLinhaSeparadora(document, 20);
            
            // Questões
            adicionarQuestoes(document, avaliacao);
            
            // Campos de assinatura
            adicionarCamposAssinatura(document);
            
            document.close();
            
            return baos.toByteArray();
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }
    }
    
    private void adicionarCabecalho(Document document, Avaliacao avaliacao) throws DocumentException {
        // Logo da faculdade (se fornecida)
        if (avaliacao.getLogoFaculdade() != null && !avaliacao.getLogoFaculdade().isEmpty()) {
            try {
                String base64Image = avaliacao.getLogoFaculdade();
                if (base64Image.contains(",")) {
                    base64Image = base64Image.split(",")[1];
                }
                byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                Image logo = Image.getInstance(imageBytes);
                logo.scaleToFit(60, 60);
                logo.setAlignment(Element.ALIGN_CENTER);
                document.add(logo);
                document.add(new Paragraph(" "));
            } catch (Exception e) {
                System.err.println("Erro ao adicionar logo: " + e.getMessage());
            }
        }
        
        // Título da instituição
        Font fontTitulo = new Font(Font.HELVETICA, 16, Font.BOLD, AZUL_FATEC);
        String nomeFaculdade = avaliacao.getNomeFaculdade() != null && !avaliacao.getNomeFaculdade().isEmpty() 
            ? avaliacao.getNomeFaculdade() 
            : "FATEC - Faculdade de Tecnologia";
        Paragraph titulo = new Paragraph(nomeFaculdade, fontTitulo);
        titulo.setAlignment(Element.ALIGN_CENTER);
        titulo.setSpacingBefore(5);
        document.add(titulo);
        
        // Nome da avaliação
        Font fontAvaliacao = new Font(Font.HELVETICA, 14, Font.BOLD);
        Paragraph nomeAvaliacao = new Paragraph(avaliacao.getTitulo(), fontAvaliacao);
        nomeAvaliacao.setAlignment(Element.ALIGN_CENTER);
        nomeAvaliacao.setSpacingBefore(8);
        nomeAvaliacao.setSpacingAfter(12);
        document.add(nomeAvaliacao);
        
        // Informações em uma linha compacta
        Font fontInfo = new Font(Font.HELVETICA, 9, Font.NORMAL);
        StringBuilder info = new StringBuilder();
        
        if (avaliacao.getTurma() != null && !avaliacao.getTurma().isEmpty()) {
            info.append("Turma: ").append(avaliacao.getTurma()).append("    ");
        }
        info.append("Professor(a): ").append(avaliacao.getProfessor().getNome()).append("    ");
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        info.append("Data: ").append(avaliacao.getCriadaEm().format(formatter));
        
        Paragraph infoCompleta = new Paragraph(info.toString(), fontInfo);
        infoCompleta.setAlignment(Element.ALIGN_LEFT);
        infoCompleta.setSpacingAfter(8);
        document.add(infoCompleta);
    }
    
    private void adicionarCamposAluno(Document document) throws DocumentException {
        Font fontLabel = new Font(Font.HELVETICA, 10, Font.BOLD);
        
        // Campo Nome
        Paragraph campoNome = new Paragraph("Nome: _________________________________________________________________", fontLabel);
        campoNome.setSpacingBefore(5);
        campoNome.setSpacingAfter(8);
        document.add(campoNome);
        
        // Campo RA
        Paragraph campoRA = new Paragraph("RA: ____________________________", fontLabel);
        campoRA.setSpacingAfter(8);
        document.add(campoRA);
    }
    
    private void adicionarCamposAssinatura(Document document) throws DocumentException {
        Font fontLabel = new Font(Font.HELVETICA, 9, Font.BOLD);
        Font fontObservacao = new Font(Font.HELVETICA, 8, Font.ITALIC, Color.GRAY);
        
        // Espaçamento antes da assinatura
        document.add(new Paragraph(" "));
        document.add(new Paragraph(" "));
        
        // Observação sobre vista de prova
        Paragraph observacao = new Paragraph("Após a vista de prova:", fontObservacao);
        observacao.setSpacingBefore(15);
        observacao.setSpacingAfter(10);
        document.add(observacao);
        
        // Campo de assinatura
        Paragraph campoAssinatura = new Paragraph("Assinatura: _________________________________________________________________", fontLabel);
        campoAssinatura.setSpacingAfter(8);
        document.add(campoAssinatura);
        
        Paragraph dataAssinatura = new Paragraph("Data: ____/____/________", fontLabel);
        document.add(dataAssinatura);
    }
    
    private void adicionarQuestoes(Document document, Avaliacao avaliacao) throws DocumentException {
        Font fontQuestao = new Font(Font.HELVETICA, 10, Font.BOLD);
        Font fontEnunciado = new Font(Font.HELVETICA, 9, Font.NORMAL);
        Font fontAlternativa = new Font(Font.HELVETICA, 9, Font.NORMAL);
        
        int numeroQuestao = 1;
        
        for (Questao questao : avaliacao.getQuestoes()) {
            // Número da questão
            Paragraph numQuestao = new Paragraph(
                String.format("Questão %d) [%s - %d ponto(s)]", 
                    numeroQuestao, 
                    questao.getMateria(),
                    questao.getPontuacao()),
                fontQuestao
            );
            numQuestao.setSpacingBefore(12);
            numQuestao.setSpacingAfter(5);
            document.add(numQuestao);
            
            // Enunciado
            Paragraph enunciado = new Paragraph(questao.getEnunciado(), fontEnunciado);
            enunciado.setSpacingAfter(6);
            enunciado.setIndentationLeft(10);
            document.add(enunciado);
            
            // Alternativas
            if (questao.getAlternativas() != null && !questao.getAlternativas().isEmpty()) {
                for (Alternativa alternativa : questao.getAlternativas()) {
                    Paragraph alt = new Paragraph(
                        String.format("%s) %s", alternativa.getLetra(), alternativa.getTextoAlternativa()),
                        fontAlternativa
                    );
                    alt.setSpacingBefore(3);
                    alt.setIndentationLeft(20);
                    document.add(alt);
                }
            }
            
            numeroQuestao++;
        }
        
        // Rodapé
        document.add(new Paragraph(" "));
        document.add(new Paragraph(" "));
        Font fontRodape = new Font(Font.HELVETICA, 7, Font.ITALIC, Color.GRAY);
        Paragraph rodape = new Paragraph("Gerado pelo Sistema Avalia FATEC", fontRodape);
        rodape.setAlignment(Element.ALIGN_CENTER);
        rodape.setSpacingBefore(10);
        document.add(rodape);
    }
    
    private void adicionarLinhaSeparadora(Document document, float espacamentoBefore) throws DocumentException {
        Paragraph espaco = new Paragraph(" ");
        espaco.setSpacingBefore(espacamentoBefore);
        document.add(espaco);
        
        // Linha horizontal usando caractere de sublinhado
        Font fontLinha = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.LIGHT_GRAY);
        Paragraph linha = new Paragraph("_".repeat(95), fontLinha);
        linha.setAlignment(Element.ALIGN_CENTER);
        document.add(linha);
    }
}
