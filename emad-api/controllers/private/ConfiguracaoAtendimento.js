const atendimentoConfig = require("./../../infrastructure/constants/atendimento-formulario-configuration.json");

module.exports = function (app) {
  const _table = "tb_motivo_fim_receita";

  app.get("/configuracao-atendimento", async function (req, res) {
    let util = new app.util.Util();
    let queryFilter = req.query;
    let errors = [];

    lista(res).then(function (resposne) {
      res.status(200).json(resposne);
      return;
    });
  });

  app.get("/configuracao-atendimento/:id", async function (req, res) {
    let id = req.params.id;
    let util = new app.util.Util();
    let errors = [];

    buscarPorId(id, res).then(function (response) {
      var obj = {};
      obj.id = response.id;
      obj.idEstabelecimento = response.idEstabelecimento;
      obj.idEspecialidade = response.idEspecialidade;
      obj.idTipoFicha = response.idTipoFicha;
      obj.perguntas = JSON.parse(response.json);
      res.status(200).json(obj);
      return;
    });
  });

  app.post("/configuracao-atendimento", async function (req, res) {
    var obj = {};
    var util = new app.util.Util();
    var errors = [];
    let usuario = req.usuario;

    obj.idEstabelecimento = req.body.idEstabelecimento;
    obj.idEspecialidade = req.body.idEspecialidade;
    obj.idTipoFicha = req.body.idTipoFicha;
    obj.json = JSON.stringify(req.body.perguntas);
    obj.idUsuarioCriacao = usuario.id;

    const connection = await app.dao.connections.EatendConnection.connection();
    const configuracaoAtendimentoRepository =
      new app.dao.ConfiguracaoAtendimentoDAO(connection);

    try {
      await connection.beginTransaction();

      let response = await configuracaoAtendimentoRepository.salva(obj);

      res.status(201).send(obj);

      await connection.commit();
    } catch (exception) {
      console.log("Erro ao salvar ao salvar a configuração " + exception);
      res
        .status(500)
        .send(
          util.customError(errors, "header", "Ocorreu um erro inesperado", "")
        );
      await connection.rollback();
    } finally {
      await connection.close();
    }
  });

  app.put("/configuracao-atendimento", async function (req, res) {
    var obj = {};
    let util = new app.util.Util();
    let errors = [];
    let id = req.body.id;
    let usuario = req.usuario;

    obj.id = req.body.id;
    obj.idEstabelecimento = req.body.idEstabelecimento;
    obj.idEspecialidade = req.body.idEspecialidade;
    obj.idTipoFicha = req.body.idTipoFicha;
    obj.json = JSON.stringify(req.body.perguntas);
    obj.idUsuarioCriacao = usuario.id;

    const connection = await app.dao.connections.EatendConnection.connection();
    const configuracaoAtendimentoRepository =
      new app.dao.ConfiguracaoAtendimentoDAO(connection);

    try {
      await connection.beginTransaction();

      let response = await configuracaoAtendimentoRepository.atualiza(obj, id);

      res.status(201).send(obj);

      await connection.commit();
    } catch (exception) {
      console.log("Erro ao salvar ao salvar a configuração " + exception);
      res
        .status(500)
        .send(
          util.customError(errors, "header", "Ocorreu um erro inesperado", "")
        );
      await connection.rollback();
    } finally {
      await connection.close();
    }
  });

  app.delete("/configuracao-atendimento/:id", async function (req, res) {
    var util = new app.util.Util();
    let errors = [];
    let id = req.params.id;
    let obj = {};
    obj.id = id;

    const connection = await app.dao.connections.EatendConnection.connection();
    const configuracaoAtendimentoRepository =
      new app.dao.ConfiguracaoAtendimentoDAO(connection);

    try {
      await connection.beginTransaction();

      let response = await configuracaoAtendimentoRepository.deletaPorId(id);

      res.status(201).send(obj);

      await connection.commit();
    } catch (exception) {
      console.log("Erro ao deletar a configuração exception: " + exception);
      res
        .status(500)
        .send(
          util.customError(errors, "header", "Ocorreu um erro inesperado", "")
        );
      await connection.rollback();
    } finally {
      await connection.close();
    }
  });

  app.get(
    "/configuracao-atendimento/:idTipoFicha/:idEstabelecimento/:idUsuario",
    async function (req, res) {
      var util = new app.util.Util();
      let errors = [];
      let idTipoFicha = req.params.idTipoFicha;
      let idEstabelecimento = req.params.idEstabelecimento;
      let idUsuario = req.params.idUsuario;

      const connection =
        await app.dao.connections.EatendConnection.connection();
      const configuracaoAtendimentoRepository =
        new app.dao.ConfiguracaoAtendimentoDAO(connection);

      try {
        await connection.beginTransaction();

        let idEspecialidade =
          await configuracaoAtendimentoRepository.obterIdEspecialidadeProfissionalSync(
            idUsuario
          );

        if (idEspecialidade == null) {
          req
            .assert("idEspecialidade")
            .notEmpty()
            .withMessage("Profissional não possui especialidade vinculada");

          errors = req.validationErrors();

          res.status(400).send(errors);
          return;
        }

        let response =
          await configuracaoAtendimentoRepository.obterConfiguracaoAtendimentoSync(
            idTipoFicha,
            idEstabelecimento,
            idEspecialidade.id
          );

        let obj = {};

        if (response) {
          obj.id = response.id;
          obj.idEstabelecimento = response.idEstabelecimento;
          obj.idEspecialidade = response.idEspecialidade;
          obj.idTipoFicha = response.idTipoFicha;
          obj.perguntas = JSON.parse(response.json);
        }

        res.status(201).send(obj);
      } catch (exception) {
        console.log("Erro ao buscar a configuração exception: " + exception);
        res
          .status(500)
          .send(
            util.customError(errors, "header", "Ocorreu um erro inesperado", "")
          );
        await connection.rollback();
      } finally {
        await connection.close();
      }
    }
  );

  function lista(res) {
    let q = require("q");
    let d = q.defer();
    let util = new app.util.Util();
    let connection = app.dao.ConnectionFactory();
    let configuracaoAtendimentoRepository =
      new app.dao.ConfiguracaoAtendimentoDAO(connection, _table);

    let errors = [];

    configuracaoAtendimentoRepository.lista(function (exception, result) {
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

  function buscarPorId(id, res) {
    let q = require("q");
    let d = q.defer();
    let util = new app.util.Util();

    let connection = app.dao.ConnectionFactory();
    let configuracaoAtendimentoRepository =
      new app.dao.ConfiguracaoAtendimentoDAO(connection, _table);
    let errors = [];

    configuracaoAtendimentoRepository.buscaPorId(
      id,
      function (exception, result) {
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
          d.resolve(result[0]);
        }
      }
    );
    return d.promise;
  }
};
