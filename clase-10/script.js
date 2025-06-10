var form = document.getElementById("subscription-form");
var title = document.getElementById("form-title");
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

for (let key in fields) {
  var field = fields[key];
  field.addEventListener("focus", () => {
    fieldErrors[key].textContent = "";
    fieldErrors[key].classList.remove("error-active");
    field.classList.remove("field-error");
    field.classList.add("field-not-error");
  });

  field.addEventListener("blur", () => {
    validateFields(false);
  });
}

fields.nameField.addEventListener("input", updateTitle)

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Formulario enviado");
  validateFields(true);

  if (alertMessages.length === 0) {
    var fieldsInfo = "Datos ingresados:\n\n";
    for (let key in fields) {
      fieldsInfo += `${fieldLabels[key]}: ${fields[key].value}\n`;
    }

    alert(fieldsInfo);
    form.reset();
    title.textContent = "HOLA";
  }
});
