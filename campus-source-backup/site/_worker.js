const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json;charset=UTF-8"}});
const stagingBanner='<div role="status" style="position:sticky;top:0;z-index:2147483647;padding:10px 16px;background:#7c2d12;color:#fff;text-align:center;font:700 14px/1.35 system-ui,sans-serif">ENTORNO DE PRUEBAS · No introducir datos personales ni usar cuentas de producción.</div>';

async function handleContact(){
  return json({error:"El formulario de contacto está desactivado en el entorno de pruebas."},503);
}

function withStagingBanner(response){
  const contentType=response.headers.get("content-type")||"";
  if(!contentType.includes("text/html"))return response;
  return new HTMLRewriter().on("body",{element(element){element.prepend(stagingBanner,{html:true})}}).transform(response);
}

export default{async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==="/api/contact"){
    if(request.method==="OPTIONS")return new Response(null,{status:204});
    if(request.method!=="POST")return json({error:"Método no permitido."},405);
    return handleContact(request,env);
  }
  return withStagingBanner(await env.ASSETS.fetch(request));
}};
