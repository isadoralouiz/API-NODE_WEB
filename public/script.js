const API_URL = "http://localhost:3000/receitas";

const resultado = document.getElementById("resultado");
const salvarButon = document.getElementById("salvarButon");
const receitaIdInput = document.getElementById("receitaId");
const nomeInput = document.getElementById("nome");
const porcoesInput = document.getElementById("porcoes");
const ingredientesInput = document.getElementById("ingredientes");
const preparoInput = document.getElementById("preparo");

async function buscarReceitas() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Erro: ${response.status}`);
    return await response.json();
  } catch {
    const fallbackResponse = await fetch("./data/sampleDados.js");
    return await fallbackResponse.json();
  }
}

async function listarReceitas() {
  const receitas = await buscarReceitas();

  if (receitas && receitas.length > 0) {
    resultado.innerHTML = receitas
      .map(
        (receita) => `
      <div class="receita">
        <h3>${receita.nome}</h3>
        <p><strong>Porções:</strong> ${receita.porcoes}</p>
        <p><strong>Ingredientes:</strong> ${receita.ingredientes.join(", ")}</p>
        <p><strong>Preparo:</strong> ${receita.preparo}</p>
        <button onclick="editarReceita(${receita.id})">Editar</button>
        <button onclick="deletarReceita(${receita.id})">Deletar</button>
      </div>
    `
      )
      .join("");
  } else {
    resultado.textContent = "Nenhuma receita encontrada.";
  }
}

async function salvarReceita() {
  const id = receitaIdInput.value;
  const receita = {
    nome: nomeInput.value,
    porcoes: parseInt(porcoesInput.value),
    ingredientes: ingredientesInput.value.split(",").map((i) => i.trim()),
    preparo: preparoInput.value
  };

  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(receita)
    });
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(receita)
    });
  }

  receitaIdInput.value = "";
  nomeInput.value = "";
  porcoesInput.value = "";
  ingredientesInput.value = "";
  preparoInput.value = "";

  listarReceitas();
}

async function editarReceita(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const r = await res.json();
  receitaIdInput.value = r.id;
  nomeInput.value = r.nome;
  porcoesInput.value = r.porcoes;
  ingredientesInput.value = r.ingredientes.join(", ");
  preparoInput.value = r.preparo;
}

async function deletarReceita(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  listarReceitas();
}

salvarButon.addEventListener("click", salvarReceita);
document.addEventListener("DOMContentLoaded", listarReceitas);
