const urlParams = new URLSearchParams(window.location.search);
const tableBookingId = urlParams.get("bookingId");
console.log("this is id form the order page" + tableBookingId);

function DoLogin() {
  window.location = "../Home/Loginpage.html";
  return false;
}

const payBillButton = document.getElementById("payBillButton");
const gohome = document.getElementById("gohome");

fetch(`http://localhost:4500/orders/${tableBookingId}`)
  .then((response) => response.json())
  .then((data) => {
    console.log("Fetched reservation data:", data);
    if (data.id == `${tableBookingId}`) {
      const customerNameElement = document.getElementById("customerName");
      customerNameElement.textContent = data.customerName;

      const selectedItemsList = document.getElementById("selectedItemsList");
      data.selectedItems.forEach((item) => {
        const listItem = document.createElement("h6");
        listItem.textContent = `${item.name} - Rs. ${item.price}`;
        selectedItemsList.appendChild(listItem);
      });

      const totalAmountElement = document.getElementById("totalAmount");
      totalAmountElement.textContent = data.totalAmount;
    } else {
      console.error("No data found for the provided ID.");
      toastr.error("No data found for the provided ID.");
    }
  })
  .catch((error) => {
    console.error("Error fetching orders data:", error);
  });

payBillButton.addEventListener("click", async () => {
  alert("Bill has been paid.");
  try {
    console.log("inside pay  " + tableBookingId);
    const response = await fetch(
      `http://localhost:4500/orders/${tableBookingId}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      customerNameElement.textContent = "";
      totalAmountElement.textContent = "";
      selectedItemsList.textContent = "";
      alert("order deleted");
    } else {
      console.error("Error unbooking table:", response.statusText);
    }
  } catch (error) {
    console.error("Error unbooking table:", error);
  }
  alert("Bill has been paid.");
});

gohome.addEventListener("click", async () => {
  console.log("above go home " + tableBookingId);
  try {
    console.log("inside go home " + tableBookingId);
    const response = await fetch(
      `http://localhost:5000/reservations/${tableBookingId}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      window.location.href = "../Home/Homepage.html";
    } else {
      console.error("Error unbooking table:", response.statusText);
    }
  } catch (error) {
    console.error("Error unbooking table:", error);
  }
});
