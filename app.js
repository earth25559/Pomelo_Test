'use strict';

const Hapi = require('@hapi/hapi');
const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    await server.register(require('@hapi/vision'));
    await server.register(require('@hapi/inert'));

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'view',
    });
    server.route({
        method: 'GET',
        path: '/helper.js',
        handler: function (request, reply) {

            return reply.file('./static/helper.js');
        }
    });

    server.route({
        method: 'GET',
        path: '/main.css',
        handler: function (request, reply) {

            return reply.file('./static/main.css');
        }
    });

    server.route({
        method: 'POST',
        path: '/',
        handler: (request, reply) => {
            let result = []
            let temp_dict = {}
            if(request.payload == undefined){
                return 'No payload'
            }
            function transform_obj(test_obj) {
                for (const value of Object.values(test_obj)) {
                    value.forEach((node) => {        
                        if (node['parent_id'] == null) {
                            result.push(node)
                        }
                        temp_dict[node['id']] = node
                        if (node['parent_id'] != null) {
                            temp_dict[node['parent_id']].children.push(node)
                        }
            
                    })      
                  }  
            } 
            try {         
            transform_obj(request.payload)
            } catch(err){
                console.log(err) 
                return err
            }
            let answer = {"answer": result}
            return answer
        }
    });
    
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            return reply.view('index')
        }

    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();