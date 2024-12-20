Feature: Transcription

    This feature enables users to upload audio or video files for transcription, 
    choose transcription languages, download transcription results, rate transcriptions, 
    play audio files, and search through transcription results.

    Scenario: Failed transcripts by uploading a non audio/video file via Google Drive link
        Given User is on the dashboard page
        When User uploads a Google Drive link
        And User clicks Google Drive upload button
        Then File failed to be transcribed
        And The credit should be returned

    Scenario Outline: Successful transcripts with various transcription result languages using file upload
        Given User is on the dashboard page
        When User uploads a file: "<file>" with "<title>" as the title
        And User choose "<language>" as the transcription result language
        And User clicks upload button
        Then Uploaded file should be transcribed with "<title>" as the title
        And The summary should be in "<language>"

        Examples:
            | file                          | title             | language  |
            | ./test-assets/MP3.mp3         | Test IND          | Indonesia |
            | ./test-assets/Audio-ENG.mp3   | Test ENG          | English   |
            | ./test-assets/MP3.mp3         | Test IND to ENG   | English   |
            | ./test-assets/Audio-ENG.mp3   | Test ENG to IND   | Indonesia |

    Scenario Outline: Successful transcripts with various transcription result languages using Google Drive Link
        Given User is on the dashboard page
        When User uploads a Google Drive link: "<link>" with "<title>" as the title
        And User choose "<language>" as the transcription result language
        And User clicks Google Drive upload button
        Then Uploaded file should be transcribed with "<title>" as the title
        And The summary should be in "<language>"

        Examples:
            | link                                                                                   | title                  | language  |
            | https://drive.google.com/file/d/1E4h2nJE0w_Nd-9A7ttLbHBiSjTMcI_gZ/view?usp=drive_link  | Test GDrive IND        | Indonesia |
            | https://drive.google.com/file/d/12FHeAEiQqzOmIUibDRDaZb1b9bISt1z1/view?usp=drive_link  | Test GDrive ENG        | English   |
            | https://drive.google.com/file/d/1E4h2nJE0w_Nd-9A7ttLbHBiSjTMcI_gZ/view?usp=drive_link  | Test GDrive IND to ENG | English   |
            | https://drive.google.com/file/d/12FHeAEiQqzOmIUibDRDaZb1b9bISt1z1/view?usp=drive_link  | Test GDrive ENG to IND | Indonesia |

    Scenario Outline: Successfully download the transcription result documents or audio
        Given User has one successful transcription
        When User downloads the file
        Then The "<file>" file should be downloaded

        Examples:
            | file     |
            | pdf      |
            | docx     |
            | audio    |

    Scenario: Successfully rated a transcription
        Given User has one successful transcription
        When User submits a rating
        Then The rating should be submitted

    Scenario: Successfully played the audio file
        Given User has one successful transcription
        When User clicks the play button
        Then The audio file should be played

    Scenario: Audio is paused when the user closes the transcription result
        Given User has one successful transcription
        And User clicks the play button
        When User closes the transcription result
        Then The audio should be paused

    Scenario Outline: The search feature works fine
        Given User has one successful transcription
        When User searches a keyword: "<keyword>"
        Then Is the keyword: "<keyword>" searched appears: "<result>"

        Examples:
            | keyword                   | result |
            | transkripsi               | true   |
            | Universitas Gadjah Mada   | false  |
