document.addEventListener("DOMContentLoaded", (event) => {
  const settingsPrompt = document.getElementById("settings-prompt");

  // Check if settings are set and hide the prompt if needed
  //   if (hasSettings()) {
  //     settingsPrompt.style.display = "none";
  //   }

  // Attach event listener for the settings button within the message
  document
    .getElementById("open-settings-button")
    .addEventListener("click", () => {
      // Retrieve settings data and populate modal fields
      document.getElementById("infrastructureHost").value =
        getDataWithExpiration("infrastructureHost") || "sfsu.instructure.com";
      document.getElementById("token").value =
        getDataWithExpiration("token") || "";

      // Show the modal
      const settingsModal = new bootstrap.Modal(
        document.getElementById("settingsModal"),
        {
          backdrop: "static",
          keyboard: false,
        }
      );
      settingsModal.show();
    });
});

// Event listener for the save button in the modal
document
  .getElementById("save-settings-button")
  .addEventListener("click", () => {
    const infrastructureHostValue =
      document.getElementById("infrastructureHost").value;
    const tokenValue = document.getElementById("token").value;

    saveDataWithExpiration("infrastructureHost", infrastructureHostValue);
    saveDataWithExpiration("token", tokenValue);

    // Close the modal after saving
    const settingsModal = bootstrap.Modal.getInstance(
      document.getElementById("settingsModal")
    );
    settingsModal.hide();
  });

// Define hasSettings function (replace with your actual logic)
function hasSettings() {
  // Return true if both settings are present and valid, otherwise return false
  return (
    getDataWithExpiration("infrastructureHost") !== null &&
    getDataWithExpiration("token") !== null
  );
}
