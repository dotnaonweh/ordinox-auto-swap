require("dotenv").config();
const axios = require("axios");
const { ethers } = require("ethers");
const { CronJob } = require("cron");

const config = {
  BEARER_TOKEN: process.env.BEARER_TOKEN,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  ADDRESS_A: process.env.ADDRESS_A,
  ADDRESS_B: process.env.ADDRESS_B,
  ITERATIONS: parseInt(process.env.ITERATIONS),
  API_BASE_URL: "https://api-1.origins.ordinox.xyz/relay2/api",
  ASSET_A: "BASE.KUSDT-0XA00EE07079CE179B7BDA78BACC31D8F515FF8EDF",
  ASSET_B: "BRC20.VNEM",
  AMOUNT: "0.001",
};

const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    Authorization: `Bearer ${config.BEARER_TOKEN}`,
    "Content-Type": "application/json",
  },
});

const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getSignatureData() {
  try {
    const { data } = await apiClient.post("/swap", {
      address_a: config.ADDRESS_A,
      address_b: config.ADDRESS_B,
      amount: config.AMOUNT,
      asset_a: config.ASSET_A,
      asset_b: config.ASSET_B,
      for_signature: true,
      nonce_a: 1,
    });
    logger.info("Signature data retrieved successfully");
    return data;
  } catch (error) {
    logger.error("Failed to fetch signature data", error);
    throw error;
  }
}

async function generateSignature(message) {
  try {
    const wallet = new ethers.Wallet(config.PRIVATE_KEY);
    const signature = await wallet.signMessage(message);
    const formattedSignature = signature.startsWith("0x")
      ? signature.slice(2)
      : signature;
    logger.info("Signature generated successfully");
    return formattedSignature;
  } catch (error) {
    logger.error("Failed to generate signature", error);
    throw error;
  }
}

async function makeSignedRequest(signature) {
  try {
    const { data } = await apiClient.post("/swap", {
      asset_a: config.ASSET_A,
      asset_b: config.ASSET_B,
      amount: config.AMOUNT,
      address_a: config.ADDRESS_A,
      address_b: config.ADDRESS_B,
      for_signature: false,
      nonce_a: 2,
      sig: signature,
    });
    logger.info("Signed request completed successfully");
    return data;
  } catch (error) {
    logger.error("Failed to make signed request", error);
    throw error;
  }
}

async function performSwap() {
  try {
    const message = await getSignatureData();
    const signature = await generateSignature(message);
    const response = await makeSignedRequest(signature);
    logger.info("Swap performed successfully", response);
    return response;
  } catch (error) {
    logger.error("Swap operation failed", error);
  }
}

async function runSwaps(iterations) {
  for (let i = 0; i < iterations; i++) {
    logger.info(`Starting iteration ${i + 1} of ${iterations}`);
    await performSwap();
    if (i < iterations - 1) {
      await sleep(1000);
    }
  }
}

async function main() {
  try {
    await runSwaps(config.ITERATIONS);
    logger.info("All iterations completed");
  } catch (error) {
    logger.error("An error occurred in the main execution", error);
  }
}

new CronJob("0 0 * * *", main, null, true, "UTC");

main();
