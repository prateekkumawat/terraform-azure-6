// PulseEmp AWS Employee Management App Logic

(function () {
  // Global State
  let state = {
    employees: [],
    filterDept: 'ALL',
    sortBy: 'name',
    searchQuery: '',
    viewMode: 'grid', // 'grid' or 'table'
    executionMode: 'demo', // 'demo' or 'aws'
    awsConfig: { ...AWS_CONFIG },
    authToken: null,
    authUser: null,
    uploadedPhotoUrl: ''
  };

  // Mock initial dataset for Demo Mode
  const MOCK_EMPLOYEES = [
    {
      empId: 'EMP-A9F1',
      name: 'Elena Rostova',
      email: 'elena.rostova@pulseemp.io',
      department: 'Engineering',
      role: 'Principal Cloud Architect',
      salary: 145000,
      dateOfJoining: '2022-03-15',
      phone: '+1 (555) 234-5678',
      profilePicUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      empId: 'EMP-B4D2',
      name: 'Marcus Vance',
      email: 'marcus.vance@pulseemp.io',
      department: 'Engineering',
      role: 'Senior DevOps Engineer',
      salary: 128000,
      dateOfJoining: '2021-08-10',
      phone: '+1 (555) 876-5432',
      profilePicUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      empId: 'EMP-C7E3',
      name: 'Aisha Patel',
      email: 'aisha.patel@pulseemp.io',
      department: 'Design',
      role: 'Lead UI/UX Designer',
      salary: 115000,
      dateOfJoining: '2023-01-20',
      phone: '+1 (555) 345-6789',
      profilePicUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      empId: 'EMP-D1A4',
      name: 'David Chen',
      email: 'david.chen@pulseemp.io',
      department: 'Product',
      role: 'Product Manager',
      salary: 130000,
      dateOfJoining: '2020-11-05',
      phone: '+1 (555) 901-2345',
      profilePicUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'On Leave',
      createdAt: new Date().toISOString()
    },
    {
      empId: 'EMP-E5K8',
      name: 'Sophia Martinez',
      email: 'sophia.m@pulseemp.io',
      department: 'Human Resources',
      role: 'HR Business Partner',
      salary: 95000,
      dateOfJoining: '2022-09-01',
      phone: '+1 (555) 432-1098',
      profilePicUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150',
      status: 'Active',
      createdAt: new Date().toISOString()
    }
  ];

  // DOM Elements
  const elements = {
    modeToggle: document.getElementById('modeToggle'),
    modeStatusText: document.getElementById('modeStatusText'),
    searchInput: document.getElementById('searchInput'),
    departmentFilter: document.getElementById('departmentFilter'),
    sortBySelect: document.getElementById('sortBySelect'),
    refreshBtn: document.getElementById('refreshBtn'),
    openAddModalBtn: document.getElementById('openAddModalBtn'),
    viewGridBtn: document.getElementById('viewGridBtn'),
    viewTableBtn: document.getElementById('viewTableBtn'),
    
    // Grid & Table
    employeeGrid: document.getElementById('employeeGrid'),
    employeeTableContainer: document.getElementById('employeeTableContainer'),
    employeeTableBody: document.getElementById('employeeTableBody'),
    loadingState: document.getElementById('loadingState'),
    emptyState: document.getElementById('emptyState'),

    // Stats
    statTotalEmployees: document.getElementById('statTotalEmployees'),
    statDepartments: document.getElementById('statDepartments'),
    statPayroll: document.getElementById('statPayroll'),
    statS3Uploads: document.getElementById('statS3Uploads'),

    // Employee Modal
    employeeModal: document.getElementById('employeeModal'),
    modalTitle: document.getElementById('modalTitle'),
    employeeForm: document.getElementById('employeeForm'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelFormBtn: document.getElementById('cancelFormBtn'),
    formEmpId: document.getElementById('formEmpId'),
    formName: document.getElementById('formName'),
    formEmail: document.getElementById('formEmail'),
    formDepartment: document.getElementById('formDepartment'),
    formRole: document.getElementById('formRole'),
    formSalary: document.getElementById('formSalary'),
    formDateOfJoining: document.getElementById('formDateOfJoining'),
    formPhone: document.getElementById('formPhone'),
    formStatus: document.getElementById('formStatus'),
    formProfilePicUrl: document.getElementById('formProfilePicUrl'),

    // S3 Dropzone
    s3Dropzone: document.getElementById('s3Dropzone'),
    fileInput: document.getElementById('fileInput'),
    dropzonePrompt: document.getElementById('dropzonePrompt'),
    photoPreviewContainer: document.getElementById('photoPreviewContainer'),
    photoPreviewImg: document.getElementById('photoPreviewImg'),
    removePhotoBtn: document.getElementById('removePhotoBtn'),

    // Auth & Config Modals
    sidebarUser: document.getElementById('sidebarUser'),
    authActionBtn: document.getElementById('authActionBtn'),
    cognitoModal: document.getElementById('cognitoModal'),
    closeCognitoModalBtn: document.getElementById('closeCognitoModalBtn'),
    cognitoLoginForm: document.getElementById('cognitoLoginForm'),

    openConfigBtn: document.getElementById('openConfigBtn'),
    configModal: document.getElementById('configModal'),
    closeConfigModalBtn: document.getElementById('closeConfigModalBtn'),
    cfgApiUrl: document.getElementById('cfgApiUrl'),
    cfgUserPoolId: document.getElementById('cfgUserPoolId'),
    cfgClientId: document.getElementById('cfgClientId'),
    cfgBucketName: document.getElementById('cfgBucketName'),
    saveConfigBtn: document.getElementById('saveConfigBtn'),
    resetConfigBtn: document.getElementById('resetConfigBtn'),
    toastContainer: document.getElementById('toastContainer')
  };

  // Initialize App
  function init() {
    loadSavedConfig();
    setupEventListeners();
    loadEmployees();
  }

  // Load Saved Configuration from localStorage or fallback
  function loadSavedConfig() {
    const savedConfig = localStorage.getItem('pulseemp_aws_config');
    if (savedConfig) {
      try {
        state.awsConfig = JSON.parse(savedConfig);
      } catch (e) {
        console.error('Failed to parse saved config:', e);
      }
    }

    state.executionMode = state.awsConfig.mode || 'demo';
    elements.modeToggle.checked = state.executionMode === 'aws';
    updateModeUI();

    // Fill config inputs
    elements.cfgApiUrl.value = state.awsConfig.apiBaseUrl || '';
    elements.cfgUserPoolId.value = state.awsConfig.cognito ? state.awsConfig.cognito.userPoolId : '';
    elements.cfgClientId.value = state.awsConfig.cognito ? state.awsConfig.cognito.clientId : '';
    elements.cfgBucketName.value = state.awsConfig.s3 ? state.awsConfig.s3.bucketName : 'employee-management-photos-bucket';
  }

  function saveConfigToStorage() {
    state.awsConfig.apiBaseUrl = elements.cfgApiUrl.value.trim();
    if (!state.awsConfig.cognito) state.awsConfig.cognito = {};
    state.awsConfig.cognito.userPoolId = elements.cfgUserPoolId.value.trim();
    state.awsConfig.cognito.clientId = elements.cfgClientId.value.trim();
    if (!state.awsConfig.s3) state.awsConfig.s3 = {};
    state.awsConfig.s3.bucketName = elements.cfgBucketName.value.trim();

    localStorage.setItem('pulseemp_aws_config', JSON.stringify(state.awsConfig));
    showToast('AWS Configuration saved!', 'success');
    closeModal(elements.configModal);

    if (state.executionMode === 'aws') {
      loadEmployees();
    }
  }

  function updateModeUI() {
    if (state.executionMode === 'aws') {
      elements.modeStatusText.textContent = 'AWS Live API Mode';
      elements.modeStatusText.style.color = '#34d399';
    } else {
      elements.modeStatusText.textContent = 'Demo (Local Mock)';
      elements.modeStatusText.style.color = '#06b6d4';
    }
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Mode toggle
    elements.modeToggle.addEventListener('change', (e) => {
      state.executionMode = e.target.checked ? 'aws' : 'demo';
      state.awsConfig.mode = state.executionMode;
      localStorage.setItem('pulseemp_aws_config', JSON.stringify(state.awsConfig));
      updateModeUI();
      showToast(`Switched to ${state.executionMode.toUpperCase()} mode`, 'info');
      loadEmployees();
    });

    // Search and Filter
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase();
      renderEmployees();
    });

    elements.departmentFilter.addEventListener('change', (e) => {
      state.filterDept = e.target.value;
      renderEmployees();
    });

    elements.sortBySelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderEmployees();
    });

    elements.refreshBtn.addEventListener('click', loadEmployees);

    // View toggle
    elements.viewGridBtn.addEventListener('click', () => setViewMode('grid'));
    elements.viewTableBtn.addEventListener('click', () => setViewMode('table'));

    // Modal controls
    elements.openAddModalBtn.addEventListener('click', () => openEmployeeModal());
    elements.closeModalBtn.addEventListener('click', () => closeModal(elements.employeeModal));
    elements.cancelFormBtn.addEventListener('click', () => closeModal(elements.employeeModal));

    elements.employeeForm.addEventListener('submit', handleFormSubmit);

    // S3 Dropzone Events
    elements.s3Dropzone.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileSelect);
    elements.s3Dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      elements.s3Dropzone.classList.add('drag-over');
    });
    elements.s3Dropzone.addEventListener('dragleave', () => elements.s3Dropzone.classList.remove('drag-over'));
    elements.s3Dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      elements.s3Dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        uploadFileToS3(e.dataTransfer.files[0]);
      }
    });

    elements.removePhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetPhotoPreview();
    });

    // Auth & Config Modal Triggers
    elements.authActionBtn.addEventListener('click', () => openModal(elements.cognitoModal));
    elements.closeCognitoModalBtn.addEventListener('click', () => closeModal(elements.cognitoModal));
    elements.cognitoLoginForm.addEventListener('submit', handleCognitoLogin);

    elements.openConfigBtn.addEventListener('click', () => openModal(elements.configModal));
    elements.closeConfigModalBtn.addEventListener('click', () => closeModal(elements.configModal));
    elements.saveConfigBtn.addEventListener('click', saveConfigToStorage);
    elements.resetConfigBtn.addEventListener('click', () => {
      localStorage.removeItem('pulseemp_aws_config');
      loadSavedConfig();
      showToast('Reset configuration to defaults', 'info');
      closeModal(elements.configModal);
    });
  }

  function setViewMode(mode) {
    state.viewMode = mode;
    if (mode === 'grid') {
      elements.viewGridBtn.classList.add('active');
      elements.viewTableBtn.classList.remove('active');
      elements.employeeGrid.classList.remove('hidden');
      elements.employeeTableContainer.classList.add('hidden');
    } else {
      elements.viewGridBtn.classList.remove('active');
      elements.viewTableBtn.classList.add('active');
      elements.employeeGrid.classList.add('hidden');
      elements.employeeTableContainer.classList.remove('hidden');
    }
  }

  // Fetch / Load Employees
  async function loadEmployees() {
    showLoading(true);

    if (state.executionMode === 'demo') {
      // Local Storage mock data or fallback
      const stored = localStorage.getItem('pulseemp_demo_employees');
      if (stored) {
        try {
          state.employees = JSON.parse(stored);
        } catch (e) {
          state.employees = [...MOCK_EMPLOYEES];
        }
      } else {
        state.employees = [...MOCK_EMPLOYEES];
        saveDemoEmployees();
      }
      showLoading(false);
      renderEmployees();
      updateAnalytics();
    } else {
      // Live AWS API Call
      if (!state.awsConfig.apiBaseUrl) {
        showToast('Please configure your AWS API Gateway Endpoint in Settings!', 'error');
        showLoading(false);
        openModal(elements.configModal);
        return;
      }

      try {
        const headers = { 'Content-Type': 'application/json' };
        if (state.authToken) {
          headers['Authorization'] = `Bearer ${state.authToken}`;
        }

        const res = await fetch(`${state.awsConfig.apiBaseUrl.replace(/\/$/, '')}/employees`, {
          method: 'GET',
          headers
        });

        if (!res.ok) {
          throw new Error(`AWS API Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        state.employees = Array.isArray(data) ? data : [];
        renderEmployees();
        updateAnalytics();
        showToast(`Loaded ${state.employees.length} employees from DynamoDB`, 'success');
      } catch (err) {
        console.error('AWS Fetch Error:', err);
        showToast(`AWS Connection Failed: ${err.message}`, 'error');
      } finally {
        showLoading(false);
      }
    }
  }

  function saveDemoEmployees() {
    localStorage.setItem('pulseemp_demo_employees', JSON.stringify(state.employees));
  }

  // Filter, Sort, and Render
  function getFilteredEmployees() {
    return state.employees
      .filter(emp => {
        const matchesDept = state.filterDept === 'ALL' || emp.department === state.filterDept;
        const matchesSearch = !state.searchQuery ||
          emp.name.toLowerCase().includes(state.searchQuery) ||
          emp.email.toLowerCase().includes(state.searchQuery) ||
          (emp.role && emp.role.toLowerCase().includes(state.searchQuery)) ||
          emp.empId.toLowerCase().includes(state.searchQuery);
        return matchesDept && matchesSearch;
      })
      .sort((a, b) => {
        if (state.sortBy === 'name') return a.name.localeCompare(b.name);
        if (state.sortBy === 'dateOfJoining') return new Date(b.dateOfJoining) - new Date(a.dateOfJoining);
        if (state.sortBy === 'salary') return (b.salary || 0) - (a.salary || 0);
        if (state.sortBy === 'empId') return a.empId.localeCompare(b.empId);
        return 0;
      });
  }

  function renderEmployees() {
    const list = getFilteredEmployees();

    if (list.length === 0) {
      elements.employeeGrid.innerHTML = '';
      elements.employeeTableBody.innerHTML = '';
      elements.emptyState.classList.remove('hidden');
      return;
    }

    elements.emptyState.classList.add('hidden');

    // Render Grid View
    elements.employeeGrid.innerHTML = list.map(emp => {
      const initials = emp.name.split(' ').map(n => n[0]).join('').toUpperCase();
      const statusClass = emp.status === 'Active' ? 'status-active' : emp.status === 'On Leave' ? 'status-leave' : 'status-terminated';
      
      return `
        <div class="employee-card glass-panel" data-id="${emp.empId}">
          <div class="emp-card-header">
            ${emp.profilePicUrl 
              ? `<img src="${emp.profilePicUrl}" alt="${emp.name}" class="emp-avatar" onerror="this.src='https://via.placeholder.com/60?text=${initials}'">`
              : `<div class="emp-avatar">${initials}</div>`
            }
            <div class="emp-title-block">
              <span class="emp-name">${escapeHtml(emp.name)}</span>
              <span class="emp-role">${escapeHtml(emp.role || 'Staff')}</span>
              <span class="emp-id-badge">${emp.empId}</span>
            </div>
          </div>

          <span class="emp-badge-dept">${escapeHtml(emp.department)}</span>

          <div class="emp-details-list">
            <div class="emp-detail-item">
              <i class="fa-regular fa-envelope"></i>
              <span>${escapeHtml(emp.email)}</span>
            </div>
            <div class="emp-detail-item">
              <i class="fa-solid fa-phone"></i>
              <span>${escapeHtml(emp.phone || 'N/A')}</span>
            </div>
            <div class="emp-detail-item">
              <i class="fa-regular fa-calendar-check"></i>
              <span>Joined: ${emp.dateOfJoining || 'N/A'}</span>
            </div>
          </div>

          <div class="emp-card-footer">
            <div class="emp-salary">$${(Number(emp.salary) || 0).toLocaleString()}/yr</div>
            <div class="emp-actions">
              <button class="btn-icon btn-sm" onclick="PulseApp.editEmployee('${emp.empId}')" title="Edit Employee">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-icon btn-sm btn-danger" onclick="PulseApp.deleteEmployee('${emp.empId}')" title="Delete Employee">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Render Table View
    elements.employeeTableBody.innerHTML = list.map(emp => {
      const initials = emp.name.split(' ').map(n => n[0]).join('').toUpperCase();
      const statusClass = emp.status === 'Active' ? 'status-active' : emp.status === 'On Leave' ? 'status-leave' : 'status-terminated';

      return `
        <tr>
          <td><code class="emp-id-badge">${emp.empId}</code></td>
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              ${emp.profilePicUrl 
                ? `<img src="${emp.profilePicUrl}" style="width:34px; height:34px; border-radius:50%; object-fit:cover;">`
                : `<div style="width:34px; height:34px; border-radius:50%; background:var(--accent-primary); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;">${initials}</div>`
              }
              <div>
                <strong>${escapeHtml(emp.name)}</strong>
                <div style="font-size:12px; color:var(--text-muted);">${escapeHtml(emp.role || '')}</div>
              </div>
            </div>
          </td>
          <td><span class="emp-badge-dept">${escapeHtml(emp.department)}</span></td>
          <td>
            <div>${escapeHtml(emp.email)}</div>
            <div style="font-size:12px; color:var(--text-dim);">${escapeHtml(emp.phone || '')}</div>
          </td>
          <td>${emp.dateOfJoining || 'N/A'}</td>
          <td><strong>$${(Number(emp.salary) || 0).toLocaleString()}</strong></td>
          <td><span class="status-pill ${statusClass}">${emp.status || 'Active'}</span></td>
          <td>
            <div class="emp-actions">
              <button class="btn-icon btn-sm" onclick="PulseApp.editEmployee('${emp.empId}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
              <button class="btn-icon btn-sm btn-danger" onclick="PulseApp.deleteEmployee('${emp.empId}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updateAnalytics() {
    elements.statTotalEmployees.textContent = state.employees.length;

    const depts = new Set(state.employees.map(e => e.department));
    elements.statDepartments.textContent = depts.size;

    const totalPayroll = state.employees.reduce((acc, e) => acc + (Number(e.salary) || 0), 0);
    elements.statPayroll.textContent = `$${totalPayroll.toLocaleString()}`;

    const s3Count = state.employees.filter(e => e.profilePicUrl && e.profilePicUrl.includes('s3.amazonaws.com')).length;
    elements.statS3Uploads.textContent = s3Count;
  }

  // Form & S3 Upload Handling
  function openEmployeeModal(employee = null) {
    elements.employeeForm.reset();
    resetPhotoPreview();

    if (employee) {
      elements.modalTitle.textContent = 'Edit Employee';
      elements.formEmpId.value = employee.empId;
      elements.formName.value = employee.name;
      elements.formEmail.value = employee.email;
      elements.formDepartment.value = employee.department;
      elements.formRole.value = employee.role || '';
      elements.formSalary.value = employee.salary || '';
      elements.formDateOfJoining.value = employee.dateOfJoining || '';
      elements.formPhone.value = employee.phone || '';
      elements.formStatus.value = employee.status || 'Active';

      if (employee.profilePicUrl) {
        setPhotoPreview(employee.profilePicUrl);
      }
    } else {
      elements.modalTitle.textContent = 'Add New Employee';
      elements.formEmpId.value = '';
      elements.formDateOfJoining.value = new Date().toISOString().split('T')[0];
    }

    openModal(elements.employeeModal);
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      uploadFileToS3(file);
    }
  }

  async function uploadFileToS3(file) {
    showToast('Preparing S3 Presigned URL upload...', 'info');

    if (state.executionMode === 'demo' || !state.awsConfig.apiBaseUrl) {
      // Local preview simulation
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
        showToast('Image cached locally (Demo Mode)', 'success');
      };
      reader.readAsDataURL(file);
      return;
    }

    try {
      // 1. Call AWS Lambda to get presigned URL
      const res = await fetch(`${state.awsConfig.apiBaseUrl.replace(/\/$/, '')}/employees/upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileType: file.type || 'image/jpeg' })
      });

      if (!res.ok) throw new Error('Failed to obtain presigned upload URL from AWS Lambda');
      const { uploadUrl, publicUrl } = await res.json();

      // 2. PUT object directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'image/jpeg' },
        body: file
      });

      if (!uploadRes.ok) throw new Error('Direct S3 upload failed');

      setPhotoPreview(publicUrl);
      showToast('Photo uploaded to Amazon S3 successfully!', 'success');
    } catch (err) {
      console.error('S3 Upload Error:', err);
      showToast(`S3 Upload Failed: ${err.message}`, 'error');
    }
  }

  function setPhotoPreview(url) {
    state.uploadedPhotoUrl = url;
    elements.formProfilePicUrl.value = url;
    elements.photoPreviewImg.src = url;
    elements.dropzonePrompt.classList.add('hidden');
    elements.photoPreviewContainer.classList.remove('hidden');
  }

  function resetPhotoPreview() {
    state.uploadedPhotoUrl = '';
    elements.formProfilePicUrl.value = '';
    elements.photoPreviewImg.src = '';
    elements.dropzonePrompt.classList.remove('hidden');
    elements.photoPreviewContainer.classList.add('hidden');
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const empId = elements.formEmpId.value;
    const payload = {
      name: elements.formName.value.trim(),
      email: elements.formEmail.value.trim(),
      department: elements.formDepartment.value,
      role: elements.formRole.value.trim(),
      salary: Number(elements.formSalary.value) || 0,
      dateOfJoining: elements.formDateOfJoining.value,
      phone: elements.formPhone.value.trim(),
      status: elements.formStatus.value,
      profilePicUrl: elements.formProfilePicUrl.value || state.uploadedPhotoUrl
    };

    if (state.executionMode === 'demo') {
      if (empId) {
        // Edit existing
        const idx = state.employees.findIndex(e => e.empId === empId);
        if (idx !== -1) {
          state.employees[idx] = { ...state.employees[idx], ...payload, updatedAt: new Date().toISOString() };
          showToast('Employee updated in local storage', 'success');
        }
      } else {
        // Add new
        const newEmp = {
          empId: `EMP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          ...payload,
          createdAt: new Date().toISOString()
        };
        state.employees.unshift(newEmp);
        showToast('Employee added to local storage', 'success');
      }
      saveDemoEmployees();
      renderEmployees();
      updateAnalytics();
      closeModal(elements.employeeModal);
    } else {
      // AWS Live Mode
      showLoading(true);
      try {
        const isEdit = !!empId;
        const endpoint = isEdit 
          ? `${state.awsConfig.apiBaseUrl.replace(/\/$/, '')}/employees/${empId}`
          : `${state.awsConfig.apiBaseUrl.replace(/\/$/, '')}/employees`;
        
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`AWS API returned status ${res.status}`);

        showToast(`Employee ${isEdit ? 'updated' : 'created'} in DynamoDB!`, 'success');
        closeModal(elements.employeeModal);
        await loadEmployees();
      } catch (err) {
        console.error('Save error:', err);
        showToast(`AWS Save Failed: ${err.message}`, 'error');
      } finally {
        showLoading(false);
      }
    }
  }

  // Delete Employee
  async function deleteEmployee(empId) {
    if (!confirm(`Are you sure you want to delete employee ${empId}?`)) return;

    if (state.executionMode === 'demo') {
      state.employees = state.employees.filter(e => e.empId !== empId);
      saveDemoEmployees();
      renderEmployees();
      updateAnalytics();
      showToast(`Employee ${empId} removed`, 'info');
    } else {
      showLoading(true);
      try {
        const res = await fetch(`${state.awsConfig.apiBaseUrl.replace(/\/$/, '')}/employees/${empId}`, {
          method: 'DELETE'
        });

        if (!res.ok) throw new Error(`AWS API returned status ${res.status}`);

        showToast(`Employee ${empId} deleted from DynamoDB`, 'success');
        await loadEmployees();
      } catch (err) {
        console.error('Delete error:', err);
        showToast(`Delete Failed: ${err.message}`, 'error');
      } finally {
        showLoading(false);
      }
    }
  }

  // Cognito Auth Simulation
  function handleCognitoLogin(e) {
    e.preventDefault();
    const email = elements.cognitoEmail.value.trim();
    
    // Simulate Cognito Token response
    state.authToken = 'mock-cognito-jwt-id-token-' + Date.now();
    state.authUser = { email, role: 'HR Admin' };

    document.getElementById('userName').textContent = email.split('@')[0];
    document.getElementById('userRole').textContent = 'Cognito Authenticated';
    document.getElementById('userAvatar').textContent = email.substring(0, 2).toUpperCase();

    showToast('Successfully authenticated with Amazon Cognito User Pool!', 'success');
    closeModal(elements.cognitoModal);
  }

  // Helper Functions
  function openModal(modal) { modal.classList.remove('hidden'); }
  function closeModal(modal) { modal.classList.add('hidden'); }
  function showLoading(show) {
    if (show) elements.loadingState.classList.remove('hidden');
    else elements.loadingState.classList.add('hidden');
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Global Exports for inline onclick handlers
  window.PulseApp = {
    editEmployee: (id) => {
      const emp = state.employees.find(e => e.empId === id);
      if (emp) openEmployeeModal(emp);
    },
    deleteEmployee: (id) => deleteEmployee(id)
  };

  // Run on DOM Ready
  document.addEventListener('DOMContentLoaded', init);
})();
