// // ChainInvoice — Web3 dApp frontend

// const CONTRACT_ADDRESS = "0xa021fd4ba0fbcce099c65a14617e802aadffe006";
// const ABI = [
// 	{
// 		"inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
// 		"name": "cancelInvoice","outputs": [],"stateMutability": "nonpayable","type": "function"
// 	},
// 	{
// 		"inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
// 		"name": "confirmAndRelease","outputs": [],"stateMutability": "nonpayable","type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{"internalType": "address payable","name": "_client","type": "address"},
// 			{"internalType": "uint256","name": "_amount","type": "uint256"},
// 			{"internalType": "string","name": "_description","type": "string"}
// 		],
// 		"name": "createInvoice","outputs": [],"stateMutability": "nonpayable","type": "function"
// 	},
// 	{
// 		"inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
// 		"name": "fundInvoice","outputs": [],"stateMutability": "payable","type": "function"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"}],
// 		"name": "InvoiceCancelled","type": "event"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"},
// 			{"indexed": false,"internalType": "address","name": "freelancer","type": "address"},
// 			{"indexed": false,"internalType": "address","name": "client","type": "address"},
// 			{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}
// 		],
// 		"name": "InvoiceCreated","type": "event"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"}],
// 		"name": "InvoiceFunded","type": "event"
// 	},
// 	{
// 		"inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
// 		"name": "markDelivered","outputs": [],"stateMutability": "nonpayable","type": "function"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"},
// 			{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}
// 		],
// 		"name": "PaymentReleased","type": "event"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"}],
// 		"name": "WorkDelivered","type": "event"
// 	},
// 	{
// 		"inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
// 		"name": "getInvoice",
// 		"outputs": [
// 			{
// 				"components": [
// 					{"internalType": "uint256","name": "id","type": "uint256"},
// 					{"internalType": "address payable","name": "freelancer","type": "address"},
// 					{"internalType": "address payable","name": "client","type": "address"},
// 					{"internalType": "uint256","name": "amount","type": "uint256"},
// 					{"internalType": "string","name": "description","type": "string"},
// 					{"internalType": "enum ChainInvoice.Status","name": "status","type": "uint8"}
// 				],
// 				"internalType": "struct ChainInvoice.Invoice","name": "","type": "tuple"
// 			}
// 		],
// 		"stateMutability": "view","type": "function"
// 	},
// 	{
// 		"inputs": [],"name": "invoiceCount",
// 		"outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
// 		"stateMutability": "view","type": "function"
// 	},
// 	{
// 		"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],
// 		"name": "invoices",
// 		"outputs": [
// 			{"internalType": "uint256","name": "id","type": "uint256"},
// 			{"internalType": "address payable","name": "freelancer","type": "address"},
// 			{"internalType": "address payable","name": "client","type": "address"},
// 			{"internalType": "uint256","name": "amount","type": "uint256"},
// 			{"internalType": "string","name": "description","type": "string"},
// 			{"internalType": "enum ChainInvoice.Status","name": "status","type": "uint8"}
// 		],
// 		"stateMutability": "view","type": "function"
// 	}
// ];

// const STATUS = {
//   CREATED: 'Created',
//   FUNDED: 'Funded',
//   DELIVERED: 'Delivered',
//   COMPLETED: 'Completed',
//   CANCELLED: 'Cancelled',
// };

// let provider, signer, contract;
// let connectedAddress = null;
// let invoices = [];
// let currentDetailId = null;

// // Helpers
// const $ = (sel) => document.querySelector(sel);
// const $$ = (sel) => document.querySelectorAll(sel);
// const shortAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '';
// const fmtDate = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
// const badgeClass = (s) => `badge badge-${s.toLowerCase()}`;
// const statusMap = ['Created', 'Funded', 'Delivered', 'Completed', 'Cancelled'];

// function toast(msg) {
//   let el = $('.toast');
//   if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
//   el.textContent = msg;
//   el.classList.add('show');
//   setTimeout(() => el.classList.remove('show'), 2200);
// }

