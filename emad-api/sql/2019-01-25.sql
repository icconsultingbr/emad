ALTER TABLE consulteaki.tb_servico ADD (metodosPacote VARCHAR(300));

CREATE TABLE
    consulteaki.tb_usuario_servico
    (
        id INT NOT NULL AUTO_INCREMENT,
        idServico INT NOT NULL,
        idUsuario BIGINT NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT tb_usuario_servico_fk_tb_servico FOREIGN KEY (idServico) REFERENCES
        consulteaki.tb_servico (id),
        CONSTRAINT tb_usuario_servico_fk_tb_usuario FOREIGN KEY (idUsuario) REFERENCES
        consulteaki.tb_usuario (id)
    )
    ENGINE=InnoDB DEFAULT CHARSET=utf8;