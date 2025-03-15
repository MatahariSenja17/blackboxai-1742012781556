// Check authentication
function checkAuth() {
    if (!localStorage.getItem('isLoggedIn') && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// Initialize data in localStorage if not exists
function initializeData() {
    if (!localStorage.getItem('incomingLetters')) {
        localStorage.setItem('incomingLetters', JSON.stringify([]));
    }
    if (!localStorage.getItem('outgoingLetters')) {
        localStorage.setItem('outgoingLetters', JSON.stringify([]));
    }
}

// Load data from localStorage
function getLetters(type) {
    return JSON.parse(localStorage.getItem(type + 'Letters')) || [];
}

// Save data to localStorage
function saveLetters(type, letters) {
    localStorage.setItem(type + 'Letters', JSON.stringify(letters));
}

// Render table data
function renderTable(type) {
    const letters = getLetters(type);
    const tbody = document.getElementById(type + 'TableBody');
    tbody.innerHTML = '';

    letters.forEach((letter, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${letter.number}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${letter.date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${letter.senderReceiver}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${letter.subject}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 no-print">
                <button onclick="editLetter('${type}', ${index})" class="text-blue-600 hover:text-blue-900">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="openDeleteModal('${type}', ${index})" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
                <button onclick="printLetter('${type}', ${index})" class="text-gray-600 hover:text-gray-900">
                    <i class="fas fa-print"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Handle tab switching
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => {
                t.classList.remove('active', 'border-blue-500', 'text-blue-600');
                t.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
            });

            // Add active class to clicked tab
            tab.classList.add('active', 'border-blue-500', 'text-blue-600');
            tab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');

            // Hide all content sections
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });

            // Show selected content section
            document.getElementById(tab.dataset.tab).classList.remove('hidden');
        });
    });
}

// Modal functions
function openAddModal(type) {
    const modal = document.getElementById('letterModal');
    const form = document.getElementById('letterForm');
    const title = document.getElementById('modalTitle');
    const senderReceiverLabel = document.getElementById('senderReceiverLabel');

    // Reset form
    form.reset();
    document.getElementById('letterId').value = '';
    document.getElementById('letterType').value = type;

    // Update modal title and label
    title.textContent = type === 'incoming' ? 'Tambah Surat Masuk' : 'Tambah Surat Keluar';
    senderReceiverLabel.textContent = type === 'incoming' ? 'Pengirim' : 'Penerima';

    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('letterModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Delete modal functions
let letterToDelete = null;

function openDeleteModal(type, index) {
    letterToDelete = { type, index };
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    letterToDelete = null;
}

function confirmDelete() {
    if (letterToDelete) {
        const letters = getLetters(letterToDelete.type);
        letters.splice(letterToDelete.index, 1);
        saveLetters(letterToDelete.type, letters);
        renderTable(letterToDelete.type);
        closeDeleteModal();
    }
}

// Edit letter function
function editLetter(type, index) {
    const letters = getLetters(type);
    const letter = letters[index];
    
    document.getElementById('letterId').value = index;
    document.getElementById('letterType').value = type;
    document.getElementById('letterNumber').value = letter.number;
    document.getElementById('letterDate').value = letter.date;
    document.getElementById('senderReceiver').value = letter.senderReceiver;
    document.getElementById('subject').value = letter.subject;
    
    const title = document.getElementById('modalTitle');
    const senderReceiverLabel = document.getElementById('senderReceiverLabel');
    
    title.textContent = type === 'incoming' ? 'Edit Surat Masuk' : 'Edit Surat Keluar';
    senderReceiverLabel.textContent = type === 'incoming' ? 'Pengirim' : 'Penerima';
    
    const modal = document.getElementById('letterModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Print letter function
function printLetter(type, index) {
    const letters = getLetters(type);
    const letter = letters[index];
    
    // Create print window content
    const printContent = `
        <html>
        <head>
            <title>Print Surat</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .container { max-width: 800px; margin: 20px auto; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .content { margin-bottom: 20px; }
                .label { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${type === 'incoming' ? 'SURAT MASUK' : 'SURAT KELUAR'}</h1>
                </div>
                <div class="content">
                    <p><span class="label">Nomor Surat:</span> ${letter.number}</p>
                    <p><span class="label">Tanggal:</span> ${letter.date}</p>
                    <p><span class="label">${type === 'incoming' ? 'Pengirim' : 'Penerima'}:</span> ${letter.senderReceiver}</p>
                    <p><span class="label">Perihal:</span> ${letter.subject}</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Form submission handler
function setupForm() {
    const form = document.getElementById('letterForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const type = document.getElementById('letterType').value;
        const id = document.getElementById('letterId').value;
        const letterData = {
            number: document.getElementById('letterNumber').value,
            date: document.getElementById('letterDate').value,
            senderReceiver: document.getElementById('senderReceiver').value,
            subject: document.getElementById('subject').value
        };
        
        const letters = getLetters(type);
        
        if (id === '') {
            // Add new letter
            letters.push(letterData);
        } else {
            // Update existing letter
            letters[parseInt(id)] = letterData;
        }
        
        saveLetters(type, letters);
        renderTable(type);
        closeModal();
    });
}

// Logout function
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        });
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeData();
    
    if (!window.location.href.includes('index.html')) {
        setupTabs();
        setupForm();
        setupLogout();
        renderTable('incoming');
        renderTable('outgoing');
    }
});
