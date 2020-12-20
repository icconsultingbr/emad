module.exports = function (app) {
  let multipart = require("connect-multiparty");
  let multipartMiddleware = multipart({ uploadDir: "./img/profile" });

  const FL_CADASTRADO = 1;

  app.get("/usuario", function (req, res) {
    let usuario = req.usuario;
    let addFilter = req.query;
    let util = new app.util.Util();
    let errors = [];

    if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
      lista(addFilter, res).then(function (resposne) {
        res.status(200).json(resposne);
        return;
      });
    } else if (usuario.idTipoUsuario == util.ADMIN) {
      listaPorEmpresa(usuario.id, res).then(function (resposne) {
        res.status(200).json(resposne);
        return;
      });
    } else {
      errors = util.customError(errors, "header", "Não autorizado!", "acesso");
      res.status(401).send(errors);
    }
  });

  app.get("/usuario/:id(\\d+)", function (req, res) {
    let usuario = req.usuario;
    let id = req.params.id;
    let util = new app.util.Util();
    let errors = [];

    if (usuario.idTipoUsuario == util.SUPER_ADMIN || id == usuario.id) {
      buscaPorId(id, res).then(function (response) {
        buscarEstabelecimentosPorUsuario(id, res).then(function (response2) {
          response.estabelecimentos = response2;

          delete response.senha;
          let usuario = {};
          usuario.usuario = response;

          res.status(200).json(usuario);
          return;
        });
      });
    } else if (usuario.idTipoUsuario == util.ADMIN) {
      buscaUsuarioPorEmpresa(usuario, id, res).then(function (response) {
        if (response.idTipoUsuario == util.SUPER_ADMIN) {
          errors = util.customError(
            errors,
            "header",
            "Não autorizado!",
            "acesso"
          );
          res.status(401).send(errors);
          return;
        }

        let usuario = {};
        usuario.usuario = response;

        res.status(200).json(usuario);
        return;
      });
    } else {
      errors = util.customError(errors, "header", "Não autorizado!", "acesso");
      res.status(401).send(errors);
    }
  });

  app.post("/usuario", function (req, res) {
    let usuario = req.usuario;
    let cadastro = req.body;
    delete cadastro.usuario;
    let util = new app.util.Util();
    let mail = new app.util.Mail();
    let token = "";
    let errors = [];

    let estabelecimentos = cadastro.estabelecimentos;
    let arrEstabelecimentos = [];
    let arrEstabelecimentosDim = [];

    if (
      usuario.idTipoUsuario == util.SUPER_ADMIN ||
      (usuario.idTipoUsuario == util.ADMIN &&
        cadastro.idTipoUsuario != util.SUPER_ADMIN)
    ) {
      cadastro.cpf = cadastro.cpf.replace(/[.-]/g, "");
      cadastro.celular = cadastro.celular.replace(/[() -]/g, "");

      req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
      req
        .assert("sexo")
        .notEmpty()
        .withMessage("Sexo é um campo obrigatório")
        .isLength({ min: 1, max: 1 })
        .withMessage("Sexo deve ter apenas um caractere;");
      req
        .assert("idTipoUsuario")
        .notEmpty()
        .withMessage("Grupo de usuário é um campo obrigatório");
      req
        .assert("nomeMae")
        .notEmpty()
        .withMessage("Nome da mãe é um campo obrigatório;");
      req
        .assert("email")
        .notEmpty()
        .withMessage("Email é um campo obrigatório;")
        .isEmail()
        .trim()
        .withMessage("Insira um e-mail válido;");
      req
        .assert("cpf")
        .isLength({ min: 11, max: 11 })
        .withMessage("CPF deve conter 11 caracteres;")
        .custom(util.cpfValido)
        .withMessage("CPF inválido;");
      req
        .assert("celular")
        .notEmpty()
        .withMessage("Telefone celular é um campo obrigatório;")
        .isLength({ min: 10, max: 11 })
        .withMessage("Telefone celular inválido;");
      req
        .assert("dataNascimento")
        .notEmpty()
        .withMessage("Data de nascimento deve ser preenchida;")
        .custom(util.isValidDate)
        .withMessage("Data de nascimento inválida;");
      //req.assert("senha").notEmpty().withMessage("A senha é um campo obrigatório;").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/).withMessage("A senha deve conter pelo menos 8 caracteres, uma letra maiúscula e um número;");
      req
        .assert("senha")
        .notEmpty()
        .withMessage("A senha é um campo obrigatório;")
        .matches(/^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/)
        .withMessage(
          "A senha deve conter pelo menos 8 caracteres, letras e números;"
        );
      req
        .assert("confirmaSenha")
        .notEmpty()
        .withMessage("A confirmação da senha é um campo obrigatório;")
        .equals(cadastro.senha)
        .withMessage("A senha e confirmação devem ser idênticas;");

      if (cadastro.idTipoUsuario != util.SUPER_ADMIN)
        req
          .assert("estabelecimentos")
          .notEmpty()
          .withMessage(
            "Selecione o(s) estabelecimento(s) vinculado(s) ao usuário"
          );

      errors = req.validationErrors();

      if (errors) {
        res.status(400).send(errors);
        return;
      }

      cadastro.situacao = FL_CADASTRADO;
      cadastro.dataCriacao = new Date();
      cadastro.dataNascimento = util.dateToISO(cadastro.dataNascimento);

      let hash = util.createHashEmail(cadastro.email);
      cadastro.hash = hash;

      let senha = util.hashPassword(cadastro.senha);
      cadastro.senha = senha;
      delete cadastro.confirmaSenha;
      delete cadastro.estabelecimentos;
      cadastro.tentativasSenha = 0;

      buscaPorEmail(cadastro)
        .then(function (responseEmail) {
          if (responseEmail.length > 0) {
            errors = util.customError(
              errors,
              "email",
              "Já existe um usuário cadastrado com este e-mail!",
              cadastro.email
            );
            //console.log('Email já existe'+errors);
            res.status(404).json(errors);
            return;
          } else {
            return buscaPorCPF(cadastro);
          }
        })
        .then(function (responseCPF) {
          if (responseCPF.length > 0) {
            errors = util.customError(
              errors,
              "cpf",
              "Já existe um usuário cadastrado com este cpf!",
              cadastro.email
            );
            //console.log('CPF já existe'+errors);
            res.status(404).json(errors);
            return;
          } else {
            return gravaUsuario(cadastro, res);
          }
        })
        .then(function (cad) {
          cadastro.id = cad.insertId;

          for (var i = 0; i < estabelecimentos.length; i++) {
            arrEstabelecimentos.push(
              "(" + cadastro.id + ", " + estabelecimentos[i].id + ")"
            );
          }

          deletaEstabelecimentosPorUsuario(cadastro.id, res).then(function (
            response3
          ) {
            atualizaEstabelecimentosPorUsuario(arrEstabelecimentos, res).then(
              function (response4) {
                delete cadastro.senha;
                delete cadastro.hash;

                token = util.createWebToken(app, req, cadastro);
                cadastro.token = token;

                buscaEstabelecimentoPorProfissionalParaDim(
                  cadastro.id,
                  res
                ).then(function (response5) {
                  estabelecimentosDIM = response5;
                  for (var i = 0; i < estabelecimentosDIM.length; i++) {
                    arrEstabelecimentosDim.push(
                      "(" +
                      estabelecimentosDIM[i].idUnidadeCorrespondenteDim +
                      ", " +
                      estabelecimentosDIM[i].idProfissionalCorrespondenteDim +
                      ", NOW(), 6)"
                    );
                  }

                  if (arrEstabelecimentosDim.length > 0) {
                    atualizaEstabelecimentosPorProfissionalDim(
                      cadastro.id,
                      arrEstabelecimentosDim,
                      res
                    ).then(function (response6) {
                      res.status(201).json(cadastro);
                      return;
                    });
                  } else {
                    res.status(201).json(cadastro);
                    return;
                  }
                });
              }
            );
          });
        });
    } else {
      errors = util.customError(errors, "header", "Não autorizado!", "acesso");
      res.status(401).send(errors);
    }
  });

  app.post("/usuario/alterar-senha", function (req, res) {
    let object = {};
    object.msg = "success";
    res.status(200).json(object);
    return;
  });

  app.put("/usuario", function (req, res) {
    let usuario = req.usuario;
    let cadastro = req.body;
    let id = cadastro.id;

    let estabelecimentos = cadastro.estabelecimentos;
    let arrEstabelecimentos = [];
    let arrEstabelecimentosDim = [];

    let util = new app.util.Util();
    let token = "";
    let errors = [];

    if (
      usuario.idTipoUsuario == util.SUPER_ADMIN ||
      usuario.id == cadastro.id ||
      (usuario.idTipoUsuario == util.ADMIN &&
        cadastro.idTipoUsuario != util.SUPER_ADMIN)
    ) {
      cadastro.cpf = cadastro.cpf.replace(/[.-]/g, "");
      cadastro.celular = cadastro.celular.replace(/[() -]/g, "");

      req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
      req
        .assert("sexo")
        .notEmpty()
        .withMessage("Sexo é um campo obrigatório")
        .isLength({ min: 1, max: 1 })
        .withMessage("Sexo deve ter apenas um caractere;");
      req
        .assert("idTipoUsuario")
        .notEmpty()
        .withMessage("Grupo de usuário é um campo obrigatório");
      req
        .assert("nomeMae")
        .notEmpty()
        .withMessage("Nome da mãe é um campo obrigatório;");
      req
        .assert("email")
        .notEmpty()
        .withMessage("Email é um campo obrigatório;")
        .isEmail()
        .trim()
        .withMessage("Insira um e-mail válido;");
      req
        .assert("cpf")
        .isLength({ min: 11, max: 11 })
        .withMessage("CPF deve conter 11 caracteres;")
        .custom(util.cpfValido)
        .withMessage("CPF inválido;");
      req
        .assert("celular")
        .notEmpty()
        .withMessage("Telefone celular é um campo obrigatório;")
        .isLength({ min: 10, max: 11 })
        .withMessage("Telefone celular inválido;");
      req
        .assert("dataNascimento")
        .notEmpty()
        .withMessage("Data de nascimento deve ser preenchida;")
        .custom(util.isValidDate)
        .withMessage("Data de nascimento inválida;");

      if (cadastro.idTipoUsuario != util.SUPER_ADMIN)
        req
          .assert("estabelecimentos")
          .notEmpty()
          .withMessage(
            "Selecione o(s) estabelecimento(s) vinculado(s) ao usuário"
          );

      errors = req.validationErrors();

      if (errors) {
        res.status(400).send(errors);
        return;
      }

      cadastro.dataNascimento = util.dateToISO(cadastro.dataNascimento);
      cadastro.tentativasSenha = 0;
      delete cadastro.estabelecimentos;

      delete cadastro.senha;
      delete cadastro.confirmaSenha;

      buscaPorEmail(cadastro)
        .then(function (responseEmail) {
          if (responseEmail.length > 0) {
            errors = util.customError(
              errors,
              "email",
              "Este e-mail não está disponível para cadastro!",
              cadastro.email
            );
            //console.log('Email já existe'+errors);
            res.status(404).json(errors);
            return;
          } else {
            return buscaPorCPF(cadastro);
          }
        })
        .then(function (responseCPF) {
          if (responseCPF.length > 0) {
            errors = util.customError(
              errors,
              "cpf",
              "Já existe um usuário cadastrado com este cpf!",
              cadastro.cpf
            );
            //console.log('CPF já existe'+errors);
            res.status(404).json(errors);
            return;
          } else {
            return gravaUsuario(cadastro, res);
          }
        })
        .then(function (cad) {
          for (var i = 0; i < estabelecimentos.length; i++) {
            arrEstabelecimentos.push(
              "(" + id + ", " + estabelecimentos[i].id + ")"
            );
          }

          delete cadastro.senha;

          deletaEstabelecimentosPorUsuario(id, res).then(function (response3) {
            atualizaEstabelecimentosPorUsuario(arrEstabelecimentos, res).then(
              function (response4) {
                delete cadastro.hash;
                cadastro.id = cad.insertId;
                token = util.createWebToken(app, req, cadastro);
                cadastro.token = token;

                console.log("cadastro alterado!");
                res.location("/usuario/update/" + cad.id);

                buscaEstabelecimentoPorProfissionalParaDim(id, res).then(
                  function (response5) {
                    estabelecimentosDIM = response5;
                    for (var i = 0; i < estabelecimentosDIM.length; i++) {
                      arrEstabelecimentosDim.push(
                        "(" +
                        estabelecimentosDIM[i].idUnidadeCorrespondenteDim +
                        ", " +
                        estabelecimentosDIM[i]
                          .idProfissionalCorrespondenteDim +
                        ", NOW(), 6)"
                      );
                    }

                    if (arrEstabelecimentosDim.length > 0) {
                      atualizaEstabelecimentosPorProfissionalDim(
                        id,
                        arrEstabelecimentosDim,
                        res
                      ).then(function (response6) {
                        res.status(201).json(cadastro);
                        return;
                      });
                    } else {
                      res.status(201).json(cadastro);
                      return;
                    }
                  }
                );
              }
            );
          });
        });
    } else {
      errors = util.customError(errors, "header", "Não autorizado!", "acesso");
      res.status(401).send(errors);
    }
  });

  app.get("/usuario/usuario-sem-profissional", function (req, res) {
    let usuario = req.usuario;
    let idProfissional = req.query.id;
    let idestabelecimento = req.query.idEstabelecimento;

    listaUsuarioSemProfissional(idProfissional, idestabelecimento, res).then(
      function (resposne) {
        res.status(200).json(resposne);
        return;
      }
    );
  });

  app.get("/usuario/validaToken", function (req, res) {
    res.status(200).json({ success: true });
  });

  app.get("/usuario/tipo-usuario/:id(\\d+)", function (req, res) {
    let usuario = req.usuario;
    let idTipoUsuario = req.params.id;
    let util = new app.util.Util();
    let errors = [];

    listaPorTipoUsuario(idTipoUsuario, res).then(function (resposne) {
      res.status(200).json(resposne);
      return;
    });
  });

  app.put("/usuario/redefinir-senha", function (req, res) {
    var util = new app.util.Util();
    var usuario = req.usuario;
    var body = req.body;
    let errors = [];

    req
      .assert("senhaAtual")
      .notEmpty()
      .withMessage("A senha atual é um campo obrigatório;");

    //ANTES OBRIGAVA UMA LETRA MAIÚSCULA
    //req.assert("novaSenha").notEmpty().withMessage("A nova senha é um campo obrigatório;").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/).withMessage("A nova senha deve conter pelo menos 8 caracteres, uma letra maiúscula e um número;");

    req
      .assert("novaSenha")
      .notEmpty()
      .withMessage("A nova senha é um campo obrigatório;")
      .matches(/^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/)
      .withMessage(
        "A nova senha deve conter pelo menos 8 caracteres, letras e números;"
      );
    req
      .assert("confirmarNovaSenha")
      .notEmpty()
      .withMessage("A confirmação da senha é um campo obrigatório;")
      .equals(body.novaSenha)
      .withMessage("A nova senha e confirmação devem ser idênticas;");

    errors = req.validationErrors();

    if (errors) {
      res.status(400).send(errors);
      return;
    }

    buscaPorId(usuario.id, res).then(function (response) {
      usuario = response;

      if (util.checkPassword(body.senhaAtual, usuario.senha)) {
        var senha = util.hashPassword(body.novaSenha);
        usuario.senha = senha;
        var connection = app.dao.ConnectionFactory();
        var usuarioDAO = new app.dao.UsuarioDAO(connection);

        usuarioDAO.hashSenha(usuario, function (exception, result) {
          if (exception) {
            res.status(500).send(exception);
            return;
          } else {
            res.status(200).json(result);
            return;
          }
        });
      } else {
        errors = util.customError(
          errors,
          "data",
          "As senhas não conferem",
          "usuarios"
        );
        res.status(500).send(errors);
        return;
      }
    });
  });

  app.put("/usuario/redefinir-senha-admin", function (req, res) {
    var util = new app.util.Util();
    var body = req.body;
    let errors = [];

    req
      .assert("novaSenha")
      .notEmpty()
      .withMessage("A nova senha é um campo obrigatório;")
      .matches(/^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/)
      .withMessage(
        "A nova senha deve conter pelo menos 8 caracteres, letras e números;"
      );
    req
      .assert("confirmarNovaSenha")
      .notEmpty()
      .withMessage("A confirmação da senha é um campo obrigatório;")
      .equals(body.novaSenha)
      .withMessage("A nova senha e confirmação devem ser idênticas;");

    errors = req.validationErrors();

    if (errors) {
      res.status(400).send(errors);
      return;
    }

    buscaPorId(body.id, res).then(function (response) {
      usuario = response;
      var senha = util.hashPassword(body.novaSenha);
      usuario.senha = senha;
      var connection = app.dao.ConnectionFactory();
      var usuarioDAO = new app.dao.UsuarioDAO(connection);

      usuarioDAO.hashSenha(usuario, function (exception, result) {
        if (exception) {
          res.status(500).send(exception);
          return;
        } else {
          res.status(200).json(result);
          return;
        }
      });
    });
  });

  app.delete("/usuario/:id", function (req, res) {
    var util = new app.util.Util();
    let usuario = req.usuario;
    let errors = [];
    let id = req.params.id;
    let obj = {};
    obj.id = id;

    if (usuario.id != id) {
      buscaPorId(id, res).then(function (responseUsuario) {
        if (responseUsuario.id) {
          let usuarioDelete = responseUsuario;

          if (
            usuario.idTipoUsuario == util.SUPER_ADMIN ||
            usuario.idTipoUsuario == util.ADMIN
          ) {
            deletaPorId(id, res).then(function (response) {
              res.status(200).json(obj);
              return;
            });
          } else {
            errors = util.customError(
              errors,
              "header",
              "Não autorizado!",
              "acesso"
            );
            res.status(401).send(errors);
          }
        } else {
          errors = util.customError(
            errors,
            "header",
            "Usuário não encontrado",
            "acesso"
          );
          res.status(401).send(errors);
        }
      });
    } else {
      errors = util.customError(
        errors,
        "header",
        "Você não pode apagar seu próprio usuário",
        "acesso"
      );
      res.status(401).send(errors);
    }
  });

  async function buscaPorEmail(usuario) {
    const connection = await app.dao.connections.EatendConnection.connection();
    let usuarioDAO = new app.dao.UsuarioDAO(connection);

    try {
      return await usuarioDAO.buscaPorEmail(usuario);
    } catch (error) {
      console.log("Erro ao carregar usuario por email (" + usuario.email + "), exception: " + exception);
      return 'Erro ao carregar usuário por email';
    }
    finally{
      await connection.close();
    }
  }

  async function buscaPorCPF(usuario) {
    const connection = await app.dao.connections.EatendConnection.connection();
    let usuarioDAO = new app.dao.UsuarioDAO(connection);

    try {
      return await usuarioDAO.buscaPorCPF(usuario);
    } catch (error) {
      console.log("Erro ao carregar usuario por CPF (" + usuario.cpf + "), exception: " + exception);
      return 'Erro ao carregar usuário por CPF';
    }
    finally{
      await connection.close();
    }
  }

  function gravaUsuario(cadastro, res) {
    let q = require("q");
    let d = q.defer();
    let connection = app.dao.ConnectionFactory();
    let usuarioDAO = new app.dao.UsuarioDAO(connection);

    if (typeof cadastro.id != "undefined" && cadastro.id != null) {
      let id = cadastro.id;
      delete cadastro.id;

      usuarioDAO.atualiza(cadastro, id).then(result => {
        d.resolve(result);
      }).catch(exception => {
        console.log("Erro ao inserir no banco de dados", exception);
        res.status(500).send(exception);
        d.reject(exception);
      });
    } else {
      usuarioDAO.salva(cadastro, function (exception, result) {
        if (exception) {
          console.log("Erro ao inserir no banco de dados", exception);
          res.status(500).send(exception);
          d.reject(exception);
          return;
        } else {
          d.resolve(result);
        }
      });
    }

    return d.promise;
  }

  function atualizaFoto(cadastro, res) {
    let util = new app.util.Util();
    let q = require("q");
    let d = q.defer();
    let connection = app.dao.ConnectionFactory();
    let usuarioDAO = new app.dao.UsuarioDAO(connection);

    usuarioDAO.atualizaFoto(cadastro, function (exception, result) {
      if (exception) {
        console.log("Erro ao inserir a foto no banco de dados", exception);
        res.status(500).send(exception);
        d.reject(exception);
        return;
      } else {
        d.resolve(result);
      }
    });
    return d.promise;
  }

  function atualizaCelular(cadastro, res) {
    let util = new app.util.Util();
    let q = require("q");
    let d = q.defer();
    let connection = app.dao.ConnectionFactory();
    let usuarioDAO = new app.dao.UsuarioDAO(connection);

    usuarioDAO.atualizaCelular(cadastro, function (exception, result) {
      if (exception) {
        console.log("Erro ao atualizar o celular no banco de dados", exception);
        res.status(500).send(exception);
        d.reject(exception);
        return;
      } else {
        d.resolve(result);
      }
    });
    return d.promise;
  }

  function lista(addFilter, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();
    var connection = app.dao.ConnectionFactory();
    var usuarioDAO = new app.dao.UsuarioDAO(connection);

    var errors = [];

    usuarioDAO.lista(addFilter, function (exception, result) {
      if (exception) {
        d.reject(exception);
        console.log(exception);
        errors = util.customError(
          errors,
          "data",
          "Erro ao acessar os dados",
          "usuarios"
        );
        res.status(500).send(errors);
        return;
      } else {
        d.resolve(result);
      }
    });
    return d.promise;
  }

  function listaPorEmpresa(usuario, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();
    var connection = app.dao.ConnectionFactory();
    var usuarioDAO = new app.dao.UsuarioDAO(connection);

    var errors = [];

    usuarioDAO.listaPorEmpresa(usuario, function (exception, result) {
      if (exception) {
        d.reject(exception);
        console.log(exception);
        errors = util.customError(
          errors,
          "data",
          "Erro ao acessar os dados",
          "usuarios"
        );
        res.status(500).send(errors);
        return;
      } else {
        d.resolve(result);
      }
    });
    return d.promise;
  }

  function listaUsuarioSemProfissional(idProfissional, idestabelecimento, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();
    var connection = app.dao.ConnectionFactory();
    var usuarioDAO = new app.dao.UsuarioDAO(connection);

    var errors = [];

    usuarioDAO.listaUsuarioSemProfissional(
      idProfissional,
      idestabelecimento,
      function (exception, result) {
        if (exception) {
          d.reject(exception);
          console.log(exception);
          errors = util.customError(
            errors,
            "data",
            "Erro ao acessar os dados",
            "usuarios"
          );
          res.status(500).send(errors);
          return;
        } else {
          d.resolve(result);
        }
      }
    );
    return d.promise;
  }

  function listaPorTipoUsuario(idTipoUsuario, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();
    var connection = app.dao.ConnectionFactory();
    var usuarioDAO = new app.dao.UsuarioDAO(connection);

    var errors = [];

    usuarioDAO.listaPorTipoUsuario(idTipoUsuario, function (exception, result) {
      if (exception) {
        d.reject(exception);
        console.log(exception);
        errors = util.customError(
          errors,
          "data",
          "Erro ao acessar os dados",
          "usuarios"
        );
        res.status(500).send(errors);
        return;
      } else {
        d.resolve(result);
      }
    });
    return d.promise;
  }

  function buscaPorId(id, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();
    var connection = app.dao.ConnectionFactory();
    var usuarioDAO = new app.dao.UsuarioDAO(connection);

    var errors = [];

    usuarioDAO.buscaPorId(id, function (exception, result) {
      if (exception) {
        d.reject(exception);
        console.log(exception);
        errors = util.customError(
          errors,
          "data",
          "Erro ao acessar os dados",
          "usuarios"
        );
        res.status(500).send(errors);
        return;
      } else {
        d.resolve(result[0]);
      }
    });
    return d.promise;
  }

  function buscaUsuarioPorEmpresa(usuario, id, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();
    var connection = app.dao.ConnectionFactory();
    var usuarioDAO = new app.dao.UsuarioDAO(connection);

    var errors = [];

    usuarioDAO.buscaUsuarioPorEmpresaId(usuario, id, function (
      exception,
      result
    ) {
      if (exception) {
        d.reject(exception);
        console.log(exception);
        errors = util.customError(
          errors,
          "data",
          "Erro ao acessar os dados",
          "usuarios"
        );
        res.status(500).send(errors);
        return;
      } else {
        d.resolve(result[0]);
      }
    });
    return d.promise;
  }

  function buscaPremissaCompraPorId(id, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();
    var connection = app.dao.ConnectionFactory();
    var instalacaoDAO = new app.dao.InstalacaoDAO(connection);

    var errors = [];

    instalacaoDAO.buscaPremissaCompraPorId(id, function (exception, result) {
      if (exception) {
        d.reject(exception);
        console.log(exception);
        errors = util.customError(
          errors,
          "data",
          "Erro ao acessar os dados",
          "usuarios"
        );
        res.status(500).send(errors);
        return;
      } else {
        d.resolve(result[0]);
      }
    });
    return d.promise;
  }

  function listaMenuPorTipoUsuario(idTipoUsuario, res) {
    let q = require("q");
    let d = q.defer();
    let util = new app.util.Util();

    let connection = app.dao.ConnectionFactory();
    let menuDAO = new app.dao.MenuDAO(connection);
    let errors = [];

    menuDAO.listaRotasPorTipoUsuario(idTipoUsuario, function (
      exception,
      result
    ) {
      if (exception) {
        d.reject(exception);
        errors = util.customError(
          errors,
          "data",
          "Erro ao acessar os dados",
          "menu"
        );
        res.status(500).send(errors);
        return;
      } else {
        d.resolve(result);
      }
    });
    return d.promise;
  }

  function checaExtrato(objeto, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();

    var connection = app.dao.ConnectionFactory();
    var objDAO = new app.dao.ExtratoDAO(connection);
    var errors = [];

    objDAO.checaSaldo(objeto, function (exception, result) {
      if (exception) {
        d.reject(exception);
        console.log(exception);
        errors = util.customError(
          errors,
          "data",
          "Erro ao acessar os dados",
          "extrato"
        );
        res.status(500).send(errors);
        return;
      } else {
        d.resolve(result[0]);
      }
    });
    return d.promise;
  }

  function deletaPorId(id, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();

    var connection = app.dao.ConnectionFactory();
    var objDAO = new app.dao.UsuarioDAO(connection);
    var errors = [];

    objDAO.deletaPorId(id, function (exception, result) {
      if (exception) {
        d.reject(exception);
        errors = util.customError(
          errors,
          "data",
          "Erro ao remover os dados",
          "usuario"
        );
        res.status(500).send(errors);
        return;
      } else {
        d.resolve(result[0]);
      }
    });
    return d.promise;
  }

  function deletaEstabelecimentosPorUsuario(id, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();

    var connection = app.dao.ConnectionFactory();
    var objDAO = new app.dao.EstabelecimentoUsuarioDAO(connection);
    var errors = [];

    objDAO.deletaEstabelecimentosPorUsuario(id, function (exception, result) {
      if (exception) {
        d.reject(exception);
        console.log(exception);
        errors = util.customError(
          errors,
          "data",
          "Erro ao editar os dados",
          "apagar permissoes"
        );
        res.status(500).send(errors);
        return;
      } else {
        d.resolve(result);
      }
    });
    return d.promise;
  }

  function atualizaEstabelecimentosPorUsuario(estabelecimentos, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();

    var connection = app.dao.ConnectionFactory();
    var objDAO = new app.dao.EstabelecimentoUsuarioDAO(connection);
    var errors = [];

    if (estabelecimentos.length > 0) {
      objDAO.atualizaEstabelecimentosPorUsuario(estabelecimentos, function (
        exception,
        result
      ) {
        if (exception) {
          d.reject(exception);
          console.log(exception);
          errors = util.customError(
            errors,
            "data",
            "Erro ao editar os dados",
            "apagar permissoes"
          );
          res.status(500).send(errors);
          return;
        } else {
          d.resolve(result);
        }
      });
    } else d.resolve(null);
    return d.promise;
  }

  async function buscarEstabelecimentosPorUsuario(id, res) {
    var util = new app.util.Util();
    const connection = await app.dao.connections.EatendConnection.connection();
    const estabelecimentoUsuarioDAO = new app.dao.EstabelecimentoUsuarioDAO(connection);
    var errors = [];

    try {
      return await estabelecimentoUsuarioDAO.buscaPorUsuario(id);
    } catch (error) {
      errors = util.customError(errors, "data", "Erro ao acessar os dados", "estabelecimento");
      res.status(500).send(errors);
    }
    finally {
      await connection.close();
    }
  }

  function atualizaEstabelecimentosPorProfissionalDim(
    idUsuario,
    estabelecimentos,
    res
  ) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();

    var connection = app.dao.ConnectionFactory();
    var connectionDim = app.dao.ConnectionFactoryDim();
    var objDAO = new app.dao.ProfissionalDAO(connection, connectionDim);
    var errors = [];

    objDAO.atualizaEstabelecimentosPorProfissionalDim(
      idUsuario,
      estabelecimentos,
      function (exception, result) {
        if (exception) {
          d.reject(exception);
          console.log(exception);
          errors = util.customError(
            errors,
            "data",
            "Erro ao editar os dados",
            "apagar permissoes"
          );
          res.status(500).send(errors);
          return;
        } else {
          d.resolve(result);
        }
      }
    );
    return d.promise;
  }

  function buscaEstabelecimentoPorProfissionalParaDim(id, res) {
    var q = require("q");
    var d = q.defer();
    var util = new app.util.Util();

    var connection = app.dao.ConnectionFactory();
    var objDAO = new app.dao.ProfissionalDAO(connection, null);
    var errors = [];

    objDAO.buscaEstabelecimentoPorProfissionalParaDim(id, function (
      exception,
      result
    ) {
      if (exception) {
        d.reject(exception);
        console.log(exception);
        errors = util.customError(
          errors,
          "data",
          "Erro ao acessar os dados",
          "obj"
        );
        res.status(500).send(errors);
        return;
      } else {
        d.resolve(result);
      }
    });
    return d.promise;
  }
};
