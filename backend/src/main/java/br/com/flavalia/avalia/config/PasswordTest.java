package br.com.flavalia.avalia.config;

import org.springframework.boot.CommandLineRunner;

/**
 * ATENÇÃO: Este arquivo é apenas para testes em desenvolvimento
 * Remova ou desabilite em produção por questões de segurança
 * 
 * Para habilitar, descomente as anotações @Component e @Order
 * e os imports necessários
 */
// @Component
// @Order(2)
public class PasswordTest implements CommandLineRunner {

    // @Autowired
    // private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Código de teste desabilitado para produção
        // Descomente apenas em ambiente de desenvolvimento se necessário
        /*
        String senhaTexto = "admin123";
        String senhaHash = passwordEncoder.encode(senhaTexto);
        
        System.out.println("\n========== TESTE DE SENHA ==========");
        System.out.println("Senha em texto: " + senhaTexto);
        System.out.println("Senha hash gerada: " + senhaHash);
        System.out.println("Teste de validação: " + passwordEncoder.matches(senhaTexto, senhaHash));
        System.out.println("====================================\n");
        */
    }
}
