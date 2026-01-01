/* Resume Studio Pro Script - Fixed Mobile Keyboard Issue */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const form = document.getElementById('resume-form');
  const previewContainer = document.getElementById('preview-container');
  const resumeRoot = document.getElementById('resume-root');
  
  // Inputs
  const inputs = {
    name: document.getElementById('name'),
    title: document.getElementById('title'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    website: document.getElementById('website'),
    summary: document.getElementById('summary'),
    skills: document.getElementById('skills'),
    accent: document.getElementById('accent-color'),
    font: document.getElementById('font-select'),
    template: document.getElementsByName('template')
  };

  // Preview Targets
  const targets = {
    name: document.getElementById('r-name'),
    title: document.getElementById('r-title'),
    email: document.getElementById('r-email'),
    phone: document.getElementById('r-phone'),
    website: document.getElementById('r-website'),
    summary: document.getElementById('r-summary'),
    skills: document.getElementById('r-skills'),
    expList: document.getElementById('r-experience'),
    root: document.getElementById('resume-root'),
    photos: document.querySelectorAll('.resume-photo-img'),
    photoBoxes: document.querySelectorAll('.photo-box')
  };

  // State
  let experiences = [
    { company: 'Tech Solutions Inc.', role: 'Senior Developer', date: '2020 - Present', desc: 'Led a team of 5 developers to build a SaaS platform.' }
  ];
  let photoData = null;

  // --- Functions ---

  // 1. Update Text Fields
  function updatePreview() {
    targets.name.textContent = inputs.name.value || 'Your Name';
    targets.title.textContent = inputs.title.value || 'Job Title';
    targets.email.textContent = inputs.email.value || 'email@example.com';
    targets.phone.textContent = inputs.phone.value || '555-010-0101';
    targets.website.textContent = inputs.website.value || 'portfolio.com';
    targets.summary.textContent = inputs.summary.value || 'Professional summary goes here...';
    
    // Skills (Tag Cloud)
    targets.skills.innerHTML = '';
    const skillsArr = inputs.skills.value.split(',').filter(s => s.trim().length > 0);
    if(skillsArr.length === 0) {
      targets.skills.innerHTML = '<span>Skill 1</span><span>Skill 2</span>';
    } else {
      skillsArr.forEach(skill => {
        const span = document.createElement('span');
        span.textContent = skill.trim();
        targets.skills.appendChild(span);
      });
    }

    // Styles
    targets.root.style.setProperty('--r-accent', inputs.accent.value);
    
    // Font Family
    const fontMap = {
      'inter': "'Inter', sans-serif",
      'merri': "'Merriweather', serif",
      'poppins': "'Poppins', sans-serif"
    };
    targets.root.style.fontFamily = fontMap[inputs.font.value];
  }

  // 2. Render Experience FORM (Only call on Add/Remove)
  function renderExperienceForm() {
    const listContainer = document.getElementById('experience-list');
    listContainer.innerHTML = '';
    
    experiences.forEach((exp, index) => {
      const div = document.createElement('div');
      div.className = 'exp-item-form';
      div.innerHTML = `
        <div class="exp-header">
          <strong>Entry #${index + 1}</strong>
          <button class="btn remove" onclick="removeExp(${index})">Remove</button>
        </div>
        <div class="grid-2">
          <input type="text" placeholder="Company" value="${exp.company}" oninput="updateExp(${index}, 'company', this.value)">
          <input type="text" placeholder="Role" value="${exp.role}" oninput="updateExp(${index}, 'role', this.value)">
        </div>
        <input type="text" style="margin-top:8px" placeholder="Date (e.g. 2021-2023)" value="${exp.date}" oninput="updateExp(${index}, 'date', this.value)">
        <textarea style="margin-top:8px; min-height:60px" placeholder="Description" oninput="updateExp(${index}, 'desc', this.value)">${exp.desc}</textarea>
      `;
      listContainer.appendChild(div);
    });
  }

  // 3. Render Experience PREVIEW (Call on typing)
  function renderExperiencePreview() {
    targets.expList.innerHTML = '';
    experiences.forEach(exp => {
      const item = document.createElement('div');
      item.className = 'exp-item';
      item.innerHTML = `
        <h4>${exp.role || 'Role'} <span class="company">at ${exp.company || 'Company'}</span></h4>
        <span class="date">${exp.date || 'Date'}</span>
        <p>${exp.desc || 'Description...'}</p>
      `;
      targets.expList.appendChild(item);
    });
  }

  // Global helpers for inline HTML events
  // FIX: This updates data & preview, but DOES NOT re-render the form inputs
  window.updateExp = (index, field, value) => {
    experiences[index][field] = value;
    renderExperiencePreview(); 
  };

  // FIX: This re-renders both form and preview since an item was removed
  window.removeExp = (index) => {
    experiences.splice(index, 1);
    renderExperienceForm(); 
    renderExperiencePreview();
  };

  document.getElementById('add-exp').addEventListener('click', () => {
    experiences.push({ company: '', role: '', date: '', desc: '' });
    renderExperienceForm();
    renderExperiencePreview();
  });

  // 4. Template Switching
  function updateTemplate() {
    const selected = document.querySelector('input[name="template"]:checked').value;
    targets.root.className = `resume ${selected}`;
    
    const isCreative = selected === 'creative';
    
    targets.photoBoxes.forEach(box => {
      const isSidebar = box.classList.contains('sidebar-photo');
      const isHeader = box.classList.contains('header-photo');
      
      if (!photoData) {
        box.classList.add('hidden');
      } else {
        if (isCreative && isSidebar) box.classList.remove('hidden');
        else if (!isCreative && isHeader) box.classList.remove('hidden');
        else box.classList.add('hidden');
      }
    });
  }

  // 5. Photo Upload Handling (Fixed Click Issues)
  const photoInput = document.getElementById('photo-input');
  const photoDrop = document.getElementById('photo-drop-zone');
  const photoMini = document.getElementById('photo-preview-mini');
  const uploadUi = document.querySelector('.upload-ui');
  const removePhotoBtn = document.getElementById('remove-photo');

  // TRIGGER CLICK: Allow clicking the box to open file dialog
  photoDrop.addEventListener('click', () => photoInput.click());

  // PREVENT LOOP: Stop input click from bubbling up to the box
  photoInput.addEventListener('click', (e) => e.stopPropagation());

  photoInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
  
  photoDrop.addEventListener('dragover', (e) => { 
    e.preventDefault(); 
    photoDrop.style.borderColor = 'var(--primary)'; 
    photoDrop.style.background = '#eff6ff';
  });

  photoDrop.addEventListener('dragleave', (e) => { 
    e.preventDefault(); 
    photoDrop.style.borderColor = 'var(--border)'; 
    photoDrop.style.background = '#f9fafb';
  });

  photoDrop.addEventListener('drop', (e) => { 
    e.preventDefault(); 
    photoDrop.style.borderColor = 'var(--border)';
    photoDrop.style.background = '#f9fafb';
    handleFile(e.dataTransfer.files[0]);
  });

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      photoData = e.target.result;
      photoMini.src = photoData;
      photoMini.classList.remove('hidden');
      uploadUi.classList.add('hidden');
      removePhotoBtn.classList.remove('hidden');
      targets.photos.forEach(img => img.src = photoData);
      updateTemplate();
    };
    reader.readAsDataURL(file);
  }

  removePhotoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    photoData = null;
    photoInput.value = '';
    photoMini.src = '';
    photoMini.classList.add('hidden');
    uploadUi.classList.remove('hidden');
    removePhotoBtn.classList.add('hidden');
    updateTemplate();
  });

  // 6. Mobile Toggle & Export
  const mobilePreviewBtn = document.getElementById('mobile-preview-btn');
  const closePreviewBtn = document.getElementById('close-mobile-preview');
  
  mobilePreviewBtn.addEventListener('click', () => previewContainer.classList.add('open'));
  closePreviewBtn.addEventListener('click', () => previewContainer.classList.remove('open'));

  document.getElementById('download-btn').addEventListener('click', async () => {
    const format = document.getElementById('export-format').value;
    const btn = document.getElementById('download-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Generating...';
    btn.disabled = true;

    if (format === 'pdf') {
      const element = document.getElementById('resume-root');
      const opt = {
        margin: 0,
        filename: `${inputs.name.value.replace(/\s+/g,'_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } else {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'></head><body>";
      const footer = "</body></html>";
      const html = header + document.getElementById('resume-root').innerHTML + footer;
      const blob = new Blob([html], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Resume.doc";
      a.click();
      URL.revokeObjectURL(url);
    }

    btn.textContent = originalText;
    btn.disabled = false;
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    if(confirm('Clear all data?')) {
      form.reset();
      experiences = [];
      if(photoData) removePhotoBtn.click();
      renderExperienceForm();
      renderExperiencePreview();
      updatePreview();
    }
  });

  document.querySelectorAll('.c-swatch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      inputs.accent.value = btn.dataset.c;
      updatePreview();
    });
  });
// --- Footer Year ---
  document.getElementById('year').textContent = new Date().getFullYear();
  // --- Initialization ---
  ['name','title','email','phone','website','summary','skills','accent','font'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePreview);
  });
  inputs.template.forEach(radio => radio.addEventListener('change', updateTemplate));

  // Initial Render
  renderExperienceForm();   // Builds the inputs
  renderExperiencePreview(); // Builds the preview
  updatePreview();
  updateTemplate();
});