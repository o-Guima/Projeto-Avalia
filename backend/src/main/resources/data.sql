-- Script de inicialização do banco de dados
-- Senha padrão para admin: admin123 (hash BCrypt)

INSERT IGNORE INTO usuarios (id, nome, login, email, senha, perfil, ativo, criado_em) 
VALUES (1, 'Administrador', 'admin', 'admin@fatec.sp.gov.br', 
        '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 
        'ADMIN', true, NOW());
