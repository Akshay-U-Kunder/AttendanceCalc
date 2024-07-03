// Function to save form data to local storage
function saveToLocalStorage() {
  const inputs = document.querySelectorAll(".time-input")
  inputs.forEach((input) => {
    if (input.value) {
      localStorage.setItem(input.id, input.value)
    }
  })
}

// Function to load form data from local storage
function loadFromLocalStorage() {
  const inputs = document.querySelectorAll(".time-input")
  inputs.forEach((input) => {
    if (localStorage.getItem(input.id)) {
      input.value = localStorage.getItem(input.id)
    }
  })
}

// Function to clear local storage and reset the form
function clearLocalStorage() {
  localStorage.clear()
  document.getElementById("attendanceForm").reset()
  document.getElementById("result").innerText = ""
}

// Function to parse time input
function parseTimeInput(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number)
  return new Date(1970, 0, 1, hours, minutes, seconds)
}

// Function to calculate time difference
function timeDiff(start, end) {
  const startTime = parseTimeInput(start)
  const endTime = parseTimeInput(end)
  return (endTime - startTime) / 1000 // difference in seconds
}

// Function to format time in HH:MM:SS
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

// Function to calculate total hours worked
function calculateHours() {
  const morningLogin = document.getElementById("morningLogin").value
  const brunchLogout = document.getElementById("brunchLogout").value
  const brunchLogin = document.getElementById("brunchLogin").value
  const lunchLogout = document.getElementById("lunchLogout").value
  const lunchLogin = document.getElementById("lunchLogin").value
  const teaLogout = document.getElementById("teaLogout").value
  const teaLogin = document.getElementById("teaLogin").value
  const extraLogout = document.getElementById("extraLogout").value
  const extraLogin = document.getElementById("extraLogin").value
  const eveningLogout = document.getElementById("eveningLogout").value

  let totalSeconds = 0

  if (morningLogin && brunchLogout)
    totalSeconds += timeDiff(morningLogin, brunchLogout)
  if (brunchLogin && lunchLogout)
    totalSeconds += timeDiff(brunchLogin, lunchLogout)
  if (lunchLogin && teaLogout) totalSeconds += timeDiff(lunchLogin, teaLogout)
  if (teaLogin && eveningLogout)
    totalSeconds += timeDiff(teaLogin, eveningLogout)
  if (extraLogout && extraLogin)
    totalSeconds += timeDiff(extraLogin, extraLogout)

  if (morningLogin && eveningLogout) {
    totalSeconds = timeDiff(morningLogin, eveningLogout)
    if (brunchLogout && brunchLogin)
      totalSeconds -= timeDiff(brunchLogout, brunchLogin)
    if (lunchLogout && lunchLogin)
      totalSeconds -= timeDiff(lunchLogout, lunchLogin)
    if (teaLogout && teaLogin) totalSeconds -= timeDiff(teaLogout, teaLogin)
    if (extraLogout && extraLogin)
      totalSeconds -= timeDiff(extraLogout, extraLogin)
  }

  const totalTime = formatTime(totalSeconds)
  document.getElementById(
    "result"
  ).innerText = `Total Hours Worked: ${totalTime}`

  // Save updated values to local storage
  saveToLocalStorage()
}

// Event listener to format time inputs on paste
document.querySelectorAll(".time-input").forEach((input) => {
  input.addEventListener("paste", (event) => {
    const clipboardData = event.clipboardData.getData("Text")
    if (/^\d{2}:\d{2}:\d{2}$/.test(clipboardData)) {
      event.preventDefault()
      input.value = clipboardData
    }
  })
})

// Load form data from local storage when the page is loaded
window.onload = loadFromLocalStorage
