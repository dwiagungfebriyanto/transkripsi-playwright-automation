# @skip
Feature: Upload file

    This feature encompasses the various scenarios that a user can encounter while uploading 
    files or links for voice transcription. The scenarios include both valid and invalid use 
    cases for file uploads, handling of large files, unsupported file formats, Google Drive 
    links, and more.

    Background:
        Given User is on the dashboard page

    # @skip
    Scenario Outline: Warning appears when user uploads files that do not contain voices or large files
        When User uploads a file: "<file>" with "<title>" as the title
        Then User should see a "<warning>" warning message

        Examples:
            | file                              | title               | warning               |
            | ./test-assets/Empty.mp3           | Test Empty          | no voice              |
            | ./test-assets/Instrument.mp3      | Test Instrument     | no voice              |
            | ./test-assets/Large-File.mp3      | Test Large File     | large file            |
            | ./test-assets/Large-NoVoice.wav   | Test Large No Voice | large file no voice   |

    Scenario Outline: Warning appears when user uploads using invalid or restricted Google Drive link
        When User uploads a Google Drive link: "<link>" with "<title>" as the title
        And User clicks Google Drive upload button
        Then User should see a "<warning>" Google Drive link warning message

        Examples:
            | link                                                                                  | title                         | warning       |
            | https://transkripsi.id/                                                               | Test GDrive Invalid Link      | invalid       |
            | https://drive.google.com/file/d/1J2nhPtNbwWb_qNmu7qMntj7xT1_X-pNq/view?usp=sharing    | Test GDrive Restricted Link   | restricted    |

    # @skip
    Scenario: Failed upload without file
        When User does not upload a file
        Then The upload button should be disabled

    # @skip
    Scenario Outline: Failed upload unsupported file formats
        When User uploads a file: "<file>" with "<title>" as the title
        Then User should see an error message

        Examples:
            | file                          | title     |
            | ./test-assets/3GP.3gp         | Test 3GP  |
            | ./test-assets/AAC.aac         | Test AAC  |
            | ./test-assets/AIFF.aiff       | Test AIFF |
            | ./test-assets/AVI.avi         | Test AVI  |
            | ./test-assets/FLAC.flac       | Test FLAC |
            | ./test-assets/WMA.wma         | Test WMA  |

    # @skip
    Scenario Outline: Successful upload supported file formats
        When User uploads a file: "<file>" with "<title>" as the title
        And User clicks upload button
        Then User should be redirected to transcript history page
        And The "<title>" should be displayed in the transcript history page

        Examples:
            | file                          | title     |
            | ./test-assets/MP3.mp3         | Test MP3  | bisa
            | ./test-assets/WAV.wav         | Test WAV  | bisa
            | ./test-assets/WEBM.webm       | Test WEBM | bisa
            | ./test-assets/OGG.ogg         | Test OGG  | bisa
            # | ./test-assets/M4A.m4a         | Test M4A  |
            # | ./test-assets/MP4.mp4         | Test MP4  |
            # | ./test-assets/MOV.mov         | Test MOV  |
            # | ./test-assets/M4V.m4v         |           |

    # @skip
    Scenario Outline: Successful file upload using public Google Drive link
        When User uploads a Google Drive link: "<link>" with "<title>" as the title
        And User clicks Google Drive upload button
        Then User should be redirected to transcript history page
        And The "<title>" should be displayed in the transcript history page
    
        Examples:
            | link                                                                                  | title                    |
            | https://drive.google.com/file/d/1E4h2nJE0w_Nd-9A7ttLbHBiSjTMcI_gZ/view?usp=sharing    | Test GDrive Viewer       |
            | https://drive.google.com/file/d/1RnGLHjyfJVYh_P4E-J5zXG3GCb2dGPcV/view?usp=sharing    | Test GDrive Commenter    |
            | https://drive.google.com/file/d/1gWC0y4LgkeZ76qDUdLbB-eE9nPeGJVLD/view?usp=sharing    | Test GDrive Editor       |
