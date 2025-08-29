import sampleReceitas from "../data/sampleReceitas.js";

async function buscarReceitas() {
  try {
    const response = await fetch('http://localhost:3000');
    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }
    const dados = await response.json(); 
    return dados;
  } catch (error) {
    console.error('Erro ao buscar receitas, usando dados locais:', error);
    return sampleReceitas;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const resultado = document.getElementById('resultado');
  const receitas = await buscarReceitas();

  if (receitas && receitas.length > 0) {
    resultado.innerHTML = receitas.map(receita => `
      <div class="receita">
        <h3>${receita.nome}</h3>
        <p><strong>Porções:</strong> ${receita.porcoes}</p>
        <p><strong>Ingredientes:</strong> ${receita.ingredientes.join(", ")}</p>
        <p><strong>Preparo:</strong> ${receita.preparo}</p>
      </div>
    `).join('');
  } else {
    resultado.textContent = 'Nenhuma receita encontrada.';
  }
});
