var http = require('http');

var fs = require('fs');

var path = require('path');

var mime = require('mime'); // 根据文件扩展名得出MIME类型的能力

// 缓存文件内容的对象
var cache = {};

var chatServer = require('socket.io');
chatServer.listen(server);

var server = http.createServer(function(request, response){
    var filePath = false;

    if(request.url == '/'){
        filePath = 'public/index.html';
    }else{
        filePath = 'public' + request.url;
    }

    var absPath = './' + filePath;
    serverStatic(response,cache,absPath);
});

server.listen(3000,function(){
    console.log("Server listening on part 3000.");
})

function send404(response){
    response.writeHead(404,{'Content-type':'text/plain'});
    response.write('Error 404 : resource not found');
    response.end();
}

function sendFile(response, filePath, fileContent){
    response.writeHead(
        200,
        {'content-type':
            mime.lookup( path.basename(filePath) )
        }
    );
    response.end(fileContent);
}
function serverStatic(response, cache, absPath){
    if(cache[absPath]){
        sendFile(response,absPath,cache[absPath]);
    } else {
        fs.exists(absPath, function(exists){
            if(exists){
                fs.readFile(absPath, function(err, data){
                    if(err){
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        })
    }
}