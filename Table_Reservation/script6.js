$(document).ready(function () {
  const tableButtons = document.querySelectorAll(".table");

  const bookingModal = $("#bookingDialog");
  const bookedTableInfoModal = $("#bookedTableInfoDialog");
  const tableIdDisplayBooking = document.getElementById(
    "tableIdDisplayBooking"
  );
  const tableIdDisplayInfo = document.getElementById("tableIdDisplayInfo");
  const customerNameDisplayInfo = document.getElementById(
    "customerNameDisplayInfo"
  );
  const mobileNumberDisplay = document.getElementById("mobileNumberDisplay");

  const bookTableButton = document.getElementById("bookTableButton");
  const unbookButton = document.getElementById("unbook");
  const selectMenuitems = document.getElementById("selectMenuitems");
  let bookedTableId = null;

  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.classList.remove("blink");

  setTimeout(() => {
    welcomeMessage.classList.add("blink");
  }, 3000);

  function updateButtonStyle(button) {
    button.classList.add("booked-button");
  }
  function removeButtonStyle(tableIdToDelete) {
    const removeButton = document.getElementById(tableIdToDelete);
    removeButton.classList.remove("booked-button");

    const bookedTableIds =
      JSON.parse(localStorage.getItem("bookedTableIds")) || [];
    const indexToDelete = bookedTableIds.indexOf(tableIdToDelete);

    if (indexToDelete !== -1) {
      bookedTableIds.splice(indexToDelete, 1);
      localStorage.setItem("bookedTableIds", JSON.stringify(bookedTableIds));
    }
  }

  const bookedTableIds =
    JSON.parse(localStorage.getItem("bookedTableIds")) || [];
  bookedTableIds.forEach((tableId) => {
    const bookedTable = document.getElementById(tableId);
    if (bookedTable) {
      updateButtonStyle(bookedTable);

      bookingModal.modal("hide");
    }
  });

  fetch("http://localhost:4000/customer")
    .then((response) => response.json())
    .then((data) => {
      var customerDropdown = $("#customer-dropdown");

      customerDropdown.append(
        $("<option>", {
          value: "",
          text: "Select a customer",
          disabled: true,
          selected: true,
        })
      );
      $.each(data, (index, customer) => {
        customerDropdown.append(
          $("<option>", {
            value: customer.id,
            text: customer.name,
          })
        );
      });

      customerDropdown.on("change", function () {
        var selectedCustomerId = $(this).val();
        var selectedCustomer = data.find(
          (customer) => customer.id == selectedCustomerId
        );
        $("#customerNameInput").val(selectedCustomer.name);
        $("#mobileNumberInput").val(selectedCustomer.phone);
      });
    })
    .catch((error) => {
      console.error("Error loading customer data:", error);
      toastr.error("Server Not Available...");
    });

  const checkTableBooked = async (tableId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/reservations/${tableId}`
      );
      const data = await response.json();
      return data.id === tableId;
    } catch (error) {
      console.error("Error checking table status:", error);
      toastr.error("Server Not Available...");
      return false;
    }
  };

  tableButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const clickedButton = button;
      const tableId = button.id;
      const isBooked = await checkTableBooked(tableId);

      if (isBooked) {
        try {
          const response = await fetch(
            `http://localhost:5000/reservations/${tableId}`
          );
          if (response.ok) {
            const reservationData = await response.json();
            const customerName = reservationData.customerName;
            const mobNumber = reservationData.phoneno;
            bookedTableId = reservationData.id;
            console.log(bookedTableId);

            tableIdDisplayInfo.textContent = `Table ID: ${tableId}`;
            customerNameDisplayInfo.textContent = `Customer Name: ${customerName}`;
            mobileNumberDisplay.textContent = `Mobile Number: ${mobNumber}`;
            bookedTableInfoModal.modal("show");
            selectMenuitems.addEventListener("click", () => {
              console.log(bookedTableId);
              window.location.href = `../MenuItems/MenuItems.html?bookingId=${bookedTableId}`;
              bookedTableInfoModal.modal("hide");
            });
          } else {
            console.error(
              "Error fetching reservation data:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching reservation data:", error);
        }
      } else {
        //changes
        removeButtonStyle(tableId);
        tableIdDisplayBooking.textContent = `Table ID: ${tableId}`;
        bookingModal.modal("show");

        bookTableButton.addEventListener("click", async () => {
          const customerName = customerNameInput.value.trim();
          const mobileNumber = mobileNumberInput.value;
          if (customerName) {
            const reservationData = {
              id: tableId,
              customerName: customerName,
              phoneno: mobileNumber,
            };

            try {
              const response = await fetch(
                "http://localhost:5000/reservations",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(reservationData),
                }
              );

              const data = await response.json();

              clickedButton.setAttribute(
                "data-customerNameInput",
                data.customerName
              );

              clickedButton.setAttribute(
                "data-mobileNumberInput",
                data.phoneno
              );
              console.log("Reservation data saved:", data);

              const bookedTableIds =
                JSON.parse(localStorage.getItem("bookedTableIds")) || [];

              bookedTableIds.push(reservationData.id);

              localStorage.setItem(
                "bookedTableIds",
                JSON.stringify(bookedTableIds)
              );

              alert(
                `Table ${reservationData.id} has been booked for ${customerName}`
              );
            } catch (error) {
              console.error("Error saving reservation data:", error);
            }
          }
        });
      }
    });
  });

  unbookButton.addEventListener("click", async () => {
    if (bookedTableId) {
      try {
        const response = await fetch(
          `http://localhost:5000/reservations/${bookedTableId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          const bookedTable = document.getElementById(bookedTableId);
          removeButtonStyle(bookedTableId);

          bookedTableId = null;

          customerNameDisplayInfo.textContent = "";

          unbookButton.style.display = "none";
          selectMenuitems.style.display = "none";
          bookedTableInfoModal.modal("hide");
        } else {
          console.error("Error unbooking table:", response.statusText);
        }
      } catch (error) {
        console.error("Error unbooking table:", error);
      }
    }
  });
});
