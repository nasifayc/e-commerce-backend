import { Command } from "commander";
import inquirer from "inquirer";
import { createSuperAdmin } from "./index.js";

const program = new Command();

program
  .command("createsuperuser")
  .alias("su")
  .description("Create a new superuser")
  .action(async () => {
    const question = [
      {
        type: "input",
        name: "first_name",
        message: "Enter first name:",
        validate: (input) => (input ? true : "First name is required"),
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter last name:",
        validate: (input) => (input ? true : "Last name is required"),
      },
      {
        type: "input",
        name: "email",
        message: "Enter email address:",
        validate: (input) =>
          /\S+@\S+\.\S+/.test(input) ? true : "Valid email is required",
      },
      {
        type: "password",
        name: "password",
        message: "Enter password:",
        mask: "*",
        validate: (input) =>
          input.length >= 6 ? true : "Password must be at least 6 characters",
      },
    ];

    const admin = await inquirer.prompt(question);
    await createSuperAdmin(admin);
  });

program.parse(process.argv);
