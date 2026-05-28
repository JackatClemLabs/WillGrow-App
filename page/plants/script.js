import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  'https://ihjxxmfqitxonerzmmdo.supabase.co',
  'sb_publishable_eJduH_P-XJlYAQEC49aWCQ_f52mEHh2'
);

const backdrop  = document.getElementById('modalBackdrop');
const openBtn   = document.getElementById('addSensorBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn   = document.getElementById('saveBtn');
const plantList = document.getElementById('plantList');

const nameInput  = document.getElementById('plantName');
const noteInput  = document.getElementById('plantNote');
const colorInput = document.getElementById('plantColor');

function resetFields() {
  nameInput.value = '';
  noteInput.value = '';
  colorInput.value = '#7ab48c';
}

function openModal() {
  resetFields();
  backdrop.classList.add('open');
  nameInput.focus();
}

function closeModal() {
  backdrop.classList.remove('open');
}

openBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
cancelBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

function renderPlant(plant) {
  const row = document.createElement('div');
  row.className = 'plant-row';

  // relative path so it works regardless of where Live Server is rooted
  row.addEventListener('click', () => {
    window.location.href = `plant.html?id=${plant.id}`;
  });

  const dot = document.createElement('div');
  dot.className = 'plant-dot';
  dot.style.background = plant.dot_color || '#7ab48c';

  const info = document.createElement('div');
  info.className = 'plant-info';

  const title = document.createElement('h4');
  title.textContent = plant.name;

  const desc = document.createElement('p');
  desc.textContent = plant.note || 'No description';

  info.appendChild(title);
  info.appendChild(desc);
  row.appendChild(dot);
  row.appendChild(info);
  plantList.appendChild(row);
}

saveBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim();
  if (!name) { nameInput.focus(); return; }

  const { data, error } = await supabase
    .from('plants')
    .insert({ name, note: noteInput.value.trim(), dot_color: colorInput.value })
    .select()
    .single();

  if (error) {
    console.error('Save failed:', error);
    alert('Save failed: ' + error.message);
    return;
  }

  renderPlant(data);
  closeModal();
});

async function loadPlants() {
  plantList.innerHTML = '';
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) { console.error(error); return; }

  if (!data.length) {
    plantList.innerHTML = '<p class="empty-state">No plants yet. Tap + to add one.</p>';
    return;
  }

  data.forEach(renderPlant);
}

loadPlants();