const urlParams = new URLSearchParams(window.location.search);
const tableBookingId = urlParams.get("bookingId");
var apiUrl = "http://localhost:3000/MenuItems";
//this is for fetching selected order items from localStorage
// var selectedOrderItem = localStorage.getItem("selectedOrderItem")
//   ? JSON.parse(localStorage.getItem("selectedOrderItem"))
//   : [];

const paybutton = document.getElementById("proceedToPay");
var menuItems = [];
const selectedOrderItemIds = [];

fetch(`http://localhost:4500/orders/${tableBookingId}`)
  .then((response) => response.json())
  .then((data) => {
    console.log("Fetched reservation data:", data);
    if (data.id == `${tableBookingId}`) {
      data.selectedItems.forEach((selectedItem) => {
        selectedOrderItemIds.push(selectedItem.id);
      });
      console.log(selectedOrderItemIds);
    } else {
      console.error("No data found for the provided ID.");
      toastr.error("No data found for the provided ID.");
    }
  })
  .catch((error) => {
    console.error("Error fetching orders data:", error);
  });

DisplayAll();

function DoLogin() {
  window.location = "../Home/Loginpage.html";
  return false;
}

function DisplayAll() {
  fetch("http://localhost:3000/MenuItems")
    .then(function (response) {
      console.log("Response Status:", response.status);
      return response.json();
    })
    .then(function (data) {
      console.log("Fetched Data:", data);
      menuItems = data;
      localStorage.setItem("menuItems", JSON.stringify(menuItems));
      console.log("menuItems stored in local storage:", menuItems);
      appendData(data);
    })
    .catch(function (err) {
      console.error("Error:", err);
      document.getElementById("thead").innerHTML = "Server Not Available...";
      document.getElementById("thead").style.color = "Red";
    });
}

function appendData(data) {
  var tbody = document.getElementById("tbody");
  var cardContainer = document.getElementById("cardContainer");

  data.forEach((item) => {
    const itemIdString = item.id.toString();
    console.log("in for each" + selectedOrderItemIds.includes(itemIdString));
    console.log("in for each" + itemIdString);
    console.log("in for each" + selectedOrderItemIds);

    if (selectedOrderItemIds.includes(itemIdString)) {
      console.log("function executed");
      var card = document.createElement("div");
      card.setAttribute("class", "col-md-4 mb-4");

      let imagePath = `../MenuItems/Images/${item.image}`;

      card.innerHTML = `
        <div class="card" style="border: 2px solid #ccc;">
          <div class="card-header" style="background-image: url(${imagePath});">
            <h3>${item.itemName}</h3>
          </div>
          <div class="card-body">
            <p class="card-number"><b>${item.itemDescription}</b></p>
            <p class="card-valid"><b>Rs. ${item.itemPrice}</b></p>
          </div>
        </div>
      `;

      cardContainer.appendChild(card);
    }
  });
}
paybutton.addEventListener("click", () => {
  console.log(tableBookingId);
  window.location.href = `../Bills/bill.html?bookingId=${tableBookingId}`;
});