// // Routing
// function navigate(route, params = {}) {
//   $$('.view').forEach(v => v.classList.add('hidden'));
//   $$('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.route === route));
//   if (route === 'dashboard') { $('#view-dashboard').classList.remove('hidden'); renderDashboard(); }
//   else if (route === 'create') { $('#view-create').classList.remove('hidden'); $('#createForm').reset(); }
//   else if (route === 'detail') { currentDetailId = params.id; $('#view-detail').classList.remove('hidden'); renderDetail(); }
//   window.scrollTo({ top: 0, behavior: 'smooth' });
// }

// document.addEventListener('click', (e) => {
//   const r = e.target.closest('[data-route]');
//   if (r) { e.preventDefault(); navigate(r.dataset.route); }
// });

// // Connect wallet
// $('#connectBtn').addEventListener('click', connectWallet);

// async function connectWallet() {
//   if (typeof window.ethereum === "undefined") {
//     alert("MetaMask not found. Please install it.");
//     return;
//   }
//   await window.ethereum.request({ method: "eth_requestAccounts" });
//   provider = new ethers.BrowserProvider(window.ethereum);
//   signer = await provider.getSigner();
//   contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
//   connectedAddress = await signer.getAddress();
//   $('#connectBtn').textContent = shortAddr(connectedAddress);
//   toast("Wallet connected!");
//   renderDashboard();
// }

// // Dashboard
// async function renderDashboard() {
//   const grid = $('#invoiceGrid');

//   if (!contract) {
//     grid.innerHTML = `<div class="empty">Connect your wallet to see your invoices.</div>`;
//     return;
//   }

//   try {
//     const count = await contract.invoiceCount();
//     invoices = [];

//     for (let i = 1; i <= Number(count); i++) {
//       const inv = await contract.getInvoice(i);
//       const freelancer = inv[1].toLowerCase();
//       const client = inv[2].toLowerCase();
//       const userAddr = connectedAddress.toLowerCase();
//       if (freelancer === userAddr || client === userAddr) {
//         invoices.push({
//           id: Number(inv[0]),
//           freelancer: inv[1],
//           client: inv[2],
//           amount: ethers.formatEther(inv[3]),
//           description: inv[4],
//           status: statusMap[Number(inv[5])],
//           createdAt: Date.now(),
//         });
//       }
//     }

//     $('#stat-total').textContent = invoices.length;
//     $('#stat-funded').textContent = invoices.filter(i => i.status === 'Funded').length;
//     $('#stat-completed').textContent = invoices.filter(i => i.status === 'Completed').length;
//     $('#stat-volume').textContent = invoices
//       .filter(i => i.status === 'Completed')
//       .reduce((s, i) => s + parseFloat(i.amount), 0)
//       .toFixed(2);

//     if (invoices.length === 0) {
//       grid.innerHTML = `<div class="empty">No invoices yet. Create your first one to get started.</div>`;
//       return;
//     }

//     grid.innerHTML = invoices.map(inv => `
//       <div class="card invoice-card" data-id="${inv.id}">
//         <div class="invoice-top">
//           <span class="invoice-id">INV-${inv.id}</span>
//           <span class="${badgeClass(inv.status)}">${inv.status}</span>
//         </div>
//         <div class="invoice-amount">${inv.amount}<span>ETH</span></div>
//         <p class="invoice-desc">${escapeHtml(inv.description)}</p>
//         <div class="invoice-meta">
//           <span>Client <span class="addr">${shortAddr(inv.client)}</span></span>
//         </div>
//       </div>
//     `).join('');

//     grid.querySelectorAll('.invoice-card').forEach(card => {
//       card.addEventListener('click', () => navigate('detail', { id: parseInt(card.dataset.id) }));
//     });

//   } catch (err) {
//     grid.innerHTML = `<div class="empty">Error loading invoices: ${err.message}</div>`;
//   }
// }

// // Detail
// async function renderDetail() {
//   if (!contract) { navigate('dashboard'); return; }

