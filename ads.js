/* ads.js — carga los banners de Adsterra aislados en su propio iframe.
   Sin esto, los dos banners comparten la variable global atOptions
   y el segundo pisa al primero: solo carga uno. */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".ad[data-key]").forEach(slot => {
    const key = slot.dataset.key;
    const w   = slot.dataset.w;
    const h   = slot.dataset.h;

    const f = document.createElement("iframe");
    f.width  = w;
    f.height = h;
    f.scrolling = "no";
    f.style.border = "0";
    f.style.display = "block";
    f.style.maxWidth = "100%";
    slot.appendChild(f);

    const d = f.contentWindow.document;
    d.open();
    d.write(
      '<body style="margin:0;padding:0">' +
      '<script>atOptions={"key":"' + key + '","format":"iframe","height":' + h + ',"width":' + w + ',"params":{}};<\/script>' +
      '<script src="https://www.highperformanceformat.com/' + key + '/invoke.js"><\/script>' +
      '</body>'
    );
    d.close();
  });
});
