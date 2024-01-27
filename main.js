const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder')

const posts = [];
let currentId = 1;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname
  const trimPath = path.replace(/^\/+|\/+$/g, '');

  const method = req.method.toUpperCase();

  console.log('method', method);
  console.log('trimPath', trimPath);
  
  const mainPath = trimPath.split('/')[0];
  let id = trimPath.split('/')[1] || null;

  if (id) {
    id = parseInt(id) || "invalid";
  }

  let result = '';


  const decoder = new StringDecoder('utf-8')

  req.on('data', (data) => {
    console.log("data", data)
    result += decoder.write(data);
  })

  req.on('end', () => {
    result += decoder.end();

    if (mainPath === "posts" && !id) {
      switch (method) {
        case 'POST':
          console.log("enter POST")
          const newPost = JSON.parse(result);
          console.log(newPost)
          newPost.id = currentId++;
          posts.push(newPost);
          res.writeHead(201, {
            'Content-Type': 'application/json'
          })
          res.end(JSON.stringify(newPost));
          break;
        case 'GET':
          res.writeHead(200, {
            'Content-Type': 'application/json'
          })
          res.end(JSON.stringify(posts))
      }
    } else if (mainPath === "posts" && id) {
        console.log("entered posts/:id");
        switch (method) {
          case 'GET':
            const post = posts.find(el => el.id === id);
            console.log('post', post);
            if (post) {
              res.writeHead(200, {
                'Content-Type': 'application/json'
              })
              res.end(JSON.stringify(post))
            } else {
              res.writeHead(404, {
                'Content-Type': 'application/json'
              })
              res.end(JSON.stringify({
                message: "Post not found!!!"
              }))
            }

        }
    }
  })
})

server.listen(3000, () => { 
  console.log("server is running on localhost:3000")
})