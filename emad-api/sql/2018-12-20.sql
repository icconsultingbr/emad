CREATE TABLE consulteaki.tb_tipo_cobranca ( id INT NOT NULL AUTO_INCREMENT, nome VARCHAR(250) NOT NULL, situacao TINYINT DEFAULT '1' NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO tb_tipo_cobranca(nome, situacao) VALUES ('Pré-pago', 1);
INSERT INTO tb_tipo_cobranca(nome, situacao) VALUES ('Pós-pago', 1);


CREATE TABLE consulteaki.tb_plano (id INT NOT NULL AUTO_INCREMENT, nome VARCHAR(300) NOT NULL, situacao TINYINT(1) NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO tb_plano (nome, situacao) VALUES ('Veículo padrão',1);


CREATE TABLE consulteaki.tb_plano_servico ( id INT NOT NULL AUTO_INCREMENT, idPlano INT NOT NULL, servico INT NOT NULL, idTipoServico INT NOT NULL, situacao TINYINT DEFAULT '1' NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
DROP TABLE consulteaki.tb_lista_servico;
ALTER TABLE consulteaki.tb_empresa DROP FOREIGN KEY tb_empresa_fk_tb_lista;
ALTER TABLE consulteaki.tb_empresa DROP COLUMN idLista;
ALTER TABLE consulteaki.tb_empresa MODIFY COLUMN situacao TINYINT DEFAULT '1' NOT NULL;
drop table consulteaki.tb_lista;
ALTER TABLE consulteaki.tb_servico MODIFY COLUMN situacao TINYINT DEFAULT '1' NOT NULL;
ALTER TABLE consulteaki.tb_servico MODIFY COLUMN isPacote TINYINT DEFAULT '0' NOT NULL;
ALTER TABLE consulteaki.tb_tipo_servico MODIFY COLUMN situacao TINYINT DEFAULT '1';
ALTER TABLE consulteaki.tb_empresa ADD (idPlano INT);
ALTER TABLE consulteaki.tb_empresa ADD (idTipoCobranca INT);
ALTER TABLE consulteaki.tb_empresa MODIFY COLUMN idPlano INT NOT NULL;
ALTER TABLE consulteaki.tb_empresa MODIFY COLUMN idTipoCobranca INT NOT NULL;

ALTER TABLE consulteaki.tb_plano_servico DROP COLUMN idTipoServico;
ALTER TABLE consulteaki.tb_plano_servico DROP COLUMN situacao;
ALTER TABLE consulteaki.tb_plano_servico ADD (valor DECIMAL(10,2) NOT NULL);
ALTER TABLE consulteaki.tb_menu ADD (invisivel TINYINT(1) DEFAULT '0' NOT NULL);
ALTER TABLE consulteaki.tb_plano_servico ADD CONSTRAINT tb_plano_servico_fk_tb_plano FOREIGN KEY (idPlano) REFERENCES consulteaki.tb_plano (id);
ALTER TABLE consulteaki.tb_plano_servico ADD CONSTRAINT tb_plano_servico_fk_tb_servico FOREIGN KEY (idServico) REFERENCES consulteaki.tb_servico (id);
ALTER TABLE consulteaki.tb_empresa ADD CONSTRAINT tb_empresa_fk_tb_tipo_cobranca FOREIGN KEY (idTipoCobranca) REFERENCES consulteaki.tb_tipo_cobranca (id);
ALTER TABLE consulteaki.tb_empresa ADD CONSTRAINT tb_empresa_fk_tb_plano FOREIGN KEY (idPlano) REFERENCES consulteaki.tb_plano (id);
ALTER TABLE consulteaki.tb_servico ADD (entrada VARCHAR(500) DEFAULT 'abc' NOT NULL);
ALTER TABLE consulteaki.tb_servico MODIFY COLUMN entrada VARCHAR(500) NOT NULL;

ALTER TABLE consulteaki.tb_servico DROP FOREIGN KEY tb_servico_fk_tb_modelo;
ALTER TABLE consulteaki.tb_servico DROP COLUMN idModelo;
ALTER TABLE consulteaki.tb_servico ADD (modelo VARCHAR(250) DEFAULT 'a' NOT NULL);
ALTER TABLE consulteaki.tb_servico MODIFY COLUMN modelo VARCHAR(250) NOT NULL;

CREATE TABLE consulteaki.tb_fornecedor ( id INT NOT NULL AUTO_INCREMENT, nome VARCHAR(350) NOT NULL, cliente VARCHAR(250) NOT NULL, usuario VARCHAR(250) NOT NULL, senha VARCHAR(250) NOT NULL, situacao TINYINT(1) DEFAULT '1' NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE consulteaki.tb_servico ADD (idFornecedor INT DEFAULT '1');

INSERT INTO consulteaki.tb_fornecedor(nome, cliente, usuario, senha, situacao ) VALUES ( 'Nortix/Absoluta', 'absoluta', 'absoluta038', 'fev6e2z', 1 );
ALTER TABLE consulteaki.tb_servico MODIFY COLUMN idFornecedor INT NOT NULL;
ALTER TABLE consulteaki.tb_servico ADD CONSTRAINT tb_servico_fk_tb_fornecedor FOREIGN KEY (idFornecedor) REFERENCES consulteaki.tb_fornecedor (id);
DROP TABLE consulteaki.tb_modelo;

ALTER TABLE consulteaki.tb_fornecedor MODIFY COLUMN cliente VARCHAR(250);
ALTER TABLE consulteaki.tb_fornecedor MODIFY COLUMN usuario VARCHAR(250);
ALTER TABLE consulteaki.tb_fornecedor MODIFY COLUMN senha VARCHAR(250);
ALTER TABLE consulteaki.tb_servico ADD (aviso TEXT);

CREATE TABLE consulteaki.tb_consulta_log ( id BIGINT NOT NULL AUTO_INCREMENT, nome VARCHAR(250) NOT NULL, idTipoServico INT NOT NULL, idServico INT NOT NULL, idEmpresa INT NOT NULL, idUsuario INT NOT NULL, ip VARCHAR(60) NOT NULL, dataRegistro DATETIME NOT NULL, campo VARCHAR(150) NOT NULL, valor VARCHAR(150) NOT NULL, resposta TEXT, respostaCompleta TEXT, PRIMARY KEY (id) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE consulteaki.tb_empresa ADD (limiteValor DECIMAL(10,2));
CREATE TABLE consulteaki.tb_extrato ( id BIGINT NOT NULL AUTO_INCREMENT, idTipoMovimento INT NOT NULL, idEmpresa INT NOT NULL, valor DECIMAL(10,2) NOT NULL, idUsuario INT NOT NULL, descricao VARCHAR(100) NOT NULL, saldo DECIMAL(10,2) NOT NULL, idConsultaLog INT NOT NULL, dataRegistro DATETIME NOT NULL, ip VARCHAR(30) NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE consulteaki.tb_tipo_movimento ( id INT NOT NULL AUTO_INCREMENT, nome VARCHAR(150) NOT NULL, PRIMARY KEY (id) ) ENGINE=InnoDB DEFAULT CHARSET=utf8
INSERT INTO consulteaki.tb_tipo_movimento( nome ) VALUES ( 'Entrada' ),( 'Saída');

ALTER TABLE consulteaki.tb_extrato MODIFY COLUMN descricao VARCHAR(100);
ALTER TABLE consulteaki.tb_extrato MODIFY COLUMN idConsultaLog INT;
ALTER TABLE consulteaki.tb_tipo_movimento ADD (situacao TINYINT(1) DEFAULT '1' NOT NULL);
ALTER TABLE consulteaki.tb_tipo_movimento MODIFY COLUMN situacao TINYINT(1) NOT NULL;
ALTER TABLE consulteaki.tb_empresa ADD (dataVencimento INT);
ALTER TABLE consulteaki.tb_extrato ADD (saldoCusto DECIMAL(10,2) DEFAULT '0.00' NOT NULL);
ALTER TABLE consulteaki.tb_usuario ADD (hash VARCHAR(350));
ALTER TABLE consulteaki.tb_usuario DROP COLUMN hash;

ALTER TABLE consulteaki.tb_consulta_log MODIFY COLUMN idEmpresa BIGINT NOT NULL;
ALTER TABLE consulteaki.tb_consulta_log MODIFY COLUMN idUsuario BIGINT NOT NULL;
ALTER TABLE consulteaki.tb_consulta_log ADD CONSTRAINT tb_consulta_log_fk_tb_tipo_servico FOREIGN KEY (idTipoServico) REFERENCES consulteaki.tb_tipo_servico (id);
ALTER TABLE consulteaki.tb_consulta_log ADD CONSTRAINT tb_consulta_log_fk_tb_servico FOREIGN KEY (idServico) REFERENCES consulteaki.tb_servico (id);
ALTER TABLE consulteaki.tb_consulta_log ADD CONSTRAINT tb_consulta_log_fk_tb_empresa FOREIGN KEY (idEmpresa) REFERENCES consulteaki.tb_empresa (id);
ALTER TABLE consulteaki.tb_consulta_log ADD CONSTRAINT tb_consulta_log_fk_tb_usuario FOREIGN KEY (idUsuario) REFERENCES consulteaki.tb_usuario (id);
ALTER TABLE consulteaki.tb_tipo_usuario ADD (situacao TINYINT DEFAULT '1' NOT NULL);
ALTER TABLE consulteaki.tb_plano_servico CHANGE servico idServico INT NOT NULL;


/-- 14/01/2019 --/

ALTER TABLE consulteaki.tb_usuario ADD (ultimoLogin DATETIME);
ALTER TABLE consulteaki.tb_servico ADD (imagem VARCHAR(300));
ALTER TABLE consulteaki.tb_servico ADD (metodo VARCHAR(300));
ALTER TABLE consulteaki.tb_notificacao MODIFY COLUMN descricao TEXT NOT NULL;