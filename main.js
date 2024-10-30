const endpoints = {
  calendar: "https://canvas-api.bilk0h.workers.dev/calendar",
  courses: "https://canvas-api.bilk0h.workers.dev/courses",
  answers: "https://answers-api.bilk0h.workers.dev/answers",
};

const saveDataWithExpiration = (key, value, expirationTime) => {
  const now = new Date();
  if (!expirationTime) {
    expirationTime = now.getTime() + 24 * 60 * 60 * 1000; // 1 day in ms
  }
  const item = { value, expiration: expirationTime };
  localStorage.setItem(key, JSON.stringify(item));
};

const getDataWithExpiration = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiration) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

const showErrorAlert = (message) => {
  const alertContainer = document.getElementById("alert-container");
  const alertElement = document.createElement("div");

  // Define Bootstrap alert class based on type
  let alertClass = "alert alert-danger"; // Default

  alertElement.className = `${alertClass} alert-dismissible fade show`;
  alertElement.setAttribute("role", "alert");
  alertElement.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  alertContainer.appendChild(alertElement);
};

const updateStatus = (status, message) => {
  if (status === "error") return showErrorAlert(message);

  const toastContainer = document.getElementById("toast-container");
  const toastId = `toast-${Date.now()}`;

  const toastElement = document.createElement("div");
  toastElement.id = toastId;
  toastElement.className = "toast";
  toastElement.setAttribute("role", "alert");
  toastElement.setAttribute("aria-live", "assertive");
  toastElement.setAttribute("aria-atomic", "true");
  toastElement.innerHTML = `
    <div class="toast-header">
      <strong class="me-auto">${
        status === "success" ? "Success" : status === "error" ? "Error" : "Info"
      }</strong>
      <small>Just Now</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${message}
    </div>
  `;

  toastContainer.appendChild(toastElement);
  const toastInstance = new bootstrap.Toast(toastElement);
  toastInstance.show();

  // remove the toast after it’s hidden
  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove();
  });
};

const handleSubmit = async () => {
  let storedToken = getDataWithExpiration("token");

  if (!storedToken) {
    updateStatus("info", "Please enter a token.");
    console.log("Status: Please enter a token.");
    displayMessage("Canvas", "Please enter a token.");

    // show settings modal and highlight token field
    document.getElementById("open-settings-button").click();
    const tokenInput = document.getElementById("token");
    tokenInput.focus();
    tokenInput.classList.add('border-danger');

    setTimeout(() => {
        tokenInput.classList.remove('border-danger');
    }, 3000);
    
    return;
  }

  //   const question = document.getElementById("question").value;
  const userInput = document.getElementById("user-input");
  const question = userInput.value;
  if (!question) {
    updateStatus("info", "Please ask a question.");
    console.log("Status: Please ask a question.");
    return;
  }

  displayMessage("You", question);
  userInput.value = "";
  userInput.focus();

  let calendarData = getDataWithExpiration("calendarData");
  let courseData = getDataWithExpiration("courseData");

  if (!calendarData || !courseData) {
    try {
      console.log("Status: Retrieving calendar and course data...");

      const calendarResponse = await fetch(
        endpoints.calendar + `?token=${storedToken}`
      );
      const calendarJson = await calendarResponse.json();
      saveDataWithExpiration("calendarData", calendarJson);
      calendarData = calendarJson;

      const courseResponse = await fetch(
        endpoints.courses + `?token=${storedToken}`
      );
      const courseJson = await courseResponse.json();
      saveDataWithExpiration("courseData", courseJson);
      courseData = courseJson;

      const conversationId =
        courseJson.conversationId || calendarJson.conversationId;
      if (conversationId) {
        localStorage.setItem("conversationId", conversationId);
      }

      updateStatus(
        "success",
        "Calendar and course data retrieved successfully."
      );
      console.log("Status: Calendar and course data retrieved successfully.");
    } catch (error) {
      updateStatus("error", "Failed to retrieve calendar or course data.");
      console.error("Error retrieving data:", error);
      return;
    }
  } else {
    // updateStatus("info", "Using cached calendar and course data.");
    console.log("Status: Using cached calendar and course data.");
  }

  try {
    console.log("Status: Retrieving answer to your question...");

    const conversationId = localStorage.getItem("conversationId") || "";

    const response = await fetch(endpoints.answers, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        question,
        calendarData,
        courseData,
      }),
    });
    const result = await response.json();
    const answer =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No valid answer received.";

    // document.getElementById("response").innerText = answer;
    displayMessage("Canvas", answer);
    updateStatus("success", "Answer received.");
    console.log("Status: Answer received.");
  } catch (error) {
    updateStatus("error", "Failed to retrieve answer to your question.");
    console.error("Error retrieving answer:", error);
  }
};

// window.addEventListener("load", loadTokenFromLocalStorage);
