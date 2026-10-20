(function(){
'use strict';
function initials(label){return String(label||'?').trim().split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'?'}
function waitForClient(done){if(window.supabase&&window.SUPABASE_URL&&window.SUPABASE_PUBLISHABLE_KEY){done();return}setTimeout(()=>waitForClient(done),100)}
function setPreview(label,url){const image=document.querySelector('#avatar-image');const fallback=document.querySelector('#avatar-initials');if(url){image.src=url;image.hidden=false;fallback.hidden=true}else{image.removeAttribute('src');image.hidden=true;fallback.hidden=false;fallback.textContent=initials(label)}}
function sizeLabel(bytes){return bytes<1024*1024?(bytes/1024).toFixed(0)+' KB':(bytes/1024/1024).toFixed(2)+' MB'}
waitForClient(async()=>{
 const client=window.__academySessionClient||window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
 const fileInput=document.querySelector('#avatar-file'),choose=document.querySelector('#avatar-choose'),remove=document.querySelector('#avatar-remove'),save=document.querySelector('#avatar-save'),cancel=document.querySelector('#avatar-cancel'),meta=document.querySelector('#avatar-meta'),message=document.querySelector('#avatar-message'),crop=document.querySelector('#avatar-crop'),zoom=document.querySelector('#avatar-zoom');
 const setMessage=(text,type)=>{message.textContent=text;message.className='avatar-message '+(type||'')};
 let pendingFile=null,pendingUrl='',sourceImage=null;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const ctx=canvas.getContext('2d');
 function canvasBlob(){const dataUrl=canvas.toDataURL('image/jpeg',.92),base64=dataUrl.split(',')[1],bytes=Uint8Array.from(atob(base64),char=>char.charCodeAt(0));return new Blob([bytes],{type:'image/jpeg'})}
 function clearPending(){if(pendingUrl)URL.revokeObjectURL(pendingUrl);pendingFile=null;pendingUrl='';sourceImage=null;save.disabled=true;cancel.hidden=true;crop.hidden=true;zoom.value='1';meta.textContent='Selecciona una imagen para ver sus datos.';fileInput.value=''}
 function drawCrop(){
  if(!sourceImage||!pendingFile)return;
  const zoomValue=Number(zoom.value||1),side=Math.min(sourceImage.naturalWidth,sourceImage.naturalHeight)/zoomValue;
  const sx=(sourceImage.naturalWidth-side)/2,sy=(sourceImage.naturalHeight-side)/2;
  ctx.clearRect(0,0,512,512);ctx.drawImage(sourceImage,sx,sy,side,side,0,0,512,512);
  setPreview(pendingFile.name,canvas.toDataURL('image/jpeg',.92));
  meta.textContent=pendingFile.name+' · '+sizeLabel(pendingFile.size)+' · recorte 512 × 512 px';
 }
 function prepareFile(file){
  if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){setMessage('Usa una imagen JPG, PNG o WebP.','error');fileInput.value='';return}
  if(file.size>2*1024*1024){setMessage('La imagen no puede superar 2 MB.','error');fileInput.value='';return}
  if(pendingUrl)URL.revokeObjectURL(pendingUrl);pendingFile=file;pendingUrl=URL.createObjectURL(file);zoom.value='1';crop.hidden=false;save.disabled=true;cancel.hidden=false;setMessage('Ajusta el encuadre y pulsa «Guardar foto».','');
  sourceImage=new Image();sourceImage.onload=()=>{drawCrop();save.disabled=false};sourceImage.src=pendingUrl;
 }
 fileInput.addEventListener('change',()=>prepareFile(fileInput.files?.[0]));zoom.addEventListener('input',drawCrop);
 let user=null;
 async function load(){
  const result=await client.from('profiles').select('display_name,avatar_path').eq('id',user.id).maybeSingle();if(result.error){setMessage('No se ha podido cargar la foto de perfil.','error');return}
  const profile=result.data||{},label=profile.display_name||user.user_metadata?.display_name||user.email;let url='';
  if(profile.avatar_path){const signed=await client.storage.from('avatars').createSignedUrl(profile.avatar_path,3600);url=signed.data?.signedUrl||''}
  setPreview(label,url);remove.hidden=!profile.avatar_path;if(!pendingFile)clearPending()
 }
 document.querySelector('#avatar-preview').addEventListener('click',()=>fileInput.click());
 const ensureUser=()=>{if(user)return true;setMessage('La sesión todavía no está lista. Espera un momento y vuelve a intentarlo.','error');return false};
 cancel.addEventListener('click',async()=>{if(!ensureUser())return;await load();setMessage('Cambios cancelados.','')});
 function withTimeout(promise,message,ms=15000){return Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error(message)),ms))}
 function restoreSaveControls(){choose.classList.remove('is-disabled');choose.removeAttribute('aria-disabled');save.disabled=!pendingFile||!sourceImage;cancel.disabled=false;remove.disabled=false}
 save.addEventListener('click',async()=>{
  if(!ensureUser())return;
  if(!pendingFile||!sourceImage)return;const file=pendingFile;choose.classList.add('is-disabled');choose.setAttribute('aria-disabled','true');save.disabled=true;cancel.disabled=true;remove.disabled=true;setMessage('Guardando la foto…','');
  let path=null;
  try{
   setMessage('Preparando la imagen…','');
   const croppedBlob=await withTimeout(Promise.resolve(canvasBlob()),'No se ha podido preparar el recorte.',10000);if(!croppedBlob)throw new Error('No se ha podido preparar el recorte.');
   path=user.id+'/avatar-'+crypto.randomUUID()+'.jpg';
   const oldResult=await withTimeout(client.from('profiles').select('avatar_path').eq('id',user.id).maybeSingle(),'No se ha podido leer tu perfil.',10000);if(oldResult.error)throw oldResult.error;
   const old=oldResult.data?.avatar_path||null;
   setMessage('Subiendo la imagen…','');
   const upload=await withTimeout(client.storage.from('avatars').upload(path,croppedBlob,{contentType:'image/jpeg',upsert:false}),'La subida ha tardado demasiado. Comprueba tu conexión y vuelve a intentarlo.',12000);
   if(upload.error)throw new Error('No se ha podido subir la imagen: '+(upload.error.message||'error de almacenamiento'));
   setMessage('Guardando la foto en tu perfil…','');
   const update=await withTimeout(client.from('profiles').update({avatar_path:path}).eq('id',user.id),'No se ha podido guardar la ruta de la foto.',12000);if(update.error)throw new Error('La imagen se subió pero no se pudo guardar el perfil: '+(update.error.message||'error de perfil'));
   if(old)await client.storage.from('avatars').remove([old]);await load();setMessage('Foto de perfil guardada.','success');
  }catch(error){
   if(path)await client.storage.from('avatars').remove([path]).catch(()=>{});
   setMessage(error?.message||'No se ha podido guardar la foto. Puedes volver a intentarlo.','error');
  }finally{restoreSaveControls()}
 });
 remove.addEventListener('click',async()=>{
  if(!ensureUser())return;
  const profile=(await client.from('profiles').select('avatar_path').eq('id',user.id).maybeSingle()).data;if(!profile?.avatar_path)return;
  remove.disabled=true;choose.classList.add('is-disabled');choose.setAttribute('aria-disabled','true');setMessage('Eliminando la foto…','');
  const update=await client.from('profiles').update({avatar_path:null}).eq('id',user.id);
  if(update.error){setMessage('No se ha podido eliminar la foto.','error');remove.disabled=false;choose.classList.remove('is-disabled');choose.removeAttribute('aria-disabled');return}
  await client.storage.from('avatars').remove([profile.avatar_path]);await load();setMessage('Foto eliminada.','success');remove.disabled=false;choose.classList.remove('is-disabled');choose.removeAttribute('aria-disabled');
 });
 const session=await new Promise(resolve=>{
  let finished=false;
  const finish=value=>{if(finished)return;finished=true;subscription?.unsubscribe();resolve(value)};
  const {data:{subscription}}=client.auth.onAuthStateChange((_event,currentSession)=>{if(currentSession?.user)finish(currentSession)});
  client.auth.getSession().then(result=>{if(result.error)finish(null);else if(result.data?.session)finish(result.data.session)}).catch(()=>finish(null));
  setTimeout(()=>finish(null),8000);
 });
 if(!session?.user){setMessage('No se ha podido recuperar tu sesión. Inicia sesión de nuevo.','error');return}
 user=session.user;
 await load();
});
})();