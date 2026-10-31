const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json;charset=UTF-8"}});

async function handleContact(){
  return json({error:"El formulario de contacto está desactivado en el entorno de pruebas."},503);
}

export default{async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==="/api/contact"){
    if(request.method==="OPTIONS")return new Response(null,{status:204});
    if(request.method!=="POST")return json({error:"Método no permitido."},405);
    return handleContact(request,env);
  }
  return env.ASSETS.fetch(request);
}};
