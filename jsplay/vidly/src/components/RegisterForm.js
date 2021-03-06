import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./common/Input";

export default class RegisterForm extends Component {
  state = {
    account: {
      name: "",
      username: "",
      password: "",
    },
    errors: {},
  };

  schema = {
    name: Joi.string().min(2).required(),
    username: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Username"),
    password: Joi.string().min(5).required().label("Password"),
  };

  validate = () => {
    const result = Joi.validate(this.state.account, this.schema, {
      abortEarly: false,
    });
    if (!result.error) return null;
    const errors = {};
    for (let item of result.error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    //Validate
    const errors = this.validate();
    console.log(errors);
    this.setState({ errors: errors || {} });
    if (errors) return;
    //Call the server
    console.log("Submitted");
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = {
      [name]: this.schema[name],
    };
    const { error } = Joi.validate(obj, schema);
    if (!error) return null;
    return error.details[0].message;
  };

  handleChange = (e) => {
    const { currentTarget: input } = e;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const account = { ...this.state.account };
    account[input.name] = e.currentTarget.value;
    this.setState({ account, errors });
  };

  render() {
    const { account, errors } = this.state;
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <Input
            name="name"
            value={account.name}
            label="Name"
            onChange={this.handleChange}
            error={errors.name}
          />
          <Input
            name="username"
            value={account.username}
            label="Username"
            onChange={this.handleChange}
            error={errors.username}
          />
          <Input
            name="password"
            value={account.password}
            label="Password"
            onChange={this.handleChange}
            error={errors.password}
          />
          <button disabled={this.validate()} className="btn btn-success">
            Register
          </button>
        </form>
      </div>
    );
  }
}