//   try {
//     const inv = await contract.getInvoice(currentDetailId);
//     const id = Number(inv[0]);
//     const freelancer = inv[1];
//     const client = inv[2];
//     const amount = ethers.formatEther(inv[3]);
//     const description = inv[4];
//     const status = statusMap[Number(inv[5])];

//     const isClient = client.toLowerCase() === connectedAddress.toLowerCase();
//     const isFreelancer = freelancer.toLowerCase() === connectedAddress.toLowerCase();
//     const role = isClient ? 'You are the client' : isFreelancer ? 'You are the freelancer' : 'Read-only view';
//     const cancel = $('#actCancel');
//     if (cancel) cancel.addEventListener('click', () => cancelInvoice(id));

//     let actionHtml = '';
//     if (status === 'Created') {
//   actionHtml = isClient
//     ? `<button class="btn btn-primary btn-block" id="actFund">Fund Invoice</button>
//        <button class="btn btn-ghost btn-block" id="actCancel" style="margin-top:10px;">Cancel Invoice</button>`
//     : `<p class="muted">Waiting for client to fund this invoice.</p>
//        <button class="btn btn-ghost btn-block" id="actCancel" style="margin-top:10px;">Cancel Invoice</button>`;
// }
// else if (status === 'Funded') {
//   actionHtml = isFreelancer
//     ? `<button class="btn btn-primary btn-block" id="actDeliver">Mark as Delivered</button>
//        <button class="btn btn-ghost btn-block" id="actCancel" style="margin-top:10px;">Cancel Invoice</button>`
//     : `<p class="muted">Funds escrowed. Waiting for freelancer to deliver.</p>
//        <button class="btn btn-ghost btn-block" id="actCancel" style="margin-top:10px;">Cancel Invoice</button>`;
// }
    
//       else if (status === 'Delivered') {
//       actionHtml = isClient
//         ? `<button class="btn btn-success btn-block" id="actRelease">Confirm & Release Payment</button>`
//         : `<p class="muted">Delivered. Waiting for client to release payment.</p>`;
//     } else if (status === 'Completed') {
//       actionHtml = `<span class="badge badge-completed" style="font-size:13px;padding:8px 14px;">Paid</span>`;
//     } else if (status === 'Cancelled') {
//       actionHtml = `<span class="badge badge-cancelled" style="font-size:13px;padding:8px 14px;">Cancelled</span>`;
//     }

//     $('#detailContent').innerHTML = `
//       <div class="detail-header">
//         <div>
//           <span class="invoice-id">INV-${id}</span>
//           <h1>${escapeHtml(description.split('.')[0])}</h1>
//           <p class="muted">${role}</p>
//         </div>
//         <span class="${badgeClass(status)}">${status}</span>
//       </div>
//       <div class="detail-grid">
//         <div class="card">
//           <h2>Details</h2>
//           <div class="detail-amount">${amount}<span> ETH</span></div>
//           <div style="margin-top:20px;">
//             <div class="detail-row"><span class="label">Invoice ID</span><span class="value">INV-${id}</span></div>
//             <div class="detail-row"><span class="label">Status</span><span class="${badgeClass(status)}">${status}</span></div>
//             <div class="detail-row"><span class="label">Freelancer</span><span class="value addr">${shortAddr(freelancer)}</span></div>
//             <div class="detail-row"><span class="label">Client</span><span class="value addr">${shortAddr(client)}</span></div>
//             <div class="detail-row"><span class="label">Amount</span><span class="value">${amount} ETH</span></div>
//           </div>
//           <h2 style="margin-top:24px;">Description</h2>
//           <p class="muted" style="line-height:1.6;font-size:14px;">${escapeHtml(description)}</p>
//         </div>
//         <div class="card action-card">
//           <h2>Actions</h2>
//           <p class="muted">Available actions depend on the invoice status and your role.</p>
//           ${actionHtml}
//         </div>
//       </div>
//     `;

//     const fund = $('#actFund');
//     if (fund) fund.addEventListener('click', () => fundInvoice(id, amount));
//     const deliver = $('#actDeliver');
//     if (deliver) deliver.addEventListener('click', () => markDelivered(id));
//     const release = $('#actRelease');
//     if (release) release.addEventListener('click', () => confirmAndRelease(id));

