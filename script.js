const nameField = document.getElementById("name");
const mailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const agreeField = document.getElementById("agree");

const submitBtn = document.getElementById("submitBtn");

const formMessage = document.getElementById("formMessage");

class FormState {
  constructor(fieldHTML, validationFunction, errorMessage) {
    this.values = [];
    this.errorMessage = [];
    this.isValid = false;
    this.validationFunction = validationFunction;
    
    this.fieldHTML = fieldHTML;
    
    this.errorMessage = errorMessage;
    
    let errors = document.getElementsByClassName('error-message');
    //console.log(errors);
    for(let i = 0; i < errors.length; i++) {
      let errorField = errors[i];
      //console.log(errorField);
      if(errorField.getAttribute('data-error-for') === fieldHTML.name) {
        this.errorHTML = errorField;
      }
    }
  }
  
  validate() {
    this.isValid = this.validationFunction.call();
    this.paintField();
    checkValidation();
  }
  
  paintField() {
    if(this.isValid) {
      this.fieldHTML.classList.remove('error');
      this.errorHTML.innerHTML = "";
    } else {
      this.fieldHTML.classList.add('error');
      this.errorHTML.innerHTML = `Ошибка: ${this.errorMessage}`;
    }
  }
};

const allFields = new Map([
  [nameField.name, new FormState(nameField, checkValidName, "Имя должно иметь минимум 2 символа и содержать только буквы и пробелы.")],
  [mailField.name, new FormState(mailField, checkValidMail, "Адрес почты должен существовать.")],
  [passwordField.name, new FormState(passwordField, checkValidPassword, "Пароль должно иметь минимум 6 символов.")],
  [agreeField.name, new FormState(agreeField, checkValidAgree, "Обязательный пункт.")],
]);

function checkValidation() {
  let isValid = true;
  allFields.forEach((field, key) => {
    if(!field.isValid) {
      //console.log("Инвалид!");
      isValid = false;
      return false;
    }
  })
  
  if(isValid){
    makeValid();
    return true;
  } else {
    makeInvalid();
    return false;
  }
};

function makeValid() {
  submitBtn.classList.add("active");
  submitBtn.removeAttribute('disabled');

  formMessage.classList.remove("error"); formMessage.classList.add("success");
  formMessage.innerHTML = "Все поля валидны!";
}

function makeInvalid() {
  submitBtn.classList.remove("active");
 submitBtn.setAttribute('disabled', '');
 
 let invalidFields = "";
  allFields.forEach((field, key) => {
    if(!field.isValid) {
      //console.log("Инвалид!");
      invalidFields += `${key}; `;
    }
  }) 
  
 formMessage.innerHTML = `Не валидные поля: ${invalidFields}`; formMessage.classList.remove("success");
  formMessage.classList.add("error");
}

function checkValidName() {
  let newName = nameField.value;
  if(newName.length < 2) {
    return false;
  }
  var regex = /^[а-яА-ЯёЁa-zA-Z][а-яА-ЯёЁa-zA-Z\s]+$/;
  return regex.test(nameField.value)
}

function checkValidMail() {
  var regex = /\S+@\S+\.\S+/;
  return regex.test(mailField.value);
}

function checkValidPassword() {
  let newPass = passwordField.value;
  if(newPass.length < 6) {
    return false;
  }
  return true;
}

function checkValidAgree() {
  return agreeField.checked;
}

function addValidationAction(field, type) {
  field.addEventListener("input", function() {
    allFields.get(`${field.name}`).validate();
    //console.log(allFields.get(field.name));
  })
}

addValidationAction(nameField);
addValidationAction(mailField);
addValidationAction(passwordField);
addValidationAction(agreeField);


document.getElementById('registrationForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const username = formData.get('username');
  const email = formData.get('email');
  const csrfToken = formData.get('_csrf');

  if (csrfToken !== 'csrf_token_12345') {
    alert('Ошибка безопасности: неверный токен');
    return;
  }

  formMessage.innerHTML = `
                <h3>Профиль пользователя:</h3>
                <p>Имя: ${escapeHTML(nameField.value)}</p>
                <p>Email: ${escapeHTML(mailField.value)}</p>
                <p>Пароль: ${escapeHTML(passwordField.value)}</p>
            `;
  let newline = document.createElement('p');
  newline.appendChild(avatarPreview.cloneNode(true));
  formMessage.appendChild(newline);
});

function escapeHTML(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;', 
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
};




const fileField = document.getElementById("fileInput");
const avatarPreview = document.getElementById("avatar");

fileField.addEventListener('change', (e) => {
  const [file] = e.target.files;

  if(file) {
    console.log(file.name);
    let parts = file.name.split('.');
    let ext = parts[parts.length - 1];
    console.log(ext);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'bmp':
      case 'png':
        avatarPreview.style.display = 'block';
        console.log("smf");
        avatarPreview.src = URL.createObjectURL(file);
        break;
      default:
        e.target.files = null;
        avatarPreview.style.display = 'none';
    }
  }
});
