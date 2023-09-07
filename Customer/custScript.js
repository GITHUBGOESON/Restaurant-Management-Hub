window.onload = function () {
  loadData();
};
const table = document.getElementById("tbody");
let customerData = [];

function DoLogin() {
  window.location = "../Home/Loginpage.html";
  return false;
}

function loadData() {
  table.innerHTML = "";

  fetch("http://localhost:4000/customer")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      customerData = json;
      show(customerData);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      toastr.error("Server Not Available...");
    });
}

function create() {
  let name = document.getElementById("name-input").value;
  let email = document.getElementById("email-input").value;
  let phone = document.getElementById("number-input").value;

  if (!name || !email || !phone) {
    toastr.error("Please fill all required fields.");
  }
  if (!validatePhoneNumber(phone)) {
    toastr.error("Please enter valid 10-digit mobile number.");

    return;
  }
  if (!validateEmail(email)) {
    toastr.error("Please enter a valid email address.");
    return;
  }

  let url = "http://localhost:4000/customer";
  let user = {
    name: name,
    email: email,
    phone: phone,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      let newRow = createRow(json.data);
      addToTable(newRow);
    })
    .catch((error) => console.error("Create customer error:", error));

  toastr.success("Customer added successfully.");
}

function validatePhoneNumber(phone) {
  const phonePattern = /^[0-9]{10}$/;
  return phonePattern.test(phone);
}
function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

function createRow(obj) {
  let row = document.createElement("tr");
  row.setAttribute("data-id", obj.id);
  let id = document.createElement("td");
  let name = document.createElement("td");
  let email = document.createElement("td");
  let phone = document.createElement("td");
  let actions = document.createElement("td");
  let actions2 = document.createElement("td");

  id.innerHTML = obj.id;
  name.innerHTML = obj.name;
  email.innerHTML = obj.email;
  phone.innerHTML = obj.phone;

  let updateButton = document.createElement("button");
  updateButton.className = "btn btn-warning btn-sm";
  updateButton.innerText = "Edit";
  updateButton.onclick = function () {
    updateCustomer(obj.id);
  };
  actions.appendChild(updateButton);

  let deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-danger btn-sm";
  deleteButton.innerText = "Delete";
  deleteButton.onclick = function () {
    deleteCustomer(obj.id);
  };
  actions2.appendChild(deleteButton);

  row.appendChild(id);
  row.appendChild(name);
  row.appendChild(email);
  row.appendChild(phone);
  row.appendChild(actions);
  row.appendChild(actions2);

  return row;
}
function deleteCustomer(customerId) {
  const confirmed = confirm("Are you sure you want to delete this customer?");
  if (confirmed) {
    const url = `http://localhost:4000/customer/${customerId}`;

    fetch(url, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const rowToDelete = table.querySelector(`tr[data-id="${customerId}"]`);
        if (rowToDelete) {
          rowToDelete.remove();

          toastr.success("Customer deleted successfully.");
        }
      })
      .catch((error) => console.error("Delete customer error:", error));
  }
}

function addToTable(row) {
  table.appendChild(row);
}

function show(customers) {
  for (let i = 0; i < customers.length; i++) {
    let obj = customers[i];
    let row = createRow(obj);
    addToTable(row);
  }
}
function searchByName() {
  const searchNameInput = document.getElementById("search-name-input");
  const searchName = searchNameInput.value;
  if (searchName) {
    loadCustomersByName(searchName);
  } else {
    loadData(); //
  }
}

function loadCustomersByName(name) {
  fetch(`http://localhost:4000/customer?name_like=${name}&name_nocase=true`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      table.innerHTML = "";
      if (json.length > 0) {
        customerData = json;
        show(customerData);
      } else {
        table.innerHTML = "<p>No customer found with the given name.</p>";
      }
    })
    .catch((error) => console.error("Fetch customers by name error:", error));
}

function updateCustomer(customerId) {
  const customerToUpdate = customerData.find(
    (customer) => customer.id === customerId
  );
  if (customerToUpdate) {
    document.getElementById("name-input").value = customerToUpdate.name;
    document.getElementById("email-input").value = customerToUpdate.email;
    document.getElementById("number-input").value = customerToUpdate.phone;

    const updateButton = document.querySelector('button[onclick="create();"]');
    updateButton.innerText = "Update";
    updateButton.onclick = function () {
      saveUpdatedCustomer(customerId);
    };
  }
}

function saveUpdatedCustomer(customerId) {
  let name = document.getElementById("name-input").value;
  let email = document.getElementById("email-input").value;
  let phone = document.getElementById("number-input").value;

  if (!name || !email || !phone) {
    alert("Please fill all required fields.");
    return;
  }
  if (!validatePhoneNumber(phone)) {
    toastr.error("Please enter a valid 10-digit mobile number.");
    return;
  }
  if (!validateEmail(email)) {
    toastr.error("Please enter a valid email address.");
    return;
  }

  let url = `http://localhost:4000/customer/${customerId}`;
  let updatedCustomer = {
    name: name,
    email: email,
    phone: phone,
  };

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedCustomer),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      const rowToUpdate = table.querySelector(`tr[data-id="${customerId}"]`);
      if (rowToUpdate) {
        const updatedRow = createRow(json.data);
        rowToUpdate.replaceWith(updatedRow);
      }

      document.getElementById("name-input").value = "";
      document.getElementById("email-input").value = "";
      document.getElementById("number-input").value = "";
      const addButton = document.querySelector(
        'button[onclick="saveUpdatedCustomer();"]'
      );
      addButton.innerText = "Add Customer";
      addButton.onclick = function () {
        create();
      };
    })
    .catch((error) => console.error("Update customer error:", error));

  toastr.success("Customer data updated successfully.");
}
