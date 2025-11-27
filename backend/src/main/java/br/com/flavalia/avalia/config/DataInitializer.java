package br.com.flavalia.avalia.config;

import br.com.flavalia.avalia.model.Usuario;
import br.com.flavalia.avalia.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Inicializador de dados padrão do sistema.
 * Cria o usuário administrador padrão se não existir.
 * 
 * ATENÇÃO: Em produção, altere a senha padrão após o primeiro login!
 */
@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    private static final String DEFAULT_ADMIN_LOGIN = "admin";
    private static final String DEFAULT_ADMIN_PASSWORD = "admin123";
    private static final String DEFAULT_ADMIN_EMAIL = "admin@fatec.sp.gov.br";

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            initializeAdminUser();
        } catch (Exception e) {
            logger.error("Erro ao inicializar dados do sistema", e);
        }
    }
    
    private void initializeAdminUser() {
        if (usuarioRepository.existsByLogin(DEFAULT_ADMIN_LOGIN)) {
            logger.info("Usuário admin já existe no banco de dados");
            return;
        }
        
        Usuario admin = createAdminUser();
        usuarioRepository.save(admin);
        
        logger.info("========================================");
        logger.info("Usuário administrador criado com sucesso!");
        logger.info("Login: {}", DEFAULT_ADMIN_LOGIN);
        logger.warn("Senha padrão: {} - ALTERE EM PRODUÇÃO!", DEFAULT_ADMIN_PASSWORD);
        logger.info("========================================");
    }
    
    private Usuario createAdminUser() {
        Usuario admin = new Usuario();
        admin.setNome("Administrador");
        admin.setLogin(DEFAULT_ADMIN_LOGIN);
        admin.setEmail(DEFAULT_ADMIN_EMAIL);
        admin.setSenha(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
        admin.setPerfil(Usuario.Perfil.ADMIN);
        admin.setAtivo(true);
        admin.setCriadoEm(LocalDateTime.now());
        return admin;
    }
}
