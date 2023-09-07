// Retrieve table booking ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const tableBookingId = urlParams.get("bookingId");

var apiUrl = "http://localhost:3000/MenuItems";
var menuItems = [];
//var selectedOrder = parseInt(localStorage.getItem("selectedOrder")) || 0;
var selectedOrderItem = [];
DisplayAll();

function DoLogin() {
  window.location = "../Home/Loginpage.html";
  return false;
}

function appendData(data) {
  var tbody = document.getElementById("tbody");

  data.forEach((item) => {
    var row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="checkbox" data-id="${item.id}" onchange="toggleSelection(this)"></td>
        <td>${item.id}</td>
        <td>${item.itemName}</td>
        <td><img src="Images/${item.image}" class="item-image"></td>
        <td>${item.itemDescription}</td>
        <td>Rs. ${item.itemPrice}</td>
        <td><button class="btn btn-sm btn-warning" onclick="UpdateContent('${item.id}')">Edit</button></td>
        <td><button class="btn btn-sm btn-danger" onclick="DeleteContent('${item.id}')">Delete</button></td>
      `;
    tbody.appendChild(row);
  });
}

function LoadContent(itemName, event) {
  event.preventDefault();

  // checking input is there or not
  if (!itemName.trim()) {
    toastr.warning("No input provided.");
    return;
  }

  // Fetching items from the server
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        console.error("No items found.");
        return;
      }

      const searchTerm = itemName.toLowerCase();

      // filtering data based on given name
      const filteredData = data.filter(function (item) {
        return (
          item.itemName.toLowerCase().includes(searchTerm) ||
          item.itemDescription.toLowerCase().includes(searchTerm)
        );
      });

      if (filteredData.length === 0) {
        toastr.error("No items found for the search term.");
        return;
      }

      // displaying the filter data in table
      const tbody = document.getElementById("tbody");
      tbody.innerHTML = "";

      filteredData.forEach((selectedItem) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="checkbox" data-id="${selectedItem.id}" onchange="toggleSelection(this)"></td>
          <td>${selectedItem.id}</td>
          <td>${selectedItem.itemName}</td>
          <td><img src="Images/${selectedItem.image}" class="item-image"></td>
          <td>${selectedItem.itemDescription}</td>
          <td>${selectedItem.itemPrice}</td>
          <td><button class="btn btn-sm btn-warning" onclick="UpdateContent('${selectedItem.id}')">Edit</button></td>
          <td><button class="btn btn-sm btn-danger" onclick="DeleteContent('${selectedItem.id}')">Delete</button></td>
        `;
        tbody.appendChild(row);
      });

      toastr.success("Items loaded successfully.");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function UpdateContent(itemId) {
  const selectedItem = menuItems.find((item) => item.id === itemId);

  if (selectedItem) {
    document.getElementById("id").value = selectedItem.id;
    document.getElementById("itemName").value = selectedItem.itemName;
    document.getElementById("itemDescription").value =
      selectedItem.itemDescription;
    document.getElementById("itemPrice").value = selectedItem.itemPrice;

    document.getElementById("updateButton").style.display = "inline-block";
    document.getElementById("cancelButton").style.display = "inline-block";
    document.getElementById("add").style.display = "none";

    const updateButton = document.getElementById("updateButton");
    updateButton.innerText = "Save";
    updateButton.onclick = function () {
      saveUpdatedItem(itemId);
    };
  }
}

function cancelEdit() {
  // Clearing input fields
  document.getElementById("id").value = "";
  document.getElementById("itemName").value = "";
  document.getElementById("itemDescription").value = "";
  document.getElementById("itemPrice").value = "";

  // hideing update and cancel buttons, and show the add button
  document.getElementById("updateButton").style.display = "none";
  document.getElementById("cancelButton").style.display = "none";
  document.getElementById("add").style.display = "inline-block";

  // reset the update button's text and functionality
  const updateButton = document.getElementById("updateButton");
  updateButton.innerText = "Update";
  updateButton.onclick = UpdateContent;
}

function saveUpdatedItem(selectedId) {
  const itemNameInput = document.getElementById("itemName");
  const itemDescriptionInput = document.getElementById("itemDescription");
  const itemPriceInput = document.getElementById("itemPrice");

  // update selected item properties
  const selectedItem = menuItems.find((item) => item.id === selectedId);
  if (selectedItem) {
    selectedItem.itemName = itemNameInput.value;
    selectedItem.itemDescription = itemDescriptionInput.value;
    selectedItem.itemPrice = itemPriceInput.value;

    fetch(`${apiUrl}/${selectedId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedItem),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        menuItems = menuItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        );

        refreshTable(menuItems);

        itemNameInput.value = "";
        itemDescriptionInput.value = "";
        itemPriceInput.value = "";

        // hiding the update and cancel buttons, and show the add button
        document.getElementById("updateButton").style.display = "none";
        document.getElementById("cancelButton").style.display = "none";
        document.getElementById("add").style.display = "inline-block";

        const updateButton = document.getElementById("updateButton");
        updateButton.innerText = "Update";
        updateButton.onclick = UpdateContent;

        toastr.success("Item updated successfully.");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function AddContent(event) {
  event.preventDefault();
  let itemName = document.getElementById("itemName").value;
  let itemDescription = document.getElementById("itemDescription").value;
  let itemPrice = document.getElementById("itemPrice").value;
  let itemImageInput = document.getElementById("itemImage");

  if (
    itemName &&
    itemDescription &&
    itemPrice &&
    itemImageInput.files.length > 0
  ) {
    let itemImageFile = itemImageInput.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
      let itemImageFileName = itemImageFile.name;

      // this is for finding greatest id and incrementing by 1
      let highestId = Math.max(
        ...menuItems.map((item) => parseInt(item.id)),
        0
      );
      let newId = highestId !== -Infinity ? highestId + 1 : 1;

      let newItem = {
        id: newId.toString(),
        itemName: itemName,
        itemDescription: itemDescription,
        itemPrice: itemPrice,
        image: itemImageFileName,
        selected: false,
      };

      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      })
        .then((response) => response.json())
        .then((data) => {
          menuItems.push(data);
          appendData([data]);
          toastr.success("Item added successfully.");
        })
        .catch((error) => console.error("Error:", error));

      document.getElementById("itemName").value = "";
      document.getElementById("itemDescription").value = "";
      document.getElementById("itemPrice").value = "";
    };
    reader.readAsDataURL(itemImageFile);
  } else {
    toastr.warning("Please fill in all fields and select an image.");
  }
}

function DeleteContent(itemId) {
  const confirmation = confirm("Are you sure you want to delete this item?");
  if (confirmation) {
    fetch(`${apiUrl}/${itemId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        menuItems = menuItems.filter((item) => item.id !== itemId);
        toastr.success("Item deleted successfully.");
        refreshTable(menuItems);
      })
      .catch((error) => {
        console.error("Error:", error);
        toastr.error("An error occurred while deleting the item.");
      });
  }
}

function DisplayAll() {
  //event.preventDefault();
  fetch("http://localhost:3000/MenuItems")
    .then(function (response) {
      console.log("Response Status:", response.status);
      return response.json();
    })
    .then(function (data) {
      console.log("Fetched Data:", data);
      menuItems = data;
      appendData(data);
    })
    .catch(function (err) {
      console.error("Error:", err);

      toastr.error("Server Not Available...");
    });
}

console.log("Fetching reservation data for ID:", tableBookingId);
selectedCustomerName = null;

fetch(`http://localhost:5000/reservations/${tableBookingId}`)
  .then((response) => response.json())
  .then((data) => {
    console.log("Fetched reservation data:", data);
    if (data.id == `${tableBookingId}`) {
      selectedCustomerName = data.customerName;
      console.log("Selected customer name:", selectedCustomerName);
    } else {
      console.error("No reservation found for the provided ID.");
      // toastr.error("No reservation found for the provided ID.");
    }
  })
  .catch((error) => {
    console.error("Error fetching reservation data:", error);
    // toastr.error("An error occurred while fetching reservation data.");
  });

function calculateTotalAmount(selectedItemsData) {
  let totalAmount = 0;
  selectedItemsData.forEach((item) => {
    totalAmount += item.price;
  });
  return totalAmount.toFixed(2);
}

const placeOrderButton = document.getElementById("placeorder");
placeOrderButton.addEventListener("click", () => {
  const selectedCheckboxIds = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map((checkbox) => checkbox.getAttribute("data-id"));

  const selectedItems = menuItems.filter((item) =>
    selectedCheckboxIds.includes(item.id)
  );
  const selectedItemsData = selectedItems.map((item) => ({
    id: item.id,
    name: item.itemName,
    price: parseFloat(item.itemPrice),
  }));

  // Generate order data
  const orderData = {
    id: tableBookingId,
    customerName: selectedCustomerName,
    selectedItems: selectedItemsData,

    totalAmount: calculateTotalAmount(selectedItemsData),
  };

  // Save order data using fetch POST method
  fetch("http://localhost:4500/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((data) => {
      toastr.success("Order placed successfully.");
      // Optionally, you can redirect the user to another page or perform other actions
      window.location.href = `../Orders/Orders.html?bookingId=${tableBookingId}`;
    })
    .catch((error) => {
      console.error("Error placing order:", error);
      toastr.error("An error occurred while placing the order.");
    });
});

// function SelectedOrderFunc() {
//   let selectedCheckboxIds = Array.from(
//     document.querySelectorAll('input[type="checkbox"]:checked')
//   ).map((checkbox) => checkbox.getAttribute("data-id"));

//   selectedOrderItem = selectedOrderItem.concat(selectedCheckboxIds);
//   console.log(selectedOrderItem);
//   localStorage.setItem("selectedOrderItem", JSON.stringify(selectedOrderItem));
//   toastr.success("Items Selected");

//   window.location.href = "../Orders/Orders.html";
// }

// this id for toggeling checkbox
function toggleSelection(checkbox) {
  let id = checkbox.getAttribute("data-id");
  let selectedItem = menuItems.find((item) => item.id === id);
  selectedItem.selected = checkbox.checked;
}

// if input of InputID box is not number it will make border red.
function validateInput(input) {
  if (!input.validity.valid) {
    input.style.borderColor = "red";
  } else {
    input.style.borderColor = "";
  }
}
