# Ordinox AutoSwap

This project implements an automated swap functionality for the [Ordinox project](https://origins.ordinox.xyz/).

![image](https://github.com/user-attachments/assets/9cea4733-d9f0-42c6-8602-ce095a852f8a)

## Features

- Automated swaps between two specified assets
- Configurable swap parameters
- Signature-based authentication
- Scheduled execution using cron jobs

## Prerequisites

- Node.js (v14 or later recommended)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ordinox-autoswap.git
   cd ordinox-autoswap
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root and add the following variables:
   ```
   BEARER_TOKEN=your_bearer_token
   PRIVATE_KEY=your_private_key
   ADDRESS_A=your_address_a
   ADDRESS_B=your_address_b
   ITERATIONS=number_of_iterations
   ```

## Usage

To start the auto-swap process:

```
node index.js
```

The script will run the specified number of iterations immediately and then schedule daily executions at 00:00 UTC.

## How it works

1. The script fetches signature data from the Ordinox API.
2. It generates a signature using the provided private key.
3. It sends a signed swap request to the API.
4. This process repeats for the specified number of iterations.
5. After the initial run, it schedules daily executions using a cron job.

## Warning

This script handles private keys and performs financial transactions. Use it at your own risk and make sure you understand the implications of automated trading.

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.
