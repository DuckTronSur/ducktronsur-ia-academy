(function(){
'use strict';
function initials(label){return String(label||'?').trim().split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase()||'?'}
function waitForClient(done){
  if(window.supabase&&window.SUPABASE_URL&&window.SUPABASE_PUBLISHABLE_KEY){done();return}
  setTimeout(()=>waitForClient(done),100)
}
function setPreview(label,url){
  const image=document.querySelector('#avatar-image');
  const fallback=document.querySelector('#avatar-initials');
  if(url){image.src=url;image.hidden=false;fallback.hidden=true}
  else{image.removeAttribute('src');image.hidden=true;fallback.hidden=false;fallback.textContent=initials(label)}
}
waitForClient(async()=>{
  const client=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
  const fileInput=document.querySelector('#avatar-file');
  const choose=document.querySelector('#avatar-choose');
  const remove=document.querySelector('#avatar-remove');
  const message=document.querySelector('#avatar-message');
  const setMessage=(text,type)=>{message.textContent=text;message.className='avatar-message '+(type||'')};
  const {data,error}=await client.auth.getUser();
  if(error||!data.user){location.href='/auth.html';return}
  const user=data.user;
  async function load(){
    const result=await client.from('profiles').select('display_name,avatar_path').eq('id',user.id).maybeSingle();
    if(result.error){setMessage('No se ha podido cargar la foto de perfil.','error');return}
    const profile=result.data||{};
    const label=profile.display_name||user.user_metadata?.display_name||user.email;
    let url='';
    if(profile.avatar_path){
      const signed=await client.storage.from('avatars').createSignedUrl(profile.avatar_path,3600);
      url=signed.data?.signedUrl||'';
    }
    setPreview(label,url);
    remove.hidden=!profile.avatar_path;
  }
  choose.addEventListener('click',()=>fileInput.click());
  fileInput.addEventListener('change',async()=>{
    const file=fileInput.files?.[0];
    if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)){setMessage('Usa una imagen JPG, PNG o WebP.','error');fileInput.value='';return}
    if(file.size>2*1024*1024){setMessage('La imagen no puede superar 2 MB.','error');fileInput.value='';return}
    choose.disabled=true;remove.disabled=true;setMessage('Subiendo la imagen…','');
    const extension=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
    const path=user.id+'/avatar-'+crypto.randomUUID()+'.'+extension;
    const old=(await client.from('profiles').select('avatar_path').eq('id',user.id).maybeSingle()).data?.avatar_path||null;
    const upload=await client.storage.from('avatars').upload(path,file,{contentType:file.type,upsert:false});
    if(upload.error){setMessage('No se ha podido subir la imagen.','error');choose.disabled=false;remove.disabled=!old;fileInput.value='';return}
    const update=await client.from('profiles').update({avatar_path:path}).eq('id',user.id);
    if(update.error){await client.storage.from('avatars').remove([path]);setMessage('La imagen se subió pero no se pudo guardar el perfil.','error');choose.disabled=false;remove.disabled=!old;fileInput.value='';return}
    if(old)await client.storage.from('avatars').remove([old]);
    await load();setMessage('Foto de perfil guardada.','success');choose.disabled=false;remove.disabled=false;fileInput.value='';
  });
  remove.addEventListener('click',async()=>{
    const profile=(await client.from('profiles').select('avatar_path').eq('id',user.id).maybeSingle()).data;
    if(!profile?.avatar_path)return;
    remove.disabled=true;choose.disabled=true;setMessage('Eliminando la foto…','');
    const update=await client.from('profiles').update({avatar_path:null}).eq('id',user.id);
    if(update.error){setMessage('No se ha podido eliminar la foto.','error');remove.disabled=false;choose.disabled=false;return}
    await client.storage.from('avatars').remove([profile.avatar_path]);
    await load();setMessage('Foto eliminada.','success');remove.disabled=false;choose.disabled=false;
  });
  await load();
});
})();