/* Disponibilidade dos lotes — fonte única: status.json (editado a cada repasse datado do Junio).
   Aplica overrides sobre o lotes.json já carregado pela página. Valores: livre|reservado|vendido. */
window.RDPStatus = (function(){
  const MAP = {livre:'tabela_out2026', vendido:'vendido', reservado:'reservado'};
  async function aplicar(url, data){
    let st = null;
    try { st = await (await fetch(url + (url.includes('?')?'&':'?') + 'v=1')).json(); } catch(e){ return null; }
    const ov = (st && st.overrides) || {};
    for (const f of Object.keys(ov)){
      if (!data[f] || !data[f].quadras) continue;
      for (const q of Object.keys(ov[f])){
        const qq = data[f].quadras[q]; if (!qq) continue;
        for (const l of Object.keys(ov[f][q])){
          if (!qq[l]) continue;
          const v = ov[f][q][l];
          qq[l].status = MAP[v] || v;
        }
      }
    }
    return st;
  }
  function linha(st){
    if (!st || !st.atualizado_em) return '';
    return 'Disponibilidade atualizada em ' + st.atualizado_em + (st.fonte ? ' — ' + st.fonte : '') + '.';
  }
  return {aplicar, linha};
})();
