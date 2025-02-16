Feature: Top up and transaction history

    This feature ensures that users can effectively manage their credit top-ups, 
    redeem vouchers, and view their transaction history. It provides users with 
    the ability to initiate a top-up, select packages, use vouchers, cancel transactions, 
    and view transaction invoices.

    Background:
        Given User is on the dashboard page

    Scenario: Failed top up without selecting package
        Given User opens top up modal
        When User does not select a plan
        And User clicks top up button
        Then User should see an error message that they cannot top up

    Scenario Outline: Successfuly top up credit with various packages
        Given User opens top up modal
        When User selects package of "<package>" transcripts
        And User clicks top up button
        Then User should see Midtrans payment page with the same price: "<price>"

        Examples:
            | package | price    |
            # | 30      | Rp90.000 |
            # | 5       | Rp25.000 |
            | 4       | Rp25.000 |
            | 1       | Rp10.000 |

    Scenario Outline: Successfuly top up credit with various packages using voucher
        Given User opens top up modal
        When User selects package of "<package>" transcripts
        And User use a valid voucher code
        And User clicks top up button
        Then User should see Midtrans payment page with the same price: "<price>"

        Examples:
            | package | price    |
            # | 30      | Rp67.500 |
            # | 5       | Rp18.750 |
            | 4       | Rp22.500 |
            | 1       | Rp9.000  |

    Scenario Outline: Failed redeem voucher with invalid code
        Given User opens top up modal
        When User redeem with invalid voucher: "<code>"
        Then User should see an error message that the code is invalid

        Examples:
            | code         |
            | 1234         |
            | WICARAMMA948 | 
            # valid code: WICARAMMa948

    Scenario: Successfully cancel a pending transaction from the top up modal
        Given User opens top up modal
        When User top up with the selected package
        And User clicks top up button
        And User does not complete the transaction
        And User cancels the transaction from the top up modal
        Then The transaction should be canceled

    Scenario: Successfully cancel a pending transaction on the transaction history page
        Given User opens top up modal
        When User top up with the selected package
        And User clicks top up button
        And User does not complete the transaction
        And User cancels the transaction
        Then User should see a message about the transaction being canceled

    Scenario: Successfully view the latest transaction invoice
        Given User opens transaction history page
        When User clicks the latest transaction
        Then User should see the invoice of the latest transaction
