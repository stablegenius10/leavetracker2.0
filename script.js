document.addEventListener("DOMContentLoaded", function() {
    // Event listener for calculating leave duration
    var startDateInput = document.getElementById("startDate");
    var endDateInput = document.getElementById("endDate");
    var leaveDurationInput = document.getElementById("leaveDuration");
  
    startDateInput.addEventListener("change", function() {
        endDateInput.min = startDateInput.value;
        calculateDuration();
    });
    endDateInput.addEventListener("change", calculateDuration);
  
    function calculateDuration() {
        var startDate = new Date(startDateInput.value);
        var endDate = new Date(endDateInput.value);
        var timeDifference = endDate.getTime() - startDate.getTime();
        var daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        leaveDurationInput.value = daysDifference + " days";
    }

    // Fetch leave history data from the database
    async function fetchLeaveHistory() {
        try {
            const response = await fetch("http://localhost:5555/leave-history");
            const leaveHistory = await response.json();
            displayLeaveHistory(leaveHistory.reverse()); // Reverse the order of entries
        } catch (error) {
            console.error("Error fetching leave history:", error);
        }
    }

    // Display leave history in the table
    function displayLeaveHistory(leaveHistory) {
        const leaveHistoryTableBody = document.querySelector("#leaveHistory tbody");
        leaveHistoryTableBody.innerHTML = ""; // Clear existing rows

        leaveHistory.forEach(entry => {
            const row = document.createElement("tr");
            // Format dates and remove time
            const startDate = new Date(entry.startDate).toLocaleDateString("en-GB");
            const endDate = new Date(entry.endDate).toLocaleDateString("en-GB");
            row.innerHTML = `
                <td>${entry.employeeName}</td>
                <td>${entry.leaveType}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>${entry.leaveDuration}</td>
                <td>${entry.approvalStatus}</td>
                <td>${entry.comments || ""}</td>
            `;
            leaveHistoryTableBody.appendChild(row);
        });
    }

    // Leave form submission event listener
    var leaveForm = document.getElementById("leaveForm");
    leaveForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Get form data
        var formData = {};
        var formInputs = document.querySelectorAll("#leaveForm input, #leaveForm select");
        formInputs.forEach(function(input) {
            formData[input.name] = input.value;
        });

        try {
            // Send form data to server
            const response = await fetch("http://localhost:5555/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Reload page after successful submission
                location.reload();
                alert("Form submitted successfully");
            } else {
                // Handle error response from server
                alert("Failed to submit form. Please try again.");
            }
        } catch (error) {
            // Handle network errors
            console.error("Error:", error);
            alert("An error occurred while submitting the form");
        }
    });

    // Event listener for calculating leave duration
    var startDateInput = document.getElementById("startDate");
    var endDateInput = document.getElementById("endDate");
    var leaveDurationInput = document.getElementById("leaveDuration");
  
    startDateInput.addEventListener("change", calculateDuration);
    endDateInput.addEventListener("change", calculateDuration);
  
    function calculateDuration() {
        var startDate = new Date(startDateInput.value);
        var endDate = new Date(endDateInput.value);
        var timeDifference = endDate.getTime() - startDate.getTime();
        var daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        leaveDurationInput.value = daysDifference + " days";
    }

    // Function to clear the form
    function clearForm() {
        // Select all input fields in the leave form
        var formInputs = document.querySelectorAll("#leaveFormContent input[type=text], #leaveFormContent input[type=date], #leaveFormContent select");

        // Loop through each input field and set its value to an empty string
        formInputs.forEach(function(input) {
            input.value = "";
        });

        // Reset the default approval status to "Pending"
        document.querySelector("#leaveFormContent input[name=approvalStatus]").value = "Pending";
        
        // Calculate and display the default leave duration
        calculateDuration();
    }

    // Fetch leave history when the page loads
    fetchLeaveHistory();
});

// Function to open tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Hide all tab content
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Deactivate all tab links
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the specific tab content
    document.getElementById(tabName).style.display = "block";

    // Activate the specific tab link
    evt.currentTarget.className += " active";
}
