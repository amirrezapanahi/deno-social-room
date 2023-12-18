# Deno Social Room API

## Introduction

The Deno Social Room API is a simple, yet effective Deno-based application that allows users to join, leave, and view a virtual social room. Built with Deno and the Oak framework, this API uses a key-value store to manage user data based on IP addresses.

## Features

- **Join the Social Room**: Users can enter the social room with a unique name.
- **Leave the Social Room**: Users can leave the room when they wish.
- **View Social Room**: Users can view everyone currently in the room, including themselves.

## Installation

To run this project, you need to have Deno installed on your machine. Follow the instructions on the [official Deno website](https://deno.land/) to install Deno.

## Running the Application

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run the application using the Deno command:

   ```bash
   deno run --allow-net main.ts
   ```

## API Endpoints

- **GET `/`**: View all people in the social room. If the user is in the room, their name will be highlighted.
- **GET `/enter/:name`**: Enter the social room with a chosen name. The name is passed as a URL parameter.
- **GET `/leave/:name`**: Leave the social room. The name is passed as a URL parameter.

## Contributions

Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

## License

This project is open-sourced under the [MIT License](https://opensource.org/licenses/MIT).
