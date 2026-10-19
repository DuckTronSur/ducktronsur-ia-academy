const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json;charset=UTF-8"}});
const escapeHtml=value=>String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
async function handleContact(request,env){
  let body;
  try{body=await request.json()}catch{return json({error:"El formulario no tiene un formato válido."},400)}
  if(body.website)return json({ok:true},200);
  const type=["DUDA","AYUDA","COLABORACIÓN"].includes(body.type)?body.type:"";
  const name=String(body.name||"").trim();
  const email=String(body.email||"").trim();
  const message=String(body.message||"").trim();
  if(!type||!name||!/^\S+@\S+\.\S+$/.test(email)||message.length<10||message.length>5000||body.privacy!=="on")return json({error:"Revisa los campos obligatorios y acepta la política de privacidad."},400);
  const apiKey=env.BREVO_API_KEY;
  const sender=env.CONTACT_SENDER_EMAIL;
  const recipient=env.CONTACT_TO_EMAIL||"ducktronsur@encuentraelsur.com";
  if(!apiKey||!sender)return json({error:"El formulario está preparado, pero aún falta configurar el servicio de correo."},503);
  const response=await fetch("https://api.brevo.com/v3/smtp/email",{method:"POST",headers:{"accept":"application/json","api-key":apiKey,"content-type":"application/json"},body:JSON.stringify({sender:{email:sender,name:"DuckTronSur IA Academy"},to:[{email:recipient}],replyTo:{email,name},subject:"["+type+"] Nuevo mensaje desde DuckTronSur IA Academy",htmlContent:"<h2>Nuevo mensaje de contacto</h2><p><strong>Tipo:</strong> "+escapeHtml(type)+"</p><p><strong>Nombre:</strong> "+escapeHtml(name)+"</p><p><strong>Email:</strong> "+escapeHtml(email)+"</p><p><strong>Mensaje:</strong></p><p>"+escapeHtml(message).replace(/\n/g,"<br>")+"</p>"})});
  if(!response.ok){console.error("Brevo email rejected",{status:response.status});return json({error:"No se ha podido entregar el mensaje. Código del proveedor: BREVO_"+response.status},502)}
  return json({ok:true},200)
}
export default{async fetch(request,env,ctx){
  const url=new URL(request.url);
  if(url.pathname==="/api/contact"){
    if(request.method==="OPTIONS")return new Response(null,{status:204});
    if(request.method!=="POST")return json({error:"Método no permitido."},405);
    return handleContact(request,env);
  }
  const response=await env.ASSETS.fetch(request);
  const type=response.headers.get("content-type")||"";
  return response;
}};