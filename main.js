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

const updateStatus = (message) => {
  document.getElementById("status").innerText = `Status: ${message}`;
};

const loadTokenFromLocalStorage = () => {
  const storedToken = getDataWithExpiration("token");
  if (storedToken) {
    document.getElementById("token").value = storedToken;
  }
};

const handleSubmit = async () => {
  const inputToken = document.getElementById("token").value;
  let storedToken = getDataWithExpiration("token");

  // Logic to handle the token
  let token;
  if (inputToken && inputToken !== storedToken) {
    // User supplied a new token, use it and save it in localStorage
    // token expiration will be much longer than other vars
    expirationTime = new Date().getTime() + 365 * 24 * 60 * 60 * 1000; // 1 year in ms
    token = inputToken;
    saveDataWithExpiration("token", token);
  } else if (storedToken) {
    // Use the stored token if available and input is empty
    token = storedToken;
    // change value of input field to the stored token
    document.getElementById("token").value = token;
  } else {
    updateStatus("Please enter a token.");
    console.log("Status: Please enter a token.");
    return;
  }

  const question = document.getElementById("question").value;
  if (!question) {
    updateStatus("Please enter a question.");
    console.log("Status: Please enter a question.");
    return;
  }

  saveDataWithExpiration("token", token);

  let calendarData = getDataWithExpiration("calendarData");
  let courseData = getDataWithExpiration("courseData");

  if (!calendarData || !courseData) {
    try {
      updateStatus("Retrieving calendar and course data...");
      console.log("Status: Retrieving calendar and course data...");

      const calendarResponse = await fetch(
        endpoints.calendar + `?token=${token}`
      );
      const calendarJson = await calendarResponse.json();
      saveDataWithExpiration("calendarData", calendarJson);
      calendarData = calendarJson;

      const courseResponse = await fetch(endpoints.courses + `?token=${token}`);
      const courseJson = await courseResponse.json();
      saveDataWithExpiration("courseData", courseJson);
      courseData = courseJson;

      const conversationId =
        courseJson.conversationId || calendarJson.conversationId;
      if (conversationId) {
        localStorage.setItem("conversationId", conversationId);
      }

      updateStatus("Data retrieved successfully.");
      console.log("Status: Data retrieved successfully.");
    } catch (error) {
      updateStatus("Failed to retrieve calendar or course data.");
      console.error("Error retrieving data:", error);
      return;
    }
  } else {
    updateStatus("Using cached calendar and course data.");
    console.log("Status: Using cached calendar and course data.");
  }

  try {
    updateStatus("Retrieving answer to your question...");
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

    document.getElementById("response").innerText = answer;
    updateStatus("Answer received.");
    console.log("Status: Answer received.");
  } catch (error) {
    updateStatus("Failed to retrieve answer to your question.");
    console.error("Error retrieving answer:", error);
  }
};

window.onload = loadTokenFromLocalStorage;