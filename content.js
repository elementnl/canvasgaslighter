// Randomize the due date within the constraints
function randomizeDueDate(dueDate) {
  const currentDate = new Date();
  const originalDate = new Date(dueDate); // Original due date from Canvas
  let randomizedDate;

  // If the original date is before the current date, return it as is
  if (originalDate < currentDate) {
    return originalDate.toLocaleDateString();
  }

  // Randomize between 0-5 days earlier, but no earlier than today
  const randomDays = Math.floor(Math.random() * 6); // Random number between 0 and 5
  randomizedDate = new Date(originalDate);
  randomizedDate.setDate(originalDate.getDate() - randomDays);

  // Ensure the randomized date isn't in the past
  if (randomizedDate < currentDate) {
    randomizedDate = currentDate;
  }

  return randomizedDate.toLocaleDateString();
}

// Update the assignment due dates
function updateAssignmentDueDates() {
  const assignments = document.querySelectorAll('.assignment_due_date'); // Replace with actual class for assignment due date

  assignments.forEach(assignment => {
    const originalDueDate = assignment.innerText; // Get the original due date from the DOM
    const assignmentId = assignment.closest('li').dataset.assignmentId; // Get a unique identifier for each assignment

    // Check if the assignment has been previously randomized
    chrome.storage.local.get([assignmentId], (result) => {
      if (result[assignmentId]) {
        // If a randomized due date exists, use it
        assignment.innerText = result[assignmentId];
      } else {
        // Otherwise, randomize and store the due date
        const newDueDate = randomizeDueDate(originalDueDate);
        assignment.innerText = newDueDate;

        // Store the randomized date in local storage to prevent re-randomizing
        chrome.storage.local.set({ [assignmentId]: newDueDate });
      }
    });
  });
}

// Run the update function when the page loads
window.addEventListener('load', updateAssignmentDueDates);
