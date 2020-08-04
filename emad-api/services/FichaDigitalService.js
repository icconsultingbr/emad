const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const util = require('util');

function FichaDigitalService() {
}

FichaDigitalService.prototype.enviaFicha = function (obj, url, html) { 
    return new Promise((resolve, reject) => {        
        
        var htmlResult = html;        
        for(var item in obj){        
            htmlResult = htmlResult.replace("{{" + item + "}}", obj[item]);         
        }
    
        var guid =  uuidv4();
        var arquivoCompleto = __dirname + '/../xml/file-' + guid + '.xml';
    
        fs.writeFile(arquivoCompleto, htmlResult, (err) => {
            if (err){ reject(err); return;}

            var FormData = require('form-data');
            var form = new FormData();
            form.append('userName', 'admin');
            form.append('password', 'admin');
            form.append('action', 'print');
            form.append('xmlFile', fs.createReadStream(arquivoCompleto));            
    
            form.submit(url, function (err, res) {  
                    fs.unlink(arquivoCompleto, (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        else
                            resolve(res.statusCode);
                    });                
                });
        });
    });    
}

FichaDigitalService.prototype.enviaFichaSync = async function (obj, url, html) { 
        var htmlResult = html;        
        for(var item in obj){        
            htmlResult = htmlResult.replace("{{" + item + "}}", obj[item]);         
        }
    
        var guid =  uuidv4();
        var arquivoCompleto = __dirname + '/../xml/file-' + guid + '.xml';
    
        const writeFile = util.promisify(fs.writeFile);
        const unlink = util.promisify(fs.unlink);
        

        await writeFile(arquivoCompleto, htmlResult);

        var FormData = require('form-data');
            var form = new FormData();
            form.append('userName', 'admin');
            form.append('password', 'admin');
            form.append('action', 'print');
            form.append('xmlFile', fs.createReadStream(arquivoCompleto));            
            
            //const submit = util.promisify(form.submit);
            form.submit(url);
            await unlink(arquivoCompleto);

            // await new Promise((resolve, reject) => {
            //     submit(url,  function (err, res) {  
            //        fs.unlink(arquivoCompleto); 
            //         resolve();                   
            //     }); 
            // });
}

module.exports = function () {
    return FichaDigitalService;
}