//   } catch (err) {
//     toast("Error loading invoice: " + err.message);
//     navigate('dashboard');
//   }
// }

// // Contract actions
// $('#createForm').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   if (!contract) { toast("Connect your wallet first!"); return; }
//   const fd = new FormData(e.target);
//   const client = fd.get('client').trim();
//   const amountETH = fd.get('amount');
//   const description = fd.get('description').trim();
//   try {
//     const amountWei = ethers.parseEther(amountETH);
//     const tx = await contract.createInvoice(client, amountWei, description);
//     toast("Transaction sent! Waiting for confirmation...");
//     await tx.wait();
//     toast("Invoice created successfully! 🎉");
//     navigate('dashboard');
//   } catch (err) {
//     toast("Error: " + err.message);
//   }
// });

// async function fundInvoice(id, amount) {
//   try {
//     const tx = await contract.fundInvoice(id, { value: ethers.parseEther(amount) });
//     toast("Funding transaction sent...");
//     await tx.wait();
//     toast("Invoice funded! 🎉");
//     renderDetail();
//   } catch (err) {
//     toast("Error: " + err.message);
//   }
// }

// async function markDelivered(id) {
//   try {
//     const tx = await contract.markDelivered(id);
//     toast("Transaction sent...");
//     await tx.wait();
//     toast("Marked as delivered! 🎉");
//     renderDetail();
//   } catch (err) {
//     toast("Error: " + err.message);
//   }
// }

// async function confirmAndRelease(id) {
//   try {
//     const tx = await contract.confirmAndRelease(id);
//     toast("Releasing payment...");
//     await tx.wait();
//     toast("Payment released! 🎉");
//     renderDetail();
//   } catch (err) {
//     toast("Error: " + err.message);
//   }
// }

// // Util
// function escapeHtml(s) {
//   return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// }

// // Boot
// navigate('dashboard');

// async function searchInvoice() {
//   if (!contract) { toast("Connect your wallet first!"); return; }
//   const id = document.getElementById("searchId").value;
//   if (!id) { toast("Enter an invoice ID"); return; }
//   try {
//     const inv = await contract.getInvoice(id);
//     if (Number(inv[0]) === 0) { toast("Invoice not found"); return; }
//     navigate('detail', { id: parseInt(id) });
//   } catch (err) {
//     toast("Invoice not found");
//   }
// }
// async function cancelInvoice(id) {
//   try {
//     const tx = await contract.cancelInvoice(id);
//     toast("Cancelling invoice...");
//     await tx.wait();
//     toast("Invoice cancelled! 🎉");
//     navigate('dashboard');
//   } catch (err) {
//     toast("Error: " + err.message);
//   }
// }



// ChainInvoice — Web3 dApp frontend

const CONTRACT_ADDRESS = "0xa021fd4ba0fbcce099c65a14617e802aadffe006";
const ABI = [
	{
		"inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
		"name": "cancelInvoice","outputs": [],"stateMutability": "nonpayable","type": "function"
	},
	{
		"inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
		"name": "confirmAndRelease","outputs": [],"stateMutability": "nonpayable","type": "function"
	},
	{
		"inputs": [
			{"internalType": "address payable","name": "_client","type": "address"},
			{"internalType": "uint256","name": "_amount","type": "uint256"},
			{"internalType": "string","name": "_description","type": "string"}
		],
		"name": "createInvoice","outputs": [],"stateMutability": "nonpayable","type": "function"
	},
	{
		"inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
		"name": "fundInvoice","outputs": [],"stateMutability": "payable","type": "function"
	},
	{
		"anonymous": false,
		"inputs": [{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"}],
		"name": "InvoiceCancelled","type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"},
			{"indexed": false,"internalType": "address","name": "freelancer","type": "address"},
			{"indexed": false,"internalType": "address","name": "client","type": "address"},
			{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}
		],
		"name": "InvoiceCreated","type": "event"
	},
	{
		"anonymous": false,
		"inputs": [{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"}],
		"name": "InvoiceFunded","type": "event"
	},
	{
		"inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
		"name": "markDelivered","outputs": [],"stateMutability": "nonpayable","type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"},
			{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}
		],
		"name": "PaymentReleased","type": "event"
	},
	{
		"anonymous": false,
		"inputs": [{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"}],
		"name": "WorkDelivered","type": "event"
	},
	{
		"inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],
		"name": "getInvoice",
		"outputs": [
			{
				"components": [
					{"internalType": "uint256","name": "id","type": "uint256"},
					{"internalType": "address payable","name": "freelancer","type": "address"},
					{"internalType": "address payable","name": "client","type": "address"},
					{"internalType": "uint256","name": "amount","type": "uint256"},
					{"internalType": "string","name": "description","type": "string"},
					{"internalType": "enum ChainInvoice.Status","name": "status","type": "uint8"}
				],
				"internalType": "struct ChainInvoice.Invoice","name": "","type": "tuple"
			}
		],
		"stateMutability": "view","type": "function"
	},
	{
		"inputs": [],"name": "invoiceCount",
		"outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
		"stateMutability": "view","type": "function"
	},
	{
		"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],
		"name": "invoices",
		"outputs": [
			{"internalType": "uint256","name": "id","type": "uint256"},
			{"internalType": "address payable","name": "freelancer","type": "address"},
			{"internalType": "address payable","name": "client","type": "address"},
			{"internalType": "uint256","name": "amount","type": "uint256"},
			{"internalType": "string","name": "description","type": "string"},
			{"internalType": "enum ChainInvoice.Status","name": "status","type": "uint8"}
		],
		"stateMutability": "view","type": "function"
	}
];

const STATUS = {
  CREATED: 'Created',
  FUNDED: 'Funded',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

let provider, signer, contract;
let connectedAddress = null;
let invoices = [];
let currentDetailId = null;

// Helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const shortAddr = (a) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '';
const fmtDate = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
const badgeClass = (s) => `badge badge-${s.toLowerCase()}`;
const statusMap = ['Created', 'Funded', 'Delivered', 'Completed', 'Cancelled'];

function toast(msg) {
  let el = $('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

// Routing
function navigate(route, params = {}) {
  $$('.view').forEach(v => v.classList.add('hidden'));
  $$('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.route === route));
  if (route === 'dashboard') { $('#view-dashboard').classList.remove('hidden'); renderDashboard(); }
  else if (route === 'create') { $('#view-create').classList.remove('hidden'); $('#createForm').reset(); }
  else if (route === 'detail') { currentDetailId = params.id; $('#view-detail').classList.remove('hidden'); renderDetail(); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', (e) => {
  const r = e.target.closest('[data-route]');
  if (r) { e.preventDefault(); navigate(r.dataset.route); }
});

// Connect wallet
$('#connectBtn').addEventListener('click', connectWallet);

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not found. Please install it.");
    return;
  }
  await window.ethereum.request({ method: "eth_requestAccounts" });
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  connectedAddress = await signer.getAddress();
  $('#connectBtn').textContent = shortAddr(connectedAddress);
  toast("Wallet connected!");
  renderDashboard();
}

// Dashboard
async function renderDashboard() {
  const grid = $('#invoiceGrid');

  if (!contract) {
    grid.innerHTML = `<div class="empty">Connect your wallet to see your invoices.</div>`;
    return;
  }

  try {
    const count = await contract.invoiceCount();
    invoices = [];

    for (let i = 1; i <= Number(count); i++) {
      const inv = await contract.getInvoice(i);
      const freelancer = inv[1].toLowerCase();
      const client = inv[2].toLowerCase();
      const userAddr = connectedAddress.toLowerCase();
      if (freelancer === userAddr || client === userAddr) {
        invoices.push({
          id: Number(inv[0]),
          freelancer: inv[1],
          client: inv[2],
          amount: ethers.formatEther(inv[3]),
          description: inv[4],
          status: statusMap[Number(inv[5])],
          createdAt: Date.now(),
        });
      }
    }

    $('#stat-total').textContent = invoices.length;
    $('#stat-funded').textContent = invoices.filter(i => i.status === 'Funded').length;
    $('#stat-completed').textContent = invoices.filter(i => i.status === 'Completed').length;
    $('#stat-volume').textContent = invoices
      .filter(i => i.status === 'Completed')
      .reduce((s, i) => s + parseFloat(i.amount), 0)
      .toFixed(2);

    if (invoices.length === 0) {
      grid.innerHTML = `<div class="empty">No invoices yet. Create your first one to get started.</div>`;
      return;
    }

    grid.innerHTML = invoices.map(inv => `
      <div class="card invoice-card" data-id="${inv.id}">
        <div class="invoice-top">
          <span class="invoice-id">INV-${inv.id}</span>
          <span class="${badgeClass(inv.status)}">${inv.status}</span>
        </div>
        <div class="invoice-amount">${inv.amount}<span>ETH</span></div>
        <p class="invoice-desc">${escapeHtml(inv.description)}</p>
        <div class="invoice-meta">
          <span>Client <span class="addr">${shortAddr(inv.client)}</span></span>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.invoice-card').forEach(card => {
      card.addEventListener('click', () => navigate('detail', { id: parseInt(card.dataset.id) }));
    });

  } catch (err) {
    grid.innerHTML = `<div class="empty">Error loading invoices: ${err.message}</div>`;
  }
}

// Detail
async function renderDetail() {
  if (!contract) { navigate('dashboard'); return; }

  try {
    const inv = await contract.getInvoice(currentDetailId);
    const id = Number(inv[0]);
    const freelancer = inv[1];
    const client = inv[2];
    const amount = ethers.formatEther(inv[3]);
    const description = inv[4];
    const status = statusMap[Number(inv[5])];

    const isClient = client.toLowerCase() === connectedAddress.toLowerCase();
    const isFreelancer = freelancer.toLowerCase() === connectedAddress.toLowerCase();
    const role = isClient ? 'You are the client' : isFreelancer ? 'You are the freelancer' : 'Read-only view';

    let actionHtml = '';
    if (status === 'Created') {
      actionHtml = isClient
        ? `<button class="btn btn-primary btn-block" id="actFund">Fund Invoice</button>
           <button class="btn btn-ghost btn-block" id="actCancel" style="margin-top:10px;">Cancel Invoice</button>`
        : `<p class="muted">Waiting for client to fund this invoice.</p>
           <button class="btn btn-ghost btn-block" id="actCancel" style="margin-top:10px;">Cancel Invoice</button>`;
    } else if (status === 'Funded') {
      actionHtml = isFreelancer
        ? `<button class="btn btn-primary btn-block" id="actDeliver">Mark as Delivered</button>
           <button class="btn btn-ghost btn-block" id="actCancel" style="margin-top:10px;">Cancel Invoice</button>`
        : `<p class="muted">Funds escrowed. Waiting for freelancer to deliver.</p>
           <button class="btn btn-ghost btn-block" id="actCancel" style="margin-top:10px;">Cancel Invoice</button>`;
    } else if (status === 'Delivered') {
      actionHtml = isClient
        ? `<button class="btn btn-success btn-block" id="actRelease">Confirm & Release Payment</button>`
        : `<p class="muted">Delivered. Waiting for client to release payment.</p>`;
    } else if (status === 'Completed') {
      actionHtml = `<span class="badge badge-completed" style="font-size:13px;padding:8px 14px;">Paid</span>`;
    } else if (status === 'Cancelled') {
      actionHtml = `<span class="badge badge-cancelled" style="font-size:13px;padding:8px 14px;">Cancelled</span>`;
    }

    $('#detailContent').innerHTML = `
      <div class="detail-header">
        <div>
          <span class="invoice-id">INV-${id}</span>
          <h1>${escapeHtml(description.split('.')[0])}</h1>
          <p class="muted">${role}</p>
        </div>
        <span class="${badgeClass(status)}">${status}</span>
      </div>
      <div class="detail-grid">
        <div class="card">
          <h2>Details</h2>
          <div class="detail-amount">${amount}<span> ETH</span></div>
          <div style="margin-top:20px;">
            <div class="detail-row"><span class="label">Invoice ID</span><span class="value">INV-${id}</span></div>
            <div class="detail-row"><span class="label">Status</span><span class="${badgeClass(status)}">${status}</span></div>
            <div class="detail-row"><span class="label">Freelancer</span><span class="value addr">${shortAddr(freelancer)}</span></div>
            <div class="detail-row"><span class="label">Client</span><span class="value addr">${shortAddr(client)}</span></div>
            <div class="detail-row"><span class="label">Amount</span><span class="value">${amount} ETH</span></div>
          </div>
          <h2 style="margin-top:24px;">Description</h2>
          <p class="muted" style="line-height:1.6;font-size:14px;">${escapeHtml(description)}</p>
        </div>
        <div class="card action-card">
          <h2>Actions</h2>
          <p class="muted">Available actions depend on the invoice status and your role.</p>
          ${actionHtml}
        </div>
      </div>
    `;

    const fund = $('#actFund');
    if (fund) fund.addEventListener('click', () => fundInvoice(id, amount));
    const deliver = $('#actDeliver');
    if (deliver) deliver.addEventListener('click', () => markDelivered(id));
    const release = $('#actRelease');
    if (release) release.addEventListener('click', () => confirmAndRelease(id));
    const cancel = $('#actCancel');
    if (cancel) cancel.addEventListener('click', () => cancelInvoice(id));

  } catch (err) {
    toast("Error loading invoice: " + err.message);
    navigate('dashboard');
  }
}

// Contract actions
$('#createForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!contract) { toast("Connect your wallet first!"); return; }
  const fd = new FormData(e.target);
  const client = fd.get('client').trim();
  const amountETH = fd.get('amount');
  const description = fd.get('description').trim();
  try {
    const amountWei = ethers.parseEther(amountETH);
    const tx = await contract.createInvoice(client, amountWei, description);
    toast("Transaction sent! Waiting for confirmation...");
    await tx.wait();
    toast("Invoice created successfully! 🎉");
    navigate('dashboard');
  } catch (err) {
    toast("Error: " + err.message);
  }
});

async function fundInvoice(id, amount) {
  try {
    const tx = await contract.fundInvoice(id, { value: ethers.parseEther(amount) });
    toast("Funding transaction sent...");
    await tx.wait();
    toast("Invoice funded! 🎉");
    renderDetail();
  } catch (err) {
    toast("Error: " + err.message);
  }
}

async function markDelivered(id) {
  try {
    const tx = await contract.markDelivered(id);
    toast("Transaction sent...");
    await tx.wait();
    toast("Marked as delivered! 🎉");
    renderDetail();
  } catch (err) {
    toast("Error: " + err.message);
  }
}

async function confirmAndRelease(id) {
  try {
    const tx = await contract.confirmAndRelease(id);
    toast("Releasing payment...");
    await tx.wait();
    toast("Payment released! 🎉");
    renderDetail();
  } catch (err) {
    toast("Error: " + err.message);
  }
}

async function cancelInvoice(id) {
  try {
    const tx = await contract.cancelInvoice(id);
    toast("Cancelling invoice...");
    await tx.wait();
    toast("Invoice cancelled! 🎉");
    navigate('dashboard');
  } catch (err) {
    toast("Error: " + err.message);
  }
}

// Util
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function searchInvoice() {
  if (!contract) { toast("Connect your wallet first!"); return; }
  const id = document.getElementById("searchId").value;
  if (!id) { toast("Enter an invoice ID"); return; }
  try {
    const inv = await contract.getInvoice(id);
    if (Number(inv[0]) === 0) { toast("Invoice not found"); return; }
    navigate('detail', { id: parseInt(id) });
  } catch (err) {
    toast("Invoice not found");
  }
}

// Boot
navigate('dashboard');