const Yup = require("yup");

const formSchema = Yup.object({
  username: Yup.string()
    .required("Username required")
    .min(6, "username too small")
    .max(28, "username too big"),
  password: Yup.string()
    .required("password required")
    .min(6, "password too small")
    .max(28, "password too big"),
});

const validateForm = (req, res) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch((err) => {
      res.send(422).send();
      console.log(err.errors);
    })
    .then((valid) => {
      if (valid) {
        res.send(200);
        console.log("form is valid ");
      } else {
        res.send(403);
        console.log("form is invalid");
      }
    });
};

module.exports = validateForm;
