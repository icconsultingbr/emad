const { async } = require('q');
const moment = require('moment');

let versao = "";
let uuidInstalacao = "";
let major = "";
let minor = "";
let revision = "";

module.exports = function (app) {

    app.post('/integracao-e-sus', async function (req, res) {
        let filtro = req.body;

        req.assert("periodoExtracao").notEmpty().withMessage("O campo Periodo é um campo obrigatório");
        req.assert("idFichaEsus").notEmpty().withMessage("O campo Ficha é um campo obrigatório");

        const connection = await app.dao.connections.EatendConnection.connection();

        try {

            let retorno;
            let cad, atend, vac, proc;

            if (filtro) {
                switch (filtro.idFichaEsus) {
                    case '0':
                        configTipoFicha(1)
                        cad = await listaCadastroIndividual(filtro);
                        atend = await listaAtendimentoIndividual(filtro);
                        vac = await listaFichaVacinacao(filtro);
                        col = await listaAtividadeColetiva(filtro);
                        atendOdont = await listaAtendimentoIndividual(filtro);
                        let xmls = cad.concat(atend, vac, col, atendOdont);
                        retorno = generateZipFiles(xmls, 'ficha')
                        break;
                    case '2':
                        configTipoFicha(1)
                        cad = await listaCadastroIndividual(filtro);
                        retorno = generateZipFiles(cad, 'ficha-cadastro-individual')
                        break;
                    case '4':
                        configTipoFicha(1)
                        atend = await listaAtendimentoIndividual(filtro);
                        retorno = generateZipFiles(atend, 'ficha-atendimento-individual')
                        break;
                    case '7':
                        configTipoFicha(1)
                        proc = await listaProcedimentos(filtro);
                        retorno = generateZipFiles(proc, 'ficha-procedimentos')
                        break;
                    case '9':
                        configTipoFicha(10)
                        proc = await listaAtendimentoDomiciliar(filtro);
                        retorno = generateZipFiles(proc, 'ficha-atendimento-domiciliar')
                        break;
                    case '14':
                        configTipoFicha(1)
                        vac = await listaFichaVacinacao(filtro);
                        retorno = generateZipFiles(vac, 'ficha-vacinas')
                        break;
                    case '15':
                        configTipoFicha(6)
                        col = await listaAtividadeColetiva(filtro);
                        retorno = generateZipFiles(col, 'ficha-atividade-coletiva')
                        break;
                    case '16':
                        configTipoFicha(5)
                        atendOdont = await listaAtendimentoOdontologicoIndividual(filtro);
                        retorno = generateZipFiles(atendOdont, 'ficha-atendimento-odontologico-individual')
                        break;
                    default:
                        return retorno;
                }
            }

            res.status(200).send(retorno);

        } catch (error) {
            console.log(error);
        } finally {
            await connection.close();
        }
    });

    function buscarPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var TipoFichaDAO = new app.dao.TipoFichaDAO(connection);
        var errors = [];

        TipoFichaDAO.buscaConfigPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "tipoFicha");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    async function listaCadastroIndividual(filtro) {
        let tipoCampoData;

        if (filtro.idTipoPeriodo == 1) {
            tipoCampoData = 'dataCriacao'
        } else {
            tipoCampoData = 'dataAlteracao'
        }

        const connection = await app.dao.connections.EatendConnection.connection();
        const integracaoESusDAO = new app.dao.IntegracaoESusDAO(connection, tipoCampoData);
        const estabelecimentoDAO = new app.dao.EstabelecimentoDAO(connection);

        let list = [];
        let estabelecimento = {};

        try {
            list = await integracaoESusDAO.listaCadastroIndividual(filtro);
            estabelecimento = await estabelecimentoDAO.buscaEstabelecimentoESus(filtro.idEstabelecimento);
        } catch (error) {
            console.log(error);
        } finally {
            await connection.close();
        }

        return preencheXMLCadastroIndividual(list, estabelecimento);
    }

    async function listaAtendimentoIndividual(filtro) {
        let tipoCampoData;

        if (filtro.idTipoPeriodo == 1) {
            tipoCampoData = 'dataCriacao'
        } else {
            tipoCampoData = 'dataFinalizacao'
        }

        const connection = await app.dao.connections.EatendConnection.connection();
        const integracaoESusDAO = new app.dao.IntegracaoESusDAO(connection, tipoCampoData);
        const estabelecimentoDAO = new app.dao.EstabelecimentoDAO(connection);
        const profissionalDAO = new app.dao.ProfissionalDAO(connection);

        let list = [];
        let estabelecimento = {};
        let profissionais = [];

        try {
            profissionais = await profissionalDAO.buscarProfissionalPorEstabelecimentoEsus(filtro.idEstabelecimento)
            estabelecimento = await estabelecimentoDAO.buscaEstabelecimentoESus(filtro.idEstabelecimento);
            list = await integracaoESusDAO.listaAtendimentoIndividual(filtro);
        } catch (error) {
            console.log(error);
        } finally {
            await connection.close();
        }

        return preencheXMLAtendimentoIndividual(list, estabelecimento, profissionais);
    }

    async function listaFichaVacinacao(filtro) {
        let tipoCampoData;

        if (filtro.idTipoPeriodo == 1) {
            tipoCampoData = 'dataCriacao'
        } else {
            tipoCampoData = 'dataFinalizacao'
        }

        const connection = await app.dao.connections.EatendConnection.connection();
        const integracaoESusDAO = new app.dao.IntegracaoESusDAO(connection, tipoCampoData);
        const estabelecimentoDAO = new app.dao.EstabelecimentoDAO(connection);
        const profissionalDAO = new app.dao.ProfissionalDAO(connection);

        let listaVacinas = [];
        let estabelecimento = {};
        let profissionais = [];

        try {
            profissionais = await profissionalDAO.buscarProfissionalPorEstabelecimentoEsus(filtro.idEstabelecimento)
            estabelecimento = await estabelecimentoDAO.buscaEstabelecimentoESus(filtro.idEstabelecimento);
            listaVacinas = await integracaoESusDAO.listaVacinas(filtro);
        } catch (error) {
            console.log(error);
        } finally {
            await connection.close();
        }

        return preencheXMLFichaVacinacao(listaVacinas, estabelecimento, profissionais);
    }

    async function listaProcedimentos(filtro) {
        let tipoCampoData;

        if (filtro.idTipoPeriodo == 1) {
            tipoCampoData = 'dataCriacao'
        } else {
            tipoCampoData = 'dataUltimaDispensacao'
        }

        const connection = await app.dao.connections.EatendConnection.connection();
        const integracaoESusDAO = new app.dao.IntegracaoESusDAO(connection, tipoCampoData);
        const estabelecimentoDAO = new app.dao.EstabelecimentoDAO(connection);
        const profissionalDAO = new app.dao.ProfissionalDAO(connection);

        let listaProcedimentos = [];
        let estabelecimento = {};
        let profissionais = [];

        try {
            profissionais = await profissionalDAO.buscarProfissionalPorEstabelecimentoEsus(filtro.idEstabelecimento)
            estabelecimento = await estabelecimentoDAO.buscaEstabelecimentoESus(filtro.idEstabelecimento);
            listaProcedimentos = await integracaoESusDAO.listaProcedimentos(filtro);
        } catch (error) {
            console.log(error);
        } finally {
            await connection.close();
        }

        return preencheXMLFichaProcedimentos(listaProcedimentos, estabelecimento, profissionais);
    }

    async function listaAtividadeColetiva(filtro) {
        let tipoCampoData;

        if (filtro.idTipoPeriodo == 1) {
            tipoCampoData = 'dataCriacao'
        } else {
            tipoCampoData = 'dataFinalizacao'
        }

        const connection = await app.dao.connections.EatendConnection.connection();
        const integracaoESusDAO = new app.dao.IntegracaoESusDAO(connection, tipoCampoData);
        const estabelecimentoDAO = new app.dao.EstabelecimentoDAO(connection);
        const profissionalDAO = new app.dao.ProfissionalDAO(connection);

        let list = [];
        let estabelecimento = {};
        let profissionais = {};
        let pacientes = {};

        try {
            estabelecimento = await estabelecimentoDAO.buscaEstabelecimentoESus(filtro.idEstabelecimento);
            list = await integracaoESusDAO.listaAtividadeColetiva(filtro);
            profissionais = await profissionalDAO.buscarProfissionalPorEstabelecimentoAtividadeColetiva(filtro.idEstabelecimento);
            pacientes = await integracaoESusDAO.listaAtividadeColetivaParticipantes(filtro.idEstabelecimento);
        } catch (error) {
            console.log(error);
        } finally {
            await connection.close();
        }

        return preencheXMLAtividadeColetiva(list, estabelecimento, profissionais, pacientes);
    }

    function preencheXMLCadastroIndividual(list, estabelecimento) {
        const { create } = require('xmlbuilder2');
        const { v4: uuidv4 } = require('uuid');
        let xmls = [];

        list.forEach(paciente => {
            let uuidFicha = uuidv4();

            let doc = create({ version: '1.0', encoding: 'UTF-8', standalone: 'yes' })
                .ele('ns3:dadoTransporteTransportXml', { 'xmlns:ns2': 'http://esus.ufsc.br/dadoinstalacao', 'xmlns:ns3': 'http://esus.ufsc.br/dadotransporte', 'xmlns:ns4': 'http://esus.ufsc.br/cadastroindividual' })
                .ele('uuidDadoSerializado').txt(uuidFicha).up()
                .ele('tipoDadoSerializado').txt('2').up()
                .ele('codIbge').txt(estabelecimento.codigo).up()
                .ele('cnesDadoSerializado').txt(estabelecimento.cnes).up()
                .ele('ns4:cadastroIndividualTransport')
                .ele('condicoesDeSaude').up()
                .ele('emSituacaoDeRua').up()
                .ele('fichaAtualizada').txt('false').up()
                .ele('identificacaoUsuarioCidadao')
                .ele('codigoIbgeMunicipioNascimento').txt(paciente.codigoIbgeMunicipioNascimento).up()
                .ele('dataNascimentoCidadao').txt(new Date(paciente.dataNascimento).getTime()).up()
                .ele('desconheceNomeMae').txt(paciente.desconheceNomeMae).up()
                .ele('emailCidadao').txt(paciente.email ? paciente.email : '').up()
                .ele('nacionalidadeCidadao').txt(paciente.idNacionalidadeSUS).up()
                .ele('nomeCidadao').txt(paciente.nome).up()
                .ele('nomeMaeCidadao').txt(paciente.desconheceNomeMae == 1 ? '' : paciente.nomeMae).up()
                .ele('cnsCidadao').txt(paciente.cnsCidadao ? paciente.cnsCidadao : undefined).up()
                .ele('cpfCidadao').txt(paciente.cnsCidadao ? undefined : paciente.cpfCidadao ? paciente.cpfCidadao : undefined).up()
                .ele('telefoneCelular').txt(paciente.foneCelular ? paciente.foneCelular : '').up()
                .ele('paisNascimento').txt(paciente.paisNascimento).up()
                .ele('racaCorCidadao').txt(paciente.idRacaSus ? paciente.idRacaSus : '1').up()
                .ele('sexoCidadao').txt(paciente.sexo).up()
                .ele('nomePaiCidadao').txt(paciente.desconheceNomePai == 1 ? '' : paciente.nomePai).up()
                .ele('desconheceNomePai').txt(paciente.desconheceNomePai).up()
                .up()
                .ele('informacoesSocioDemograficas').up()
                .ele('saidaCidadaoCadastro').up()
                .ele('statusTermoRecusaCadastroIndividualAtencaoBasica').txt('false').up()
                .ele('tpCdsOrigem').txt('3').up()
                .ele('uuid').txt(uuidFicha).up()
                .ele('uuidFichaOriginadora').txt(uuidFicha).up()
                .ele('headerTransport')
                .ele('profissionalCNS').txt(estabelecimento.cnsProfissionaleSus ? estabelecimento.cnsProfissionaleSus : '3').up()
                .ele('cboCodigo_2002').txt(estabelecimento.codigoCBO ? estabelecimento.codigoCBO : '3').up()
                .ele('cnes').txt(estabelecimento.cnes).up()
                .ele('dataAtendimento').txt(new Date(paciente.dataCriacao).getTime()).up()
                .ele('codigoIbgeMunicipio').txt(estabelecimento.codigo).up()
                .up()
                .up()
                .ele('ns2:remetente')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('ns2:originadora')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('versao', { major: major, minor: minor, revision: revision })
                .doc();

            let fieldToValidate = ['emailCidadao', 'nomeMaeCidadao', 'cnsCidadao', 'cpfCidadao', 'telefoneCelular', 'racaCorCidadao', 'nomePaiCidadao'];

            fieldToValidate.forEach(field => {
                doc.each(x => {
                    if (x.node.nodeName == field && !x.node._firstChild._data) {
                        x.node.removeChild(x.node._firstChild);
                        x.remove();
                    }
                }, true, true)
            })

            xmls.push(doc.doc().end({ prettyPrint: true, allowEmptyTags: false }));
        });

        return xmls;
    }

    function preencheXMLAtendimentoIndividual(list, estabelecimento, profissionais) {
        const { create, fragment } = require('xmlbuilder2');
        const { v4: uuidv4 } = require('uuid');

        let xmls = [];

        profissionais.forEach(profissional => {
            const listAtendimentos = list.atendimentos.filter(x => x.idProfissional == profissional.id);
            var uuidFicha = uuidv4();

            if (listAtendimentos.length == 0) { return; }
           
            const dataReal = new moment(listAtendimentos[0].dataCriacao).subtract({ hours: 3}); 
            const dataCriacao = new moment(dataReal).hours(3).minutes(0).seconds(0).toDate();

            let doc = create({ version: '1.0', encoding: 'UTF-8', keepNullNodes: false, keepNullAttributes: false })
                .ele('ns3:dadoTransporteTransportXml', { 'xmlns:ns2': 'http://esus.ufsc.br/dadoinstalacao', 'xmlns:ns3': 'http://esus.ufsc.br/dadotransporte', 'xmlns:ns4': 'http://esus.ufsc.br/fichaatendimentoindividualmaster' })
                .ele('uuidDadoSerializado').txt(uuidFicha).up()
                .ele('tipoDadoSerializado').txt('4').up()
                .ele('codIbge').txt(estabelecimento.codigo).up()
                .ele('cnesDadoSerializado').txt(estabelecimento.cnes).up();
                profissional.ine ? doc.ele('ineDadoSerializado').txt(profissional.ine).up() : '';
                doc.ele('ns4:fichaAtendimentoIndividualMasterTransport')
                .ele('headerTransport')
                .ele('lotacaoFormPrincipal')
                .ele('profissionalCNS').txt(profissional.profissionalCNS ? profissional.profissionalCNS : '3').up()
                .ele('cboCodigo_2002').txt(profissional.codigoCBO ? profissional.codigoCBO : '3').up()
                .ele('cnes').txt(estabelecimento.cnes).up()
                .ele('ine').txt(profissional.ine).up()
                .up()
                .ele('dataAtendimento').txt(new Date(dataCriacao).getTime()).up()
                .ele('codigoIbgeMunicipio').txt(estabelecimento.codigo).up()
                .up()
                .up()
                .ele('ns2:remetente')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('ns2:originadora')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('versao', { major: major, minor: minor, revision: revision })
                .doc();

            var qtdAtendimentosValidos = listAtendimentos.length;

            listAtendimentos.forEach(atendimento => {

                const listAvaliacao = list.condicaoAvaliacao.filter(x => x.idAtendimento == atendimento.idAtendimento);
                const listCondutas = list.condutaSus.filter(x => x.idAtendimento == atendimento.idAtendimento);
                const listCondicoesCiaps = list.condicaoCiaps.filter(x => x.idAtendimento == atendimento.idAtendimento);
                const listExamesSolicitados = list.solicitacoesExames.filter(x => x.idAtendimento == atendimento.idAtendimento);
                const listMedicamentos = list.medicamentos.filter(x => x.idAtendimento == atendimento.idAtendimento);

                if (!listCondutas.some((o) => o.idAtendimento == atendimento.idAtendimento) ||
                    (!listAvaliacao.some((o) => o.idAtendimento == atendimento.idAtendimento) && !listCondicoesCiaps.some((o) => o.idAtendimento == atendimento.idAtendimento))) {
                    qtdAtendimentosValidos--;
                    return;
                }

                let avaliacao = preencheAvaliacaoAtendimentoIndividual(listAvaliacao, listCondicoesCiaps, atendimento.idAtendimento);
                let condutas = preencheCondutasAtendimentoIndividual(listCondutas, atendimento.idAtendimento);
                let examesSolicitados = preencheExamesSolicitadosAtendimentoIndividual(listExamesSolicitados, atendimento.idAtendimento);
                let medicamentos = preencheMedicamentosAtendimentoIndividual(listMedicamentos, atendimento.idAtendimento);

                const dataHoraInicialAtendimento = atendimento.dataCriacao > atendimento.dataFinalizacao ? atendimento.dataFinalizacao : atendimento.dataCriacao;
                const dataHoraFinalAtendimento = atendimento.dataFinalizacao > atendimento.dataCriacao ? atendimento.dataFinalizacao : atendimento.dataCriacao;

                let atend = fragment({ keepNullAttributes: false, keepNullNodes: false }).ele('atendimentosIndividuais')
                    .ele('numeroProntuario').txt(atendimento.idAtendimento).up()
                    .ele('cnsCidadao').txt(atendimento.cartaoSus ? atendimento.cartaoSus : undefined).up()
                    .ele('cpfCidadao').txt(atendimento.cartaoSus ? undefined : atendimento.cpfCidadao ? atendimento.cpfCidadao : undefined).up()
                    .ele('dataNascimento').txt(new Date(atendimento.dataNascimento).getTime()).up()
                    .ele('localDeAtendimento').txt(atendimento.localDeAtendimentoSus ? atendimento.localDeAtendimentoSus : '').up()
                    .ele('sexo').txt(atendimento.sexo).up()
                    .ele('alturaAcompanhamentoNutricional').txt(atendimento.altura ? atendimento.altura : undefined).up()
                    .ele('pesoAcompanhamentoNutricional').txt(atendimento.peso ? atendimento.peso : undefined).up()
                    .ele('turno').txt(atendimento.turno).up()
                    .ele('tipoAtendimento').txt(atendimento.tipoAtendimentoSus ? atendimento.tipoAtendimentoSus : undefined).up()
                    .import(avaliacao);
                   
                atend.ele('vacinaEmDia').txt(atendimento.vacinaEmDia ? atendimento.vacinaEmDia == 1 ? true : false : false).up()
                .ele('ficouEmObservacao').txt(atendimento.ficouEmObservacao ? atendimento.ficouEmObservacao == 1 ? true : false : false).up()

                condutas.forEach(x => atend.find(x => x.node.nodeName == 'atendimentosIndividuais', true, true).import(x));

                examesSolicitados.forEach(x => atend.find(x => x.node.nodeName == 'atendimentosIndividuais', true, true).import(x));

                medicamentos.forEach(x => atend.find(x => x.node.nodeName == 'atendimentosIndividuais', true, true).import(x));

                atend.ele('dataHoraInicialAtendimento').txt(new Date(dataHoraInicialAtendimento).getTime()).up()
                    .ele('dataHoraFinalAtendimento').txt(new Date(dataHoraFinalAtendimento).getTime()).up()
                    .up();

                doc.find(x => x.node.nodeName == 'ns4:fichaAtendimentoIndividualMasterTransport', true, true).import(atend);

                let fieldToValidate = ['cpfCidadao', 'cnsCidadao', 'localDeAtendimento', 'tipoAtendimento', 'alturaAcompanhamentoNutricional', 'pesoAcompanhamentoNutricional', 'ine'];

                fieldToValidate.forEach(field => {
                    doc.each(x => {
                        if (x.node.nodeName == field && !x.node._firstChild._data) {
                            x.node.removeChild(x.node._firstChild);
                            x.remove();
                        }
                    }, true, true)
                })
            })

            if (qtdAtendimentosValidos == 0) { return; }

            doc.find(x => x.node.nodeName == 'ns4:fichaAtendimentoIndividualMasterTransport', true, true).ele('tpCdsOrigem').txt('3').up().ele('uuidFicha').txt(uuidFicha).up();

            xmls.push(doc.doc().end({ prettyPrint: true, allowEmptyTags: false }));
        })

        return xmls;
    }

    function preencheAvaliacaoAtendimentoIndividual(listAvaliacao, listCiaps, idAtendimento) {
        const { fragment } = require('xmlbuilder2');
        let avaliacao = fragment().ele('problemaCondicaoAvaliada');
        let existeCiap1 = false;
        let existeCiap2 = false;

        const listaAvaliacaoAtendimento = listAvaliacao.filter(x => x.idAtendimento == idAtendimento);
        const listaCiapsAtendimento = listCiaps.filter(x => x.idAtendimento == idAtendimento);

        listaCiapsAtendimento.forEach(ciaps => {
            if(ciaps.codigoAB && ciaps.codigoAB.length > 1){
                const codigoAB = fragment().ele('ciaps').txt(ciaps.codigoAB).up();
                avaliacao.import(codigoAB);
            }
            else{
                if(existeCiap1 && !existeCiap2){
                    const outroCiap2 = fragment().ele('outroCiap2').txt(ciaps.ciap2).up();
                    avaliacao.import(outroCiap2);
                    existeCiap2 = true;
                }
                else if(!existeCiap2){                                        
                    const outroCiap1 = fragment().ele('outroCiap1').txt(ciaps.ciap2).up();
                    avaliacao.import(outroCiap1);
                    existeCiap1 = true;
                }
            }            
        });

        if (listaAvaliacaoAtendimento && listaAvaliacaoAtendimento.length > 0) {
            const cid10 = fragment().ele('cid10').txt(listaAvaliacaoAtendimento[0].cid_10).up();
            avaliacao.import(cid10);

            if (listaAvaliacaoAtendimento.length > 1) {
                const cid10_2 = fragment().ele('cid10_2').txt(listaAvaliacaoAtendimento[1].cid_10).up();
                avaliacao.import(cid10_2);
            }
        }

        return avaliacao.up();
    }

    function preencheAtividadeColetivaProfissional(listProfissionais) {
        const { fragment } = require('xmlbuilder2');
        let itemFilhoVacinaColetiva = [];
        listProfissionais.forEach(x => {
            let atend = fragment({ keepNullAttributes: false, keepNullNodes: false }).ele('profissionais')
                .ele('cnsProfissional').txt(x.profissionalCNS ? x.profissionalCNS : '').up()
                .ele('codigoCbo2002').txt(x.codigoCBO ? x.codigoCBO : '').up()
                .up();
            itemFilhoVacinaColetiva.push(atend);
        });
        return itemFilhoVacinaColetiva;
    }

    function preencherTipoFornecimentoOdonto(listFornecimentos, idAtendimento) {
        const { fragment } = require('xmlbuilder2');
        let tipofornecimento = []
        listFornecimentos.forEach(x => {
            if (x.idAtendimento == idAtendimento) {
                let c = fragment().ele('tiposFornecimOdonto').txt(x.idFornecimento ? x.idFornecimento : '').up()
                tipofornecimento.push(c);
            }
        })
        return tipofornecimento
    }

    function preencherTipoVigilanciaOdonto(listVigilancia, idAtendimento) {
        const { fragment } = require('xmlbuilder2');
        let tipoVigilancia = []
        listVigilancia.forEach(x => {
            if (x.idAtendimento == idAtendimento) {
                let c = fragment().ele('tiposVigilanciaSaudeBucal').txt(x.idVigilancia ? x.idVigilancia : '').up()
                tipoVigilancia.push(c);
            }
        })
        return tipoVigilancia
    }

    function preencherProcedimentoOdonto(listProcedimentos, idAtendimento) {
        const { fragment } = require('xmlbuilder2');
        let itemFilhoVacinaColetiva = [];
        listProcedimentos.forEach(x => {
            if (x.idAtendimento == idAtendimento && x.situacao == 1) {
                let atend = fragment({ keepNullAttributes: false, keepNullNodes: false }).ele('procedimentosRealizados')
                    .ele('coMsProcedimento').txt(x.co_procedimento ? x.co_procedimento : '').up()
                    .ele('quantidade').txt(x.qtd ? x.qtd : '').up()
                    .up();
                itemFilhoVacinaColetiva.push(atend);
            }

        });
        return itemFilhoVacinaColetiva;
    }

    function preencheAtividadeColetivaParticipantes(listParticipantes, praticasEmSaude) {
        const { fragment } = require('xmlbuilder2');
        let itemFilhoColetiva = [];
        listParticipantes.forEach(x => {
            let atend = fragment({ keepNullAttributes: false, keepNullNodes: false }).ele('participantes');

            x.cartaoSus ? atend.ele('cnsParticipante').txt(x.cartaoSus).up() : x.cpf ? atend.ele('cpfParticipante').txt(x.cpf).up() : '';

            atend.ele('dataNascimento').txt(new Date(x.dataNascimento).getTime()).up()
                .ele('avaliacaoAlterada').txt(x.avaliacaoAlterada).up();

            x.peso ? atend.ele('peso').txt(x.peso ? x.peso.replace(',', '.') : undefined).up() : '';

            x.altura ? atend.ele('altura').txt(x.altura ? (parseFloat(x.altura.replace(',', '.'))).toString() : undefined).up() : '';

            if (praticasEmSaude == 25 || praticasEmSaude == 26 || praticasEmSaude == 27 || praticasEmSaude == 28) {
                atend.ele('cessouHabitoFumar').txt(x.parouFumar).up()
                    .ele('abandonouGrupo').txt(x.abandonouGrupo).up();
            }
            atend.ele('sexo').txt(x.sexo).up()
                .up();
            itemFilhoColetiva.push(atend);
        });
        return itemFilhoColetiva;
    }

    function preencheCondutasAtendimentoIndividual(listCondutas, idAtendimento) {
        const { fragment } = require('xmlbuilder2');
        let conduta = []
        listCondutas.forEach(x => {
            if (x.idAtendimento == idAtendimento) {
                let c = fragment().ele('condutas').txt(x.condutas).up()
                conduta.push(c);
            }
        })
        return conduta
    }

    function preencheExamesSolicitadosAtendimentoIndividual(listExames, idAtendimento) {
        const { fragment } = require('xmlbuilder2');
        let exames = []
        listExames.forEach(x => {
            if (x.idAtendimento == idAtendimento) {
                let frag = fragment().ele('exame')
                    .ele('codigoExame').txt(x.codigoExame).up()
                    .ele('solicitadoAvaliado').txt(x.solicitadoAvaliado).up()
                exames.push(frag);
            }
        })
        return exames
    }

    function preencheMedicamentosAtendimentoIndividual(listMedicamentos, idAtendimento) {
        const { fragment } = require('xmlbuilder2');
        let medicamentos = []
        listMedicamentos.forEach(x => {
            if (x.idAtendimento == idAtendimento) {
                //dose única
                if(x.quantidadeReceitada == 1){
                    let frag = fragment().ele('medicamentos')
                    .ele('codigoCatmat').txt(x.codigoCatmat).up()
                    .ele('viaAdministracao').txt(x.viaAdministracao).up()
                    .ele('dose').txt(x.dose).up()
                    .ele('doseUnica').txt(true).up()
                    .ele('usoContinuo').txt(false).up()
                    .ele('dtInicioTratamento').txt(new Date(x.dtInicioTratamento).getTime()).up()                                
                    .ele('quantidadeReceitada').txt(x.quantidadeReceitada).up()
                    medicamentos.push(frag);
                }
                else{
                    let frag = fragment().ele('medicamentos')
                    .ele('codigoCatmat').txt(x.codigoCatmat).up()
                    .ele('viaAdministracao').txt(x.viaAdministracao).up()
                    .ele('dose').txt(x.dose).up()
                    .ele('doseUnica').txt(false).up()
                    .ele('usoContinuo').txt(false).up()
                    .ele('doseFrequenciaTipo').txt(x.doseFrequenciaTipo).up()
                    .ele('doseFrequencia').txt(x.doseFrequencia).up()
                    .ele('doseFrequenciaQuantidade').txt(x.doseFrequenciaQuantidade).up()                    
                    .ele('doseFrequenciaUnidadeMedida').txt(x.doseFrequenciaUnidadeMedida).up()
                    .ele('dtInicioTratamento').txt(new Date(x.dtInicioTratamento).getTime()).up()
                    .ele('duracaoTratamento').txt(x.duracaoTratamento).up()
                    .ele('duracaoTratamentoMedida').txt(x.duracaoTratamentoMedida).up()
                    .ele('quantidadeReceitada').txt(x.quantidadeReceitada).up()
                    medicamentos.push(frag);
                }
            }           
        })
        return medicamentos
    }

    function preencheXMLFichaVacinacao(list, estabelecimento, profissionais) {
        const { create, fragment } = require('xmlbuilder2');
        const { v4: uuidv4 } = require('uuid');

        let xmls = [];

        profissionais.forEach(profissional => {
            const listVacinas = list.vacinas.filter(x => x.idProfissional == profissional.id);
            let uuidFicha = uuidv4();

            if (listVacinas.length == 0) { return; } //|| (!profissional.profissionalCNS || !profissional.codigoCBO)

            let doc = create({ version: '1.0', encoding: 'UTF-8', standalone: 'yes' })
                .ele('ns3:dadoTransporteTransportXml', { 'xmlns:ns2': 'http://esus.ufsc.br/dadoinstalacao', 'xmlns:ns3': 'http://esus.ufsc.br/dadotransporte', 'xmlns:ns4': 'http://esus.ufsc.br/fichavacinacaomaster' })
                .ele('uuidDadoSerializado').txt(uuidFicha).up()
                .ele('tipoDadoSerializado').txt('14').up()
                .ele('codIbge').txt(estabelecimento.codigo).up()
                .ele('cnesDadoSerializado').txt(estabelecimento.cnes).up();
                profissional.ine ? doc.ele('ineDadoSerializado').txt(profissional.ine).up() : '';
                doc.ele('ns4:fichaVacinacaoMasterTransport')
                .ele('headerTransport')
                .ele('profissionalCNS').txt(profissional.profissionalCNS ? profissional.profissionalCNS : '3').up()
                .ele('cboCodigo_2002').txt(profissional.codigoCBO ? profissional.codigoCBO : '3').up()
                .ele('cnes').txt(estabelecimento.cnes).up()
                .ele('ine').txt(profissional.ine).up()
                .ele('dataAtendimento').txt(new Date(listVacinas[0].dataCriacao).getTime()).up()
                .ele('codigoIbgeMunicipio').txt(estabelecimento.codigo).up()
                .up()
                .ele('uuidFicha').txt(uuidFicha).up()
                .ele('tpCdsOrigem').txt('3').up()
                .up()
                .ele('ns2:remetente')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('ns2:originadora')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('versao', { major: '4', minor: '3', revision: '5' })
                .doc();

            listVacinas.forEach(vacina => {
                const listVacinaChild = list.vacinaChild.filter(x => x.idAtendimento == vacina.idAtendimento);

                if (listVacinaChild.length == 0) { return; }

                let vac = fragment().ele('vacinacoes')
                    .ele('turno').txt(vacina.turno).up()
                    .ele('numProntuario').txt(vacina.idAtendimento).up()
                    .ele('cnsCidadao').txt(vacina.cartaoSus ? vacina.cartaoSus : '').up()
                    .ele('cpfCidadao').txt(vacina.cartaoSus ? '' : vacina.cpfCidadao ? vacina.cpfCidadao : '').up()
                    .ele('dtNascimento').txt(new Date(vacina.dataNascimento).getTime()).up()
                    .ele('sexo').txt(vacina.sexo).up()
                    .ele('localAtendimento').txt(vacina.localDeAtendimentoSus ? vacina.localDeAtendimentoSus : '').up()
                    .ele('viajante').txt(vacina.viajante == 1 ? true : false).up()
                    .ele('gestante').txt(vacina.sexo == '0' ? false : true).up()
                    .ele('puerpera').txt(vacina.sexo == '0' ? false : true).up();

                let child = preencheVacinasChild(listVacinaChild, vacina.idAtendimento);
                child.forEach(x => vac.import(x));

                vac.ele('dataHoraInicialAtendimento').txt(new Date(vacina.dataCriacao).getTime()).up()
                    .ele('dataHoraFinalAtendimento').txt(new Date(vacina.dataFinalizacao).getTime()).up()
                    .up();

                doc.find(x => x.node.nodeName == 'ns4:fichaVacinacaoMasterTransport', true, true).import(vac);

                let fieldToValidate = ['cpfCidadao', 'cnsCidadao', 'localDeAtendimento', 'ine'];

                fieldToValidate.forEach(field => {
                    doc.each(x => {
                        if (x.node.nodeName == field && !x.node._firstChild._data) {
                            x.node.removeChild(x.node._firstChild);
                            x.remove();
                        }
                    }, true, true)
                })
            })

            xmls.push(doc.doc().end({ prettyPrint: true }));
        });

        return xmls
    }

    function preencheVacinasChild(vacina, idAtendimento) {
        const { fragment } = require('xmlbuilder2');
        let vac = []

        vacina.forEach(x => {
            if (x.idAtendimento == idAtendimento) {
                let frag = fragment().ele('vacinas')
                    .ele('imunobiologico').txt(x.codigoVacinaSus).up()
                    .ele('estrategiaVacinacao').txt(x.estrategiaVacinacao ? x.estrategiaVacinacao : '').up()
                    .ele('dose').txt(x.dose ? x.dose : '').up()
                    .ele('lote').txt(x.lote ? x.lote : '').up()
                    .ele('fabricante').txt(x.fornecedor ? x.fornecedor : 'NÃO INFORMADO').up()
                    .ele('grupoAtendimento').txt(x.grupoAtendimento ? x.grupoAtendimento : '').up()
                    .ele('stRegistroAnterior').txt(x.stRegistroAnterior == 1 ? true : false).up()
                    .ele('dataRegistroAnterior').txt(x.dataRegistroAnterior ? new Date(x.dataRegistroAnterior).getTime() : '').up()
                    .up()

                    //CAMPO = grupoAtendimento
                    // Só pode ser preenchido se o campo estrategiaVacinacao = 5 (Campanha indiscriminada). Neste caso o preenchimento é obrigatório;
                    //Não pode ser preenchido se o campo stRegistroAnterior = true;    
                    if (x.stRegistroAnterior == 1 || x.estrategiaVacinacao != '5') {
                        removeNode(frag.doc(), ['grupoAtendimento']);
                    }

                    //CAMPO = estrategiaVacinacao                    
                    //Não pode ser preenchido se o campo stRegistroAnterior = true;    
                    if (x.stRegistroAnterior == 1) {
                        removeNode(frag.doc(), ['estrategiaVacinacao']);
                    }

                    let fieldToValidate = ['estrategiaVacinacao','grupoAtendimento','dose','dataRegistroAnterior', 'fabricante'];

                    fieldToValidate.forEach(field => {
                        frag.each(x => {
                            if (x.node.nodeName == field && !x.node._firstChild._data) {
                                x.node.removeChild(x.node._firstChild);
                                x.remove();
                            }
                        }, true, true)
                    })

                vac.push(frag);
            }
        })
        return vac;
    }

    function preencheXMLFichaProcedimentos(list, estabelecimento, profissionais) {
        const { create, fragment } = require('xmlbuilder2');
        const { v4: uuidv4 } = require('uuid');

        let xmls = [];

        profissionais.forEach(profissional => {
            const listProcedimento = list.atendimentos.filter(x => x.idProfissional == profissional.id);

            const numTotalAfericaoPa = list.numTotalAfericaoPa.filter(x => x.idProfissional == profissional.id);
            const numTotalAfericaoTemperatura = list.numTotalAfericaoTemperatura.filter(x => x.idProfissional == profissional.id);
            const numTotalMedicaoAltura = list.numTotalMedicaoAltura.filter(x => x.idProfissional == profissional.id);
            const numTotalMedicaoPeso = list.numTotalMedicaoPeso.filter(x => x.idProfissional == profissional.id);

            var uuidFicha = uuidv4();

            if (listProcedimento.length == 0 
                && (numTotalAfericaoPa && numTotalAfericaoPa == 0) 
                && (numTotalAfericaoTemperatura && numTotalAfericaoTemperatura == 0) 
                && (numTotalMedicaoAltura && numTotalMedicaoAltura == 0) 
                && (numTotalMedicaoPeso && numTotalMedicaoPeso == 0) 
                ) { return; } //|| (!profissional.profissionalCNS || !profissional.codigoCBO)

            let doc = create({ version: '1.0', encoding: 'UTF-8', standalone: 'yes' })
                .ele('ns3:dadoTransporteTransportXml', { 'xmlns:ns2': 'http://esus.ufsc.br/dadoinstalacao', 'xmlns:ns3': 'http://esus.ufsc.br/dadotransporte', 'xmlns:ns4': 'http://esus.ufsc.br/fichaprocedimentomaster' })
                .ele('uuidDadoSerializado').txt(uuidFicha).up()
                .ele('tipoDadoSerializado').txt('7').up()
                .ele('codIbge').txt(estabelecimento.codigo).up()
                .ele('cnesDadoSerializado').txt(estabelecimento.cnes).up();
                profissional.ine ? doc.ele('ineDadoSerializado').txt(profissional.ine).up() : '';
                doc.ele('ns4:fichaProcedimentoMasterTransport')
                .ele('headerTransport')
                .ele('profissionalCNS').txt(profissional.profissionalCNS ? profissional.profissionalCNS : '3').up()
                .ele('cboCodigo_2002').txt(profissional.codigoCBO ? profissional.codigoCBO : '3').up()
                .ele('cnes').txt(estabelecimento.cnes).up()
                .ele('ine').txt(profissional.ine).up()
                .ele('dataAtendimento').txt(new Date(listProcedimento[0].dataCriacao).getTime()).up()
                .ele('codigoIbgeMunicipio').txt(estabelecimento.codigo).up()
                .up()
                .up()
                .ele('ns2:remetente')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('ns2:originadora')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('versao', { major: major, minor: minor, revision: revision })
                .doc();

             let fieldToValidate = ['ine'];

                fieldToValidate.forEach(field => {
                    doc.each(x => {
                        if (x.node.nodeName == field && !x.node._firstChild._data) {
                            x.node.removeChild(x.node._firstChild);
                            x.remove();
                        }
                    }, true, true)
                })

            listProcedimento.forEach(atendimento => {
                const listProcedimentoChild = list.procedimentos.filter(x => x.idAtendimento == atendimento.idAtendimento);

                if (listProcedimentoChild.length == 0) { return; }

                let proc = fragment().ele('atendProcedimentos')
                    .ele('numProntuario').txt(atendimento.idAtendimento).up()
                    .ele('cnsCidadao').txt(atendimento.cartaoSus ? atendimento.cartaoSus : '').up()
                    .ele('cpfCidadao').txt(atendimento.cartaoSus ? '' : atendimento.cpfCidadao ? atendimento.cpfCidadao : '').up()
                    .ele('dtNascimento').txt(new Date(atendimento.dataNascimento).getTime()).up()
                    .ele('sexo').txt(atendimento.sexo).up()
                    .ele('localAtendimento').txt(atendimento.localDeAtendimentoSus ? atendimento.localDeAtendimentoSus : '').up()
                    .ele('turno').txt(atendimento.turno).up()
                    .ele('statusEscutaInicialOrientacao').txt(false).up()

                let child = preencheProcedimentos(listProcedimentoChild);
                child.forEach(x => proc.import(x));

                proc.ele('dataHoraInicialAtendimento').txt(new Date(atendimento.dataCriacao).getTime()).up()
                    .ele('dataHoraFinalAtendimento').txt(new Date(atendimento.dataFinalizacao).getTime()).up()
                    .up();

                doc.find(x => x.node.nodeName == 'ns4:fichaProcedimentoMasterTransport', true, true).import(proc);

                let fieldToValidate = ['cpfCidadao', 'cnsCidadao', 'localDeAtendimento'];

                fieldToValidate.forEach(field => {
                    doc.each(x => {
                        if (x.node.nodeName == field && !x.node._firstChild._data) {
                            x.node.removeChild(x.node._firstChild);
                            x.remove();
                        }
                    }, true, true)
                })
            })

            let afericoes = doc.find(x => x.node.nodeName == 'ns4:fichaProcedimentoMasterTransport', true, true)
                .ele('uuidFicha').txt(uuidFicha).up();

            afericoes.ele('tpCdsOrigem').txt('3').up();

            if (numTotalAfericaoPa && numTotalAfericaoPa.length > 0)
                afericoes.ele('numTotalAfericaoPa').txt(numTotalAfericaoPa[0].qtd).up();

            if (numTotalAfericaoTemperatura && numTotalAfericaoTemperatura.length > 0)
                afericoes.ele('numTotalAfericaoTemperatura').txt(numTotalAfericaoTemperatura[0].qtd).up();

            if (numTotalMedicaoAltura && numTotalMedicaoAltura.length > 0)
                afericoes.ele('numTotalMedicaoAltura').txt(numTotalMedicaoAltura[0].qtd).up();

            if (numTotalMedicaoPeso && numTotalMedicaoPeso.length > 0)
                afericoes.ele('numTotalMedicaoPeso').txt(numTotalMedicaoPeso[0].qtd).up();

            xmls.push(doc.doc().end({ prettyPrint: true }));
        });

        return xmls
    }

    function preencheXMLAtividadeColetiva(list, estabelecimento, profissionais, pacientes) {
        const { create, fragment } = require('xmlbuilder2');
        const { v4: uuidv4 } = require('uuid');

        let xmls = [];

        list.atendimentos.forEach(atendimento => {
            var uuidFicha = uuidv4();

            let profissionaisAtendimento = profissionais.filter(x => x.idAtendimento == atendimento.idAtendimento);
            let pacientesAtendimento = pacientes.filter(x => x.idAtendimento == atendimento.idAtendimento);

            let itemParticipantes = preencheAtividadeColetivaParticipantes(pacientesAtendimento, atendimento.praticasEmSaude);
            let itemProfissionais = preencheAtividadeColetivaProfissional(profissionaisAtendimento);

            let doc = create({ version: '1.0', encoding: 'UTF-8', keepNullNodes: false, keepNullAttributes: false })
                .ele('ns3:dadoTransporteTransportXml', { 'xmlns:ns2': 'http://esus.ufsc.br/dadoinstalacao', 'xmlns:ns3': 'http://esus.ufsc.br/dadotransporte', 'xmlns:ns4': 'http://esus.ufsc.br/fichaatividadecoletiva' })
                .ele('uuidDadoSerializado').txt(uuidFicha).up()
                .ele('tipoDadoSerializado').txt('6').up()
                .ele('codIbge').txt(estabelecimento.codigo).up()
                .ele('cnesDadoSerializado').txt(estabelecimento.cnes).up()
                .ele('ineDadoSerializado').txt(atendimento.profissionalIne).up()
                .ele('ns4:fichaAtividadeColetivaTransport')
                .ele('uuidFicha').txt(uuidFicha).up()
                .ele('inep').txt(atendimento.inep).up()
                .ele('numParticipantes').txt(atendimento.numParticipantes).up()
                .ele('numAvaliacoesAlteradas').txt(atendimento.numAvaliacoesAlteradas).up();

            itemProfissionais.forEach(x => doc.find(x => x.node.nodeName == 'ns4:fichaAtividadeColetivaTransport', true, true).import(x));

            doc.ele('atividadeTipo').txt(atendimento.atividadeTipo).up()
                .ele('temasParaReuniao').txt(atendimento.temasParaReuniao).up()
                .ele('publicoAlvo').txt(atendimento.publicoAlvo).up();

            itemParticipantes.forEach(x => doc.find(x => x.node.nodeName == 'ns4:fichaAtividadeColetivaTransport', true, true).import(x));

            doc.ele('tbCdsOrigem').txt('3').up()
                .ele('procedimento').txt(atendimento.codigoSIGTAP).up()
                .ele('turno').txt(atendimento.turno).up()
                .ele('pseEducacao').txt(!atendimento.pseEducacao ? false : atendimento.pseEducacao).up()
                .ele('pseSaude').txt(!atendimento.pseSaude ? false : atendimento.pseSaude).up()
                .ele('headerTransport')
                .ele('profissionalCNS').txt(estabelecimento.cnsProfissionaleSus ? estabelecimento.cnsProfissionaleSus : '3').up()
                .ele('cboCodigo_2002').txt(estabelecimento.codigoCBO ? estabelecimento.codigoCBO : '3').up()
                .ele('cnes').txt(estabelecimento.cnes).up()
                .ele('ine').txt(atendimento.profissionalIne).up()
                .ele('dataAtendimento').txt(new Date(atendimento.dataCriacao).getTime()).up()
                .ele('codigoIbgeMunicipio').txt(estabelecimento.codigo).up()
                .up()
                .ele('temasParaSaude').txt(atendimento.temasParaSaude).up()
                .ele('praticasEmSaude').txt(atendimento.praticasEmSaude).up()
                .up()
                .ele('ns2:remetente')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('ns2:originadora')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('versao', { major: major, minor: minor, revision: revision })
                .doc();

            //CAMPO = PROFISSIONAIS
            // Não pode ser preenchido se pseEducacao = true e pseSaude = false
            if (atendimento.pseEducacao == 1 && (!atendimento.pseSaude || atendimento.pseSaude == 0)) {
                removeNode(doc.doc(), ['profissionais']);
                removeNode(doc.doc(), ['temasParaReuniao']);
            }

            // CAMPO = publicoAlvo/temasParaReuniao
            // Não pode ser preenchido se atividadeTipo for 4, 5, 6 ou 7
            if (atendimento.atividadeTipo == 4 || atendimento.atividadeTipo == 5 || atendimento.atividadeTipo == 6 || atendimento.atividadeTipo == 7) {
                removeNode(doc.doc(), ['temasParaReuniao']);
            }

            // CAMPO = publicoAlvo/temasParaSaude
            // Não pode ser preenchido se atividadeTipo for 1, 2 ou 3
            if (atendimento.atividadeTipo == 1 || atendimento.atividadeTipo == 2 || atendimento.atividadeTipo == 3) {
                removeNode(doc.doc(), ['publicoAlvo', 'temasParaSaude'])
            }

            // CAMPO = procedimento
            // Só pode ser preenchido se o campo praticasEmSaude possuir o valor 30.
            if (atendimento.praticasEmSaude != 30) {
                removeNode(doc.doc(), ['procedimento'])
            }

            // CAMPO = praticasEmSaude
            // Não pode ser preenchido se atividadeTipo for 1, 2, 3, 4, 7
            if (atendimento.atividadeTipo == 1 || atendimento.atividadeTipo == 2 || atendimento.atividadeTipo == 3 || atendimento.atividadeTipo == 4 || atendimento.atividadeTipo == 7) {
                removeNode(doc.doc(), ['praticasEmSaude'])
            }

            if (!atendimento.profissionalIne) {
                removeNode(doc.doc(), ['ineDadoSerializado', 'ine'])
            }

            let fieldToValidate = ['peso', 'altura', 'procedimento'];

            fieldToValidate.forEach(field => {
                doc.each(x => {
                    if (x.node.nodeName == field && !x.node._firstChild._data) {
                        x.node.removeChild(x.node._firstChild);
                        x.remove();
                    }
                }, true, true)
            })

            xmls.push(doc.doc().end({ prettyPrint: true, allowEmptyTags: false }));
        })

        return xmls;
    }

    function preencheProcedimentos(listProcedimento) {
        const { fragment } = require('xmlbuilder2');
        let procedimentos = []
        listProcedimento.forEach(x => {
            let c = fragment().ele('procedimentos').txt(x.co_procedimento).up()
            procedimentos.push(c);
        })
        return procedimentos
    }

    function generateZipFiles(docs, prefixoNome) {
        const AdmZip = require('adm-zip');

        let zip = new AdmZip();
        let i = 1;
        docs.forEach(x => {
            zip.addFile(`${prefixoNome + '-' + i}.esus.xml`, new Buffer.from(x));
            i++;
        })

        return zip.toBuffer();
    }

    async function configTipoFicha(tipoficha) {
        let configuracaoFicha = {};
        configuracaoFicha = await buscarPorId(tipoficha);
        versao = configuracaoFicha.versaoSistema
        uuidInstalacao = configuracaoFicha.uuidInstalacao
        major = configuracaoFicha.major
        minor = configuracaoFicha.minor
        revision = configuracaoFicha.revision
    }

    function removeNode(doc, fieldToValidate) {
        fieldToValidate.forEach(field => {
            doc.each(x => {
                if (x.node.nodeName == field) {
                    x.node.removeChild(x.node._firstChild);
                    x.remove();
                }
            }, true, true)
        })
    }

    async function listaAtendimentoOdontologicoIndividual(filtro) {
        let tipoCampoData;

        if (filtro.idTipoPeriodo == 1) {
            tipoCampoData = 'dataCriacao'
        } else {
            tipoCampoData = 'dataFinalizacao'
        }

        const connection = await app.dao.connections.EatendConnection.connection();
        const integracaoESusDAO = new app.dao.IntegracaoESusDAO(connection, tipoCampoData);
        const estabelecimentoDAO = new app.dao.EstabelecimentoDAO(connection);
        const profissionalDAO = new app.dao.ProfissionalDAO(connection);

        let list = [];
        let estabelecimento = {};
        let profissionais = [];
        let tipoFornecimentoOdonto = [];
        let tipoVigilanciaOdonto = [];
        let procedimentosOdonto = [];

        try {
            profissionais = await profissionalDAO.buscarProfissionalPorEstabelecimentoEsus(filtro.idEstabelecimento)
            estabelecimento = await estabelecimentoDAO.buscaEstabelecimentoESus(filtro.idEstabelecimento);
            list = await integracaoESusDAO.listaAtendimentoOdontologicoIndividual(filtro);
            tipoFornecimentoOdonto = await integracaoESusDAO.listAtendimentoTipoFornecimentoOdonto(filtro.idEstabelecimento);
            tipoVigilanciaOdonto = await integracaoESusDAO.listAtendimentoTipoVigilanciaOdonto(filtro.idEstabelecimento);
            procedimentosOdonto = await integracaoESusDAO.listaProcedimentos(filtro);

        } catch (error) {
            console.log(error);
        } finally {
            await connection.close();
        }

        return preencheXMLAtendimentoOdontologicoIndividual(list, estabelecimento, profissionais, tipoFornecimentoOdonto, tipoVigilanciaOdonto, procedimentosOdonto);
    }

    function preencheXMLAtendimentoOdontologicoIndividual(list, estabelecimento, profissionais, tipoFornecimentoOdonto, tipoVigilanciaOdonto, procedimentosOdonto) {
        const { create, fragment } = require('xmlbuilder2');
        const { v4: uuidv4 } = require('uuid');

        let xmls = [];

        profissionais.forEach(profissional => {

            const listAtendimentos = list.atendimentos.filter(x => x.idProfissional == profissional.id);

            var uuidFicha = uuidv4();

            if (listAtendimentos.length == 0) { return; }

            let doc = create({ version: '1.0', encoding: 'UTF-8', keepNullNodes: false, keepNullAttributes: false })
                .ele('ns3:dadoTransporteTransportXml', { 'xmlns:ns2': 'http://esus.ufsc.br/dadoinstalacao', 'xmlns:ns3': 'http://esus.ufsc.br/dadotransporte', 'xmlns:ns4': 'http://esus.ufsc.br/fichaatendimentoodontologicomaster' })
                .ele('uuidDadoSerializado').txt(uuidFicha).up()
                .ele('tipoDadoSerializado').txt('5').up()
                .ele('codIbge').txt(estabelecimento.codigo).up()
                .ele('cnesDadoSerializado').txt(estabelecimento.cnes).up();
            profissional.ine ? doc.ele('ineDadoSerializado').txt(profissional.ine).up() : '';
            doc.ele('numLote').txt(Math.floor(Date.now() / 1000)).up()
                .ele('ns4:fichaAtendimentoOdontologicoMasterTransport')
                .ele('uuidFicha').txt(uuidFicha).up()
                .ele('tpCdsOrigem').txt('1').up()
                .up()
                .ele('ns2:remetente')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('ns2:originadora')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('versao', { major: major, minor: minor, revision: revision })
                .doc();

            if (listAtendimentos.length == 0) { return; }

            listAtendimentos.forEach(atendimento => {

                const listtipoFornecimentoOdontologico = tipoFornecimentoOdonto.filter(x => x.idAtendimento == atendimento.idAtendimento);
                const listtipoVigilanciaOdontologico = tipoVigilanciaOdonto.filter(x => x.idAtendimento == atendimento.idAtendimento);
                const listProcedimentoOdontologico = procedimentosOdonto.procedimentos.filter(x => x.idAtendimento == atendimento.idAtendimento);

                let tipofornecimentos = preencherTipoFornecimentoOdonto(listtipoFornecimentoOdontologico, atendimento.idAtendimento);
                let tipovigilancia = preencherTipoVigilanciaOdonto(listtipoVigilanciaOdontologico, atendimento.idAtendimento)
                let procedimentosOdontologico = preencherProcedimentoOdonto(listProcedimentoOdontologico, atendimento.idAtendimento)

                let atend = fragment({ keepNullAttributes: false, keepNullNodes: false }).ele('atendimentosOdontologicos')
                    .ele('numProntuario').txt(atendimento.idAtendimento).up()
                    .ele('cnsCidadao').txt(atendimento.cartaoSus ? atendimento.cartaoSus : undefined).up()
                    .ele('dtNascimento').txt(new Date(atendimento.dataNascimento).getTime()).up()
                    .ele('localAtendimento').txt(atendimento.localDeAtendimentoSus ? atendimento.localDeAtendimentoSus : '').up()
                    .ele('gestante').txt(atendimento.gestante == 1 ? true : false).up()
                    .ele('necessidadesEspeciais').txt(atendimento.possuiNecessidadesEspeciais == 1 ? true : false).up()
                    .ele('tipoAtendimento').txt(atendimento.tipoAtendimentoSus ? atendimento.tipoAtendimentoSus : undefined).up()
                    .ele('tiposEncamOdonto').txt(atendimento.condutaEncaminhamento).up()

                tipofornecimentos.forEach(x => atend.find(x => x.node.nodeName == 'atendimentosOdontologicos', true, true).import(x));
                tipovigilancia.forEach(x => atend.find(x => x.node.nodeName == 'atendimentosOdontologicos', true, true).import(x));

                atend.ele('tiposConsultaOdonto').txt(atendimento.tipoConsultaOdonto).up()

                procedimentosOdontologico.forEach(x => atend.find(x => x.node.nodeName == 'atendimentosOdontologicos', true, true).import(x));

                atend.ele('turno').txt(atendimento.turno).up()
                    .ele('sexo').txt(atendimento.sexo).up()
                    .ele('dataHoraInicialAtendimento').txt(new Date(atendimento.dataCriacao).getTime()).up()
                    .ele('dataHoraFinalAtendimento').txt(new Date(atendimento.dataFinalizacao).getTime()).up()
                    .ele('alturaAcompanhamentoNutricional').txt(atendimento.altura).up()
                    .ele('pesoAcompanhamentoNutricional').txt(atendimento.peso).up()
                    .up();

                doc.find(x => x.node.nodeName == 'ns4:fichaAtendimentoOdontologicoMasterTransport', true, true).import(atend);

                let fieldToValidate = ['cpfCidadao', 'cnsCidadao', 'localDeAtendimento', 'tipoAtendimento', 'alturaAcompanhamentoNutricional', 'pesoAcompanhamentoNutricional'];

                fieldToValidate.forEach(field => {
                    doc.each(x => {
                        if (x.node.nodeName == field && !x.node._firstChild._data) {
                            x.node.removeChild(x.node._firstChild);
                            x.remove();
                        }
                    }, true, true)
                })
            })

            let header = fragment({ keepNullAttributes: false, keepNullNodes: false }).ele('headerTransport')
                .ele('lotacaoFormPrincipal')
                .ele('profissionalCNS').txt(profissional.profissionalCNS ? profissional.profissionalCNS : '3').up()
                .ele('cboCodigo_2002').txt(profissional.codigoCBO ? profissional.codigoCBO : '3').up()
                .ele('cnes').txt(estabelecimento.cnes).up()
                .ele('ine').txt(profissional.ine).up()
                .up()
                .ele('dataAtendimento').txt(new Date(listAtendimentos[0].dataCriacao).getTime()).up()
                .ele('codigoIbgeMunicipio').txt(estabelecimento.codigo).up()
                .up()
            doc.find(x => x.node.nodeName == 'ns4:fichaAtendimentoOdontologicoMasterTransport', true, true).import(header);

            let fieldToValidate = ['ine'];

                fieldToValidate.forEach(field => {
                    doc.each(x => {
                        if (x.node.nodeName == field && !x.node._firstChild._data) {
                            x.node.removeChild(x.node._firstChild);
                            x.remove();
                        }
                    }, true, true)
                })

            xmls.push(doc.doc().end({ prettyPrint: true, allowEmptyTags: false }));
        })

        return xmls;
    }

    async function listaAtendimentoDomiciliar(filtro) {
        let tipoCampoData;

        if (filtro.idTipoPeriodo == 1) {
            tipoCampoData = 'dataCriacao'
        } else {
            tipoCampoData = 'dataFinalizacao'
        }

        const connection = await app.dao.connections.EatendConnection.connection();
        const integracaoESusDAO = new app.dao.IntegracaoESusDAO(connection, tipoCampoData);
        const estabelecimentoDAO = new app.dao.EstabelecimentoDAO(connection);
        const profissionalDAO = new app.dao.ProfissionalDAO(connection);

        let list = [];
        let estabelecimento = {};
        let profissionais = [];

        try {
            profissionais = await profissionalDAO.buscarProfissionalPorEstabelecimentoEsus(filtro.idEstabelecimento)
            estabelecimento = await estabelecimentoDAO.buscaEstabelecimentoESus(filtro.idEstabelecimento);
            list = await integracaoESusDAO.listaAtendimentoDomiciliar(filtro);
        } catch (error) {
            console.log(error);
        } finally {
            await connection.close();
        }

        return preencheXMLAtendimentoDomiciliar(list, estabelecimento, profissionais);
    }

    function preencheXMLAtendimentoDomiciliar(list, estabelecimento, profissionais) {
        const { create, fragment } = require('xmlbuilder2');
        const { v4: uuidv4 } = require('uuid');

        let xmls = [];

        profissionais.forEach(profissional => {
            const listAtendimentos = list.atendimentos.filter(x => x.idProfissional == profissional.id);

            var uuidFicha = uuidv4();

            if (listAtendimentos.length == 0) { return; }

            let doc = create({ version: '1.0', encoding: 'UTF-8', keepNullNodes: false, keepNullAttributes: false })
                .ele('ns3:dadoTransporteTransportXml', { 'xmlns:ns2': 'http://esus.ufsc.br/dadoinstalacao', 'xmlns:ns3': 'http://esus.ufsc.br/dadotransporte', 'xmlns:ns4': 'http://esus.ufsc.br/fichaatendimentodomiciliarmaster' })
                .ele('uuidDadoSerializado').txt(uuidFicha).up()
                .ele('tipoDadoSerializado').txt('10').up()
                .ele('codIbge').txt(estabelecimento.codigo).up()
                .ele('cnesDadoSerializado').txt(estabelecimento.cnes).up();
                profissional.ine ? doc.ele('ineDadoSerializado').txt(profissional.ine).up() : '';
                doc.ele('ns4:fichaAtendimentoDomiciliarMasterTransport')
                .ele('uuidFicha').txt(uuidFicha).up()
                .ele('tpCdsOrigem').txt('3').up()
                .ele('headerTransport')
                .ele('lotacaoFormPrincipal')
                .ele('profissionalCNS').txt(profissional.profissionalCNS ? profissional.profissionalCNS : '3').up()
                .ele('cboCodigo_2002').txt(profissional.codigoCBO ? profissional.codigoCBO : '3').up()
                .ele('cnes').txt(estabelecimento.cnes).up()
                .ele('ine').txt(profissional.ine).up()
                .up()
                .ele('dataAtendimento').txt(new Date(listAtendimentos[0].dataCriacao).getTime()).up()
                .ele('codigoIbgeMunicipio').txt(estabelecimento.codigo).up()
                .up()
                .up()
                .ele('ns2:remetente')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('ns2:originadora')
                .ele('contraChave').txt('E-ATENDE-VERSAO').up()
                .ele('uuidInstalacao').txt(uuidInstalacao).up()
                .ele('cpfOuCnpj').txt(estabelecimento.cnpj.replace(/[^0-9]+/g, '')).up()
                .ele('nomeOuRazaoSocial').txt(estabelecimento.nomeFantasia).up()
                .ele('versaoSistema').txt(versao).up()
                .ele('nomeBancoDados').txt('MySQL').up()
                .up()
                .ele('versao', { major: major, minor: minor, revision: revision })
                .doc();

            var qtdAtendimentosValidos = listAtendimentos.length;

            listAtendimentos.forEach(atendimento => {
                const listProcedimentoChild = list.procedimentos.filter(x => x.idAtendimento == atendimento.idAtendimento);
                const listCiap2 = list.condicaoCiaps.filter(x => x.idAtendimento == atendimento.idAtendimento);
                const listCid10 = list.condicaoAvaliacao.filter(x => x.idAtendimento == atendimento.idAtendimento);

                let atend = fragment({ keepNullAttributes: false, keepNullNodes: false }).ele('atendimentosDomiciliares')
                    .ele('turno').txt(atendimento.turno).up()
                    .ele('cnsCidadao').txt(atendimento.cartaoSus ? atendimento.cartaoSus : undefined).up()
                    .ele('dataNascimento').txt(new Date(atendimento.dataNascimento).getTime()).up()
                    .ele('sexo').txt(atendimento.sexo).up()
                    .ele('localAtendimento').txt(atendimento.localDeAtendimentoSus ? atendimento.localDeAtendimentoSus : '').up()
                    .ele('atencaoDomiciliarModalidade').txt(atendimento.modalidade).up()
                    .ele('tipoAtendimento').txt(atendimento.tipoAtendimentoSus ? atendimento.tipoAtendimentoSus : undefined).up()
                    .ele('condicoesAvaliadas').txt(atendimento.condicaoAvaliada ? atendimento.condicaoAvaliada > 0 ? atendimento.condicaoAvaliada : undefined : undefined).up()

                if (listCid10.length > 0) {
                    atend.ele('cid').txt(listCid10[0].cid_10).up()
                }

                if (listCiap2.length > 0) {
                    atend.ele('ciap').txt(listCiap2[0].ciap2).up()
                }

                let child = preencheProcedimentos(listProcedimentoChild);
                child.forEach(x => atend.find(x => x.node.nodeName == 'atendimentosDomiciliares', true, true).import(x));

                atend.ele('condutaDesfecho').txt(atendimento.condutaEncaminhamento ? atendimento.condutaEncaminhamento : atendimento.condutaDesfecho).up()

                doc.find(x => x.node.nodeName == 'ns4:fichaAtendimentoDomiciliarMasterTransport', true, true).import(atend);

                let fieldToValidate = ['cpfCidadao', 'cnsCidadao', 'localDeAtendimento', 'tipoAtendimento', 'alturaAcompanhamentoNutricional', 'pesoAcompanhamentoNutricional', 'condicoesAvaliadas', 'condutaDesfecho', 'ine'];

                fieldToValidate.forEach(field => {
                    doc.each(x => {
                        if (x.node.nodeName == field && !x.node._firstChild._data) {
                            x.node.removeChild(x.node._firstChild);
                            x.remove();
                        }
                    }, true, true)
                })
            })

            if (qtdAtendimentosValidos == 0) { return; }

            doc.find(x => x.node.nodeName == 'ns4:fichaAtendimentoDomiciliarMasterTransport', true, true).up();

            xmls.push(doc.doc().end({ prettyPrint: true, allowEmptyTags: false }));
        })

        return xmls;
    }




}