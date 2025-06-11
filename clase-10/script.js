var form = document.getElementById("subscription-form");
var title = document.getElementById("form-title");
var modal = document.getElementById("subscription-modal");
var modalMessage = document.getElementById("modal-message");
var closeModal = document.getElementById("modal-close");

var alertMessages = [];

var fields = {
  nameField: document.getElementById("name"),
  emailField: document.getElementById("email"),
  passwordField: document.getElementById("password"),
  repeatPasswordField: document.getElementById("repeat-password"),
  dniField: document.getElementById("dni"),
  ageField: document.getElementById("age"),
  phoneField: document.getElementById("phone"),
  addressField: document.getElementById("address"),
  cityField: document.getElementById("city"),
  postalField: document.getElementById("postal"),
};

var fieldLabels = {
  nameField: "Nombre completo",
  emailField: "Email",
  passwordField: "Contraseña",
  repeatPasswordField: "Repetir Contraseña",
  dniField: "DNI",
  ageField: "Edad",
  phoneField: "Teléfono",
  addressField: "Dirección",
  cityField: "Ciudad",
  postalField: "Código Postal",
};

var fieldErrors = {
  nameField: document.getElementById("name-error"),
  emailField: document.getElementById("email-error"),
  passwordField: document.getElementById("password-error"),
  repeatPasswordField: document.getElementById("repeat-password-error"),
  dniField: document.getElementById("dni-error"),
  ageField: document.getElementById("age-error"),
  phoneField: document.getElementById("phone-error"),
  addressField: document.getElementById("address-error"),
  cityField: document.getElementById("city-error"),
  postalField: document.getElementById("postal-error"),
};

var fieldValidators = {
  nameField: value => value.length > 6 && value.includes(" ") ? "" : "Debe tener más de 6 letras y al menos un espacio.",
  emailField: value => /^\S+@\S+\.\S+$/.test(value) ? "" : "Email inválido.",
  passwordField: value => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value) ? "" : "Mínimo 8 caracteres, letras y números.",
  repeatPasswordField: value => value === fields.passwordField.value ? "" : "Las contraseñas no coinciden.",
  dniField: value => /^\d{7,8}$/.test(value) ? "" : "DNI inválido, 7 u 8 dígitos.",
  ageField: value => parseInt(value) >= 18 ? "" : "Debes tener 18 años o más.",
  phoneField: value => /^\d{7,}$/.test(value) ? "" : "Teléfono inválido, al menos 7 dígitos.",
  addressField: value => /[A-Za-z0-9]{2,} [A-Za-z0-9]{2,}/.test(value) ? "" : "Dirección inválida, debe tener letras, números y un espacio.",
  cityField: value => value.length >= 3 ? "" : "Ciudad inválida, mínimo 3 caracteres.",
  postalField: value => value.length >= 3 ? "" : "Código postal inválido, mínimo 3 caracteres."
};

function updateTitle() {
  var nameValue = fields.nameField.value;
  title.textContent = nameValue ? "HOLA " + nameValue : "HOLA";
}

function validateFields(isSubmit) {
  alertMessages = [];
  var emptyFields = validateEmptyFields();
  var fieldErrorsMessages = [];
  for (let key in fields) {
    if (!emptyFields.includes(key)) {
      var validationResult = fieldValidators[key](fields[key].value);

      fieldErrorsMessages.push({
        key: key,
        error: validationResult
      });
    }
  }

  displayErrors(fieldErrorsMessages, isSubmit);
}

function displayErrors(fieldErrorsMessages, isSubmit) {
  fieldErrorsMessages.forEach(element => {
    if (element.error != "") {
      fieldErrors[element.key].textContent = element.error;
      fieldErrors[element.key].classList.add("error-active");
      alertMessages.push(`${fieldLabels[element.key]}: ${element.error}`);
    }
  });

  if (isSubmit && alertMessages.length > 0) {
    alert("Errores en el formulario:\n\n" + alertMessages.join("\n"));
  }
}

function validateEmptyFields() {
  emptyFields = [];
  for (let key in fields) {
    var field = fields[key];
    var fieldValue = field.value;

    if (fieldValue == null || fieldValue == "") {
      var fieldLabel = fieldLabels[key];
      fieldErrors[key].textContent = `El campo ${fieldLabel} no puede estar vacío`;
      fieldErrors[key].classList.add("error-active");
      field.classList.add("field-error");
      emptyFields.push(key);
      alertMessages.push(`El campo ${fieldLabel} no puede estar vacío`);
    } else {
      field.classList.remove("field-error");
    }
  }

  return emptyFields;
}

function validateSingleField(field) {
  var fieldToValidate = document.getElementById(field.target.id)
  var fieldToValidateValue = fieldToValidate.value;
  var fieldToValidateLabel = field.srcElement.labels[0].innerText;
  var fieldToValidateError = document.getElementById(`${field.target.name}-error`);

  if (fieldToValidateValue == null || fieldToValidateValue == "") {
    fieldToValidateError.textContent = `El campo ${fieldToValidateLabel} no puede estar vacío`;
    fieldToValidateError.classList.add("error-active");
    fieldToValidate.classList.add("field-error");
  } else {
    var fieldToValidateKey = `${toCamelCase(field.target.name)}Field`

    var fieldToValidationResult = fieldValidators[fieldToValidateKey](fieldToValidateValue);

    if (fieldToValidationResult !== "") {
      fieldToValidateError.textContent = fieldToValidationResult;
      fieldToValidateError.classList.add("error-active");
    } else {
      fieldToValidate.classList.remove("field-error");
    }
  }
}

function toCamelCase(str) {
  return str.toLowerCase().split("-").map((word, index) => {
    if (index === 0) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

function showModal(message) {
  modalMessage.innerHTML = message;
  modal.classList.remove("hidden");
}

function hideModal() {
  modal.classList.add("hidden");
}

function getFormData() {
  var formData = {};
  var formElements = new FormData(form);

  for (var [formFieldName, formFieldValue] of formElements.entries()) {
    formData[formFieldName] = formFieldValue;
  }
  
  return formData;
}

function sendFormData(formData) {
  var url = new URL("https://jsonplaceholder.typicode.com/posts");

  for (var [key, value] of Object.entries(formData)) {
    url.searchParams.append(key, value);
  }

  fetch(url.toString(), { method: "GET" })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return response.json();
    })
    .then(json => {
      showModal(
        `<h2>¡Suscripción exitosa!</h2><pre>${JSON.stringify(formData, null, 2)}</pre>`
      );

      localStorage.setItem("formData", JSON.stringify(formData));
    })
    .catch(error => {
      showModal(`<h2>Error en la suscripción</h2><p>${error.message}</p>`);
    });
}

for (let key in fields) {
  var field = fields[key];
  field.addEventListener("focus", () => {
    fieldErrors[key].textContent = "";
    fieldErrors[key].classList.remove("error-active");
    field.classList.remove("field-error");
    field.classList.add("field-not-error");
  });

  field.addEventListener("blur", (event) => {
    validateSingleField(event);
  });
}

fields.nameField.addEventListener("input", updateTitle)

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Formulario enviado");
  validateFields(true);

  if (alertMessages.length === 0) {
    var formData = getFormData();
    sendFormData(formData);

    form.reset();
    title.textContent = "HOLA";

    // ----- OLD FUNCTIONALITY -----
    // var fieldsInfo = "Datos ingresados:\n\n";
    // for (let key in fields) {
    //   fieldsInfo += `${fieldLabels[key]}: ${fields[key].value}\n`;
    // }

    // alert(fieldsInfo);
    // form.reset();
    // title.textContent = "HOLA";
  }
});

closeModal.addEventListener("click", hideModal);

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

window.onload = () => {
  var dataSaved = localStorage.getItem("formData");
  if (dataSaved) {
    var data = JSON.parse(dataSaved);
    Object.keys(data).forEach(key => {
      var asddd = document.getElementById(`${key}`);
      var formField = document.querySelector(`[name="${key}"]`);
      if (formField) {
        formField.value = data[key];
      }
    });
  }
};