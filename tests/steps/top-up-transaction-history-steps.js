import { createBdd } from "playwright-bdd";
import { test } from '../fixtures/fixture';
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd(test);
let orderID;
let transactionStatus;

Given('User opens top up modal', async ({ navbar, topUpModal }) => {
    // Open top up modal
    await navbar.clickTopUpBtn();
    await topUpModal.topUpModalVisible();
});

Given('User opens transaction history page', async ({ navbar, transactionHistoryPage }) => {
    // Open transaction history page
    await navbar.clickMenuBtn();
    await navbar.clickTransactionHistoryBtn();
    // Check if the URL is correct
    await transactionHistoryPage.hasUrl(transactionHistoryPage.url);
});

When('User does not select a plan', async ({}) => {
    // No action needed
});

When('User selects package of {string} transcripts', async ({ topUpModal }, transcriptPackage) => {
    // Select the package
    await topUpModal.selectPackage(transcriptPackage);
});

When('User top up with the selected package', async ({ topUpModal }) => {
    // Select the package of 5 transcripts
    await topUpModal.selectPackage('4');
});

When('User should see Midtrans payment page with the same price: {string}', async ({ midtransModal }, price) => {
    // Check if the price is the same between the top up modal and Midtrans modal
    await midtransModal.midtransModalVisible();
    await midtransModal.samePrice(price);
    await midtransModal.suitablePaymentMethod(price);
});

When('User redeem with invalid voucher: {string}', async ({ topUpModal }, voucherCode) => {
    // Redeem the invalid voucher code
    await topUpModal.inputVoucherCode(voucherCode);
    await topUpModal.clickRedeemVoucherBtn();
});

When('User clicks the latest transaction', async ({ transactionHistoryPage }) => {
    // Save the latest order ID and transaction status on the transaction history page
    orderID = await transactionHistoryPage.getLatestTransactionID(true);
    transactionStatus = await transactionHistoryPage.getLatestTransactionStatus();
    // Click the latest transaction to open the invoice
    await transactionHistoryPage.clickLatestInvoiceBtn();
});

// And User clicks top up button
When('User clicks top up button', async ({ topUpModal }) => {
    // Click the Bayar Sekarang button
    await topUpModal.clickBuyNowBtn();
});

// And User use a valid voucher code
When('User use a valid voucher code', async ({ topUpModal }) => {
    const voucherCode = 'WICARAMMa948';
    // Redeem the valid voucher code
    await topUpModal.inputVoucherCode(voucherCode);
    await topUpModal.clickRedeemVoucherBtn();
    // Check if the voucher code is applied
    await topUpModal.voucherAppliedVisible();
    await topUpModal.invalidVoucherErrorIsNotVisible();
});

// And User does not complete the transaction
When('User does not complete the transaction', async ({ midtransModal }) => {
    // Save the order ID from the Midtrans modal
    orderID = await midtransModal.getOrderID();
    // Select QRIS payment method
    await midtransModal.clickQrisPayment();
    await midtransModal.waitForTimeout(3000);
    // Close the Midtrans modal
    await midtransModal.clickCloseBtn();
});

// And User cancels the transaction
When('User cancels the transaction', async ({ transactionHistoryPage }) => {
    // Check if the URL is correct
    await transactionHistoryPage.hasUrl(transactionHistoryPage.url);
    // Wait for the transaction history to load
    await transactionHistoryPage.waitForTimeout(2000);
    // Check if the latest transaction ID is the same as the order ID from Midtrans modal
    await expect (await transactionHistoryPage.getLatestTransactionID(false)).toBe(orderID);
    // Click the cancel payment button
    await transactionHistoryPage.clickCancelPaymentBtn();
});

// And User cancels the transaction from the top up modal
When('User cancels the transaction from the top up modal', async ({ navbar, topUpModal }) => {
    // Open the top up modal
    await navbar.waitForTimeout(5000);
    await navbar.clickTopUpBtn();
    await topUpModal.topUpModalVisible();
    // Select the package of 5 transcripts
    await topUpModal.selectPackage('5');
    // Click the Bayar Sekarang button
    await topUpModal.clickBuyNowBtn();
    // Cancel the transaction from the top up modal
    await topUpModal.pendingPaymentModalVisible();
    await topUpModal.clickPendingPaymentModalCancelBtn();
});

Then('User should see an error message that they cannot top up', async ({ topUpModal }) => {
    // Check if the error message is visible
    await topUpModal.packageNotChosenToastVisible();
});

Then('User should see an error message that the code is invalid', async ({ topUpModal }) => {
    // Wait for the error message to appear
    await topUpModal.waitForTimeout(2000);
    // Check if the error message is visible
    await topUpModal.invalidVoucherErrorVisible();
    await topUpModal.voucherAppliedIsNotVisible();
    await topUpModal.inputVoucherCodeVisible();
});

Then('User should see a message about the transaction being canceled', async ({ transactionHistoryPage }) => {
    // Check if the canceled payment toast is visible
    await transactionHistoryPage.canceledPaymentToastVisible();
    await transactionHistoryPage.cancelPaymentBtnIsNotVisible();
});

Then('User should see the invoice of the latest transaction', async ({ transactionHistoryPage }) => {
    // Wait for the invoice to load
    await transactionHistoryPage.waitForTimeout(3000);
    // Check if the latest transaction status and ID are the same as the latest invoice status and ID
    await expect (await transactionHistoryPage.getLatestInvoiceID()).toBe(orderID);
    await expect (await transactionHistoryPage.getLatestInvoiceStatus()).toBe(transactionStatus);
});

Then('The transaction should be canceled', async ({ transactionHistoryPage }) => {
    // Check if the canceled payment toast is visible
    await transactionHistoryPage.canceledPaymentToastVisible();
});
