// ✅ BURAYA KENDİ SHEET ID'n’İ YAZ
const SHEET_ID = "1U8lzuIldcPoZBo-IDWKfpGd24BX5n1vmGeF4Rm2pLzM";

// ✅ Sheet’i JSON yapan endpoint
const URL = `https://opensheet.elk.sh/${SHEET_ID}/Matematik`;

let data = [];
let dersler = new Set();

function loadAll() {
  let dersList = ["Matematik","Türkçe","Sosyal Bilgiler","Fen ve Teknoloji","Diğer Diller","İngilizce"];

  let promises = dersList.map(d =>
    fetch(`https://opensheet.elk.sh/${SHEET_ID}/${d}`).then(r=>r.json())
  );

  Promise.all(promises).then(res => {
    res.forEach((dersData, i) => {
      dersData.forEach(row => {
        data.push({
          ders: dersList[i],
          icerik: row["İçerik"],
          soruID: row["Question ID"],
          link: row["Link"]
        });
        dersler.add(dersList[i]);
      });
    });

    setupFilters();
    render();
  });
}

function setupFilters() {
  const sel = document.getElementById("ders");
  sel.innerHTML = `<option value="">Tümü</option>` + [...dersler].map(d => `<option>${d}</option>`).join("");

  sel.onchange = render;
  document.getElementById("search").oninput = render;

  // Tema
  document.getElementById("tema").value = localStorage.getItem("tema") || "#111";
  document.body.style.background = localStorage.getItem("tema") || "#111";

  document.getElementById("tema").oninput = (e)=>{
    document.body.style.background = e.target.value;
    localStorage.setItem("tema", e.target.value);
  }
}

function render() {
  const ders = document.getElementById("ders").value.toLowerCase();
  const q = (document.getElementById("search").value || "").toLowerCase();

  const div = document.getElementById("results");
  div.innerHTML = "";

  data.filter(r =>
    r.ders.toLowerCase().includes(ders) &&
    (r.icerik + r.soruID).toLowerCase().includes(q)
  ).forEach(r=>{
    div.innerHTML += `
      <div class="card">
        <b>❓ ${r.ders}</b>
        <div>${r.icerik}</div>
        <div class="footer">
          <span>📌 Soru</span>
          <a target="_blank" style="color:#5bc0ff" href="${r.link}">🔗 Aç</a>
        </div>
      </div>
    `;
  });
}

loadAll();
