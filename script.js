let allContacts = []; // store all contacts

// 1️⃣ Fetch the JSON at the top
fetch("db.json")
  .then(res => res.json())
  .then(data => {
    allContacts = data;        // store contacts
    displayContacts(allContacts); // render them on page
  })
  .catch(err => console.error(err));


async function loadContacts() {
  const res = await fetch("http://localhost:3000/contacts");
  allContacts = await res.json();
  displayContacts(allContacts);
}


function displayContacts(contacts) {
  const list = document.getElementById("contact-list");
  list.innerHTML = "";

  contacts.forEach(contact => {
    const li = document.createElement("li");
    li.textContent = `${contact.name} - ${contact.phone}`;

    // Edit 
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => loadContactForEdit(contact);

    // Delete 
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteContact(contact.id);

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

// Add
document.getElementById("contact-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("contact-id").value;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone) {
    alert("Please enter both name and phone!");
    return;
  }

  if (id) {
    // Update
    await fetch(`http://localhost:3000/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone })
    });
  } else {
    // Add new contact
    await fetch("http://localhost:3000/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone })
    });
  }

  document.getElementById("contact-form").reset();
  document.getElementById("contact-id").value = "";
  loadContacts();
});


function loadContactForEdit(contact) {
  document.getElementById("contact-id").value = contact.id;
  document.getElementById("name").value = contact.name;
  document.getElementById("phone").value = contact.phone;
}

// Delete a contact
async function deleteContact(id) {
  await fetch(`http://localhost:3000/contacts/${id}`, { method: "DELETE" });
  loadContacts();
}

// Search contacts by name
document.getElementById("search").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allContacts.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.phone.includes(query)
  );
  displayContacts(filtered);
});

// Initial load
loadContacts();
