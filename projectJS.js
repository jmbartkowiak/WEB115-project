
let userName = '';
let userEmail = '';
let userGoal = '';

// Meal data
const meals = ['Breakfast', 'Snack', 'Lunch', 'Snack', 'Dinner'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let mealPlan = {};

// Event listeners
userForm.addEventListener('submit', handleUserFormSubmit);
saveBtn.addEventListener('click', handleSaveButtonClick);
clearBtn.addEventListener('click', handleClearButtonClick);
editBtn.addEventListener('click', handleEditButtonClick);
printBtn.addEventListener('click', handlePrintButtonClick);
downloadBtn.addEventListener('click', handleDownloadButtonClick);

// All primary functions
function handleUserFormSubmit(e) {
  e.preventDefault();
  //dDOM entries
  const entryPage = document.getElementById('entryPage');
  const mealFormPage = document.getElementById('mealFormPage');
  const outputPage = document.getElementById('outputPage');
  const userForm = document.getElementById('userForm');
  const mealForm = document.getElementById('mealForm');
  const userData = document.getElementById('userData');
  const mealTable = document.getElementById('mealTable');
  const saveBtn = document.getElementById('saveBtn');
  const clearBtn = document.getElementById('clearBtn');
  const editBtn = document.getElementById('editBtn');
  const printBtn = document.getElementById('printBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const goal = document.getElementById('goal').value;

  // Validate email using regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //4th version, should now handle any email address except those that use non-latin characters
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  userName = name;
  userEmail = email;
  userGoal = goal;

  //meal form page
  entryPage.style.display = 'none';
  mealFormPage.style.display = 'block';
  generateMealForms();
  displayUserData();
}

function generateMealForms() {
  let formHTML = '';
  for (let day of days) {
    formHTML += `<h3>${day}</h3>`;
    for (let meal of meals) {
      formHTML += `
        <label for="${day}-${meal}">${meal}:</label>
        <input type="text" id="${day}-${meal}" name="${day}-${meal}"><br>
      `;
    }
  }
  mealForm.innerHTML = formHTML;
}

function displayUserData() {
  userData.innerHTML = `
    <p><strong>Name:</strong> ${userName}</p>
    <p><strong>Email:</strong> ${userEmail}</p>
    <p><strong>Goal for the Week:</strong> ${userGoal}</p>
  `;
}

function handleSaveButtonClick() {
  // Store meal plan data
  for (let day of days) {
    mealPlan[day] = {};
    for (let meal of meals) {
      mealPlan[day][meal] = document.getElementById(`${day}-${meal}`).value;
    }
  }

  // output page
  mealFormPage.style.display = 'none';
  outputPage.style.display = 'block';
  generateMealTable();
}

function generateMealTable() {
  let tableHTML = `
    <tr>
      <th></th>
      ${meals.map(meal => `<th>${meal}</th>`).join('')}
    </tr>
  `;
  for (let day of days) {
    tableHTML += `
      <tr>
        <th>${day}</th>
        ${meals.map(meal => `<td>${mealPlan[day][meal]}</td>`).join('')}
      </tr>
    `;
  }
  mealTable.innerHTML = `<table>${tableHTML}</table>`;
}

function handleClearButtonClick() {
  // Clear all meal plan data, but not user data (name, email, etc.)
  mealPlan = {};
  generateMealForms();
}

function handleEditButtonClick() {
  // pre-populate data
  outputPage.style.display = 'none';
  mealFormPage.style.display = 'block';
  generateMealForms();
  for (let day of days) {
    for (let meal of meals) {
      document.getElementById(`${day}-${meal}`).value = mealPlan[day][meal];
    }
  }
}

function handlePrintButtonClick() {
  window.print();
}

function handleDownloadButtonClick() {
  // Generate CSV file and trigger the DL
  
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += `Name,Email,Goal\n`;
  csvContent += `${userName},${userEmail},${userGoal}\n\n`;
  csvContent += `Day,${meals.join(',')}\n`;
  for (let day of days) {
    csvContent += `${day},${meals.map(meal => mealPlan[day][meal]).join(',')}\n`;
  }

  // Create link and automatically open it to start the file download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'meal_plan.csv');
  document.body.appendChild(link);
  link.click();
}