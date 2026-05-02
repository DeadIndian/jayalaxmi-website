const pillLabel = {
	sale: "For Sale",
	rent: "For Rent",
	service: "Service Available",
	"service & spares": "Service & Spares",
};
const pillClass = {
	sale: "pill-sale",
	rent: "pill-rent",
	service: "pill-svc",
	"service & spares": "pill-svc",
};

let equipmentData = [];
let reviewsData = [];

// Fetch data from data.json
async function loadData() {
	try {
		const res = await fetch("data.json");
		const data = await res.json();
		equipmentData = data.equipment;
		reviewsData = data.reviews;

		buildGrid();
		buildReviews();
		buildEquipmentDropdown();
	} catch (error) {
		console.error("Error loading data:", error);
	}
}

function buildGrid() {
	const grid = document.getElementById("eqGrid");
	grid.innerHTML = ""; // Clear existing
	equipmentData.forEach((eq) => {
		const card = document.createElement("div");
		card.className = "eq-card";
		card.innerHTML = `
      <div class="eq-img">
        <img src="${eq.image}" alt="${eq.name}" class="eq-img-tag" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Coming+Soon'">
      </div>
      <div class="eq-body">
        <span class="eq-tag">${eq.tag}</span>
        <div class="eq-name">${eq.name}</div>
        <div class="eq-short">${eq.short}</div>
      </div>
      <div class="eq-footer">
        ${eq.pills.map((p) => `<span class="eq-pill ${pillClass[p]}">${pillLabel[p]}</span>`).join("")}
      </div>`;
		card.addEventListener("click", () => openModal(eq));
		grid.appendChild(card);
	});
}

function openModal(eq) {
	document.getElementById("modalTitle").textContent = eq.name;
	document.getElementById("modalImage").src = eq.modalImage || eq.image;
	document.getElementById("modalImage").alt = eq.name;
	document.getElementById("modalImgCaption").textContent = eq.subtitle;
	document.getElementById("modalSubtitle").textContent = eq.subtitle;
	document.getElementById("modalDesc").textContent = eq.desc;

	const pillsEl = document.getElementById("modalPills");
	pillsEl.innerHTML = eq.pills
		.map((p) => `<span class="eq-pill ${pillClass[p]}">${pillLabel[p]}</span>`)
		.join("");

	const specsEl = document.getElementById("modalSpecs");
	specsEl.innerHTML = eq.specs
		.map(([k, v]) => {
			if (v === undefined || v === null) {
				return `<div class="spec-header" style="font-weight: 700; color: var(--blue); padding: 8px 0 4px; margin-top: 10px; border-bottom: 2px solid var(--border); font-family: 'Oswald', sans-serif; letter-spacing: 0.5px;">${k}</div>`;
			}
			return `<div class="spec-row"><span class="spec-key">${k}</span><span class="spec-val">${v}</span></div>`;
		})
		.join("");

	const msg = encodeURIComponent(
		`Hello Jayalaxmi Enterprises,\n\nI am interested in *${eq.name}* (${eq.pills.map((p) => pillLabel[p]).join(" / ")}).\n\nCould you please share pricing, availability and more details?\n\nThank you.`,
	);
	document.getElementById("modalEnquire").href =
		`https://wa.me/917702212693?text=${msg}`;

	document.getElementById("modalOverlay").classList.add("open");
	document.body.style.overflow = "hidden";
}

function closeModal() {
	document.getElementById("modalOverlay").classList.remove("open");
	document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", (e) => {
	if (e.target === e.currentTarget) closeModal();
});
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") closeModal();
});

function buildReviews() {
	const track = document.getElementById("reviewsTrack");
	track.innerHTML = ""; // Clear existing
	// Duplicate for seamless loop
	[...reviewsData, ...reviewsData].forEach((r) => {
		const card = document.createElement("div");
		card.className = "review-card";

		// Generate initials from name
		const initials = r.name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);

		// Use initials avatar if image is null, otherwise use the image
		const avatarHtml = r.image
			? `<img src="${r.image}" alt="${r.name}" class="review-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div class="review-avatar-initials" style="display:none;">${initials}</div>`
			: `<div class="review-avatar-initials">${initials}</div>`;

		card.innerHTML = `
      <div class="review-stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        ${avatarHtml}
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-role">${r.role}</div>
        </div>
      </div>`;
		track.appendChild(card);
	});
}

function buildEquipmentDropdown() {
	const select = document.getElementById("fequip");
	if (!select) return;

	// Clear existing options except the first one
	select.innerHTML = '<option value="">— Select Equipment —</option>';

	// Add options from equipmentData
	equipmentData.forEach((eq) => {
		const option = document.createElement("option");
		option.value = eq.name;
		option.textContent = eq.name;
		select.appendChild(option);
	});

	// Add "Other / Not Listed" option at the end
	const otherOption = document.createElement("option");
	otherOption.value = "Other / Not Listed";
	otherOption.textContent = "Other / Not Listed";
	select.appendChild(otherOption);
}

// ─── HAMBURGER ───
const ham = document.getElementById("ham");
const mobileMenu = document.getElementById("mobileMenu");
if (ham && mobileMenu) {
	ham.addEventListener("click", () => mobileMenu.classList.toggle("open"));
}
function closeMobile() {
	if (mobileMenu) mobileMenu.classList.remove("open");
}

// ─── FORM ───
function submitForm(e) {
	e.preventDefault();
	const name = document.getElementById("fname").value;
	const company = document.getElementById("fcompany").value;
	const phone = document.getElementById("fphone").value;
	const email = document.getElementById("femail").value;
	const equip = document.getElementById("fequip").value;
	const type = document.getElementById("ftype").value;
	const msg = document.getElementById("fmsg").value;

	const submitBtn = document.querySelector(".form-submit");
	const originalText = submitBtn.textContent;
	submitBtn.textContent = "Sending...";
	submitBtn.disabled = true;

	const formData = {
		name: name,
		company: company || "Not provided",
		phone: phone,
		email: email || "Not provided",
		equipment: equip,
		requirement: type,
		details: msg || "None",
	};

	fetch("https://formspree.io/f/xnjwqegb", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	})
		.then((response) => {
			if (response.ok) {
				document.getElementById("form-success").style.display = "block";
				document.getElementById("contactForm").reset();

				// ─── AUTOMATIC WHATSAPP NOTIFICATION (SECURE BACKEND CALL) ───
				// We send the data to a secure backend endpoint where the Meta API Token is safely stored as an Environment Variable.
				fetch("/api/send-whatsapp", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name,
						company,
						phone,
						email,
						equip,
						type,
						msg,
					}),
				})
					.then(async (res) => {
						if (!res.ok) {
							const errText = await res.text();
							console.warn(
								`Backend notification failed (Status: ${res.status}):`,
								errText,
							);
						} else {
							console.log(
								"Backend successfully triggered WhatsApp notification",
							);
						}
					})
					.catch((err) => console.error("Error calling backend:", err));
			} else {
				alert(
					"There was an error sending your enquiry. Please try again or contact us directly on WhatsApp.",
				);
			}
		})
		.catch((error) => {
			console.error("Formspree error:", error);
			alert(
				"There was an error sending your enquiry. Please check your internet connection.",
			);
		})
		.finally(() => {
			submitBtn.textContent = originalText;
			submitBtn.disabled = false;
		});
}

// Load data when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	loadData();
	if (typeof lucide !== "undefined") {
		lucide.createIcons();
	}
});
