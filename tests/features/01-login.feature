# @skip
Feature: Login

    This feature ensures that users can log in to the application using 
    their Google account.

    Scenario: Successful login using Google Account
        Given User is on the landing page
        When User login using Google Account
        Then User should be redirected to dashboard page
        