## Monday, August 12, 2024

Today I worked on:
Working with Clarissa to set up our database in Mongo Atlas
Testing the use of MongoDB and motor in our sharents_blogpost app

    Defining all our sharents microservices
    Worked with Clarissa to create ONE microservice (user_management) and determining what the files should be in the folder, including having the pyproject.toml and poetry.lock file inside of EACH microservice
    Creating labels for issues in gitlab
    created issues in gitlab
    Researching how the concept of foreign keys will work in mongoDB

## Tuesday, August 13, 2024

Today I seeded our atlas database with our models.

We worked as a team to get our first CRUD operation to work to get all gaurdians

I also worked on a post request to create a gaurdian
I created a utils.py file and added two error handling functions.

## Wednesday, August 14, 2024

Worked on a lot of the guardian endpoints that create and modify milestones, media and events

## Thursday, August 15, 2024

Continued working on guardian endpoints and debugging with Caleb on why the endpoint paths weren't working

## Friday, August 16, 2024

Finished events endpoints.
Worked with Clarissa to implement fastapi-mail to send email invites to prospective members of the website. Included itdangerous third party package to create and verify secure, signed tokens for the invitation link. Watched one-hour video together to implement and test it. We are super proud of doing this!!

## Monday, August 19, 2024

Built react scaffolding for all components
Created responsive navbar and added Auth and Child context

Worked with Clarissa to create HomePage components

## Tuesday, August 20, 2024

Finished HomePage components.
Worked on building out media and milestone and events ALL pages, plus detail pages.

## Wednesday, August 21, 2024

I created the guardian dashboard. I created a modal for creating comments on a milestone or media and am reusing the Comments component on both media and milestones page. Worked on CSS for all pages.

I created a separate reusable Category component

Worked with Clarissa to create the CreateChild form. I then created the CreateMilestone form and added necessary css.

## Thursday, August 22, 2024

Today Clarissa and I debugged why, when we were creating new items in the database, they were showing up on the browser, but NOT in the mongoDB itself in compass. It took us a while to figure out that the compass GUI only shows a certain amount of items per page, and you have to go to the next page to see ALL your data. ARG. this was a little frustrating, but i'll never make that mistake again.

Today I worked on making the invite members form tested that it sends and email and a link, and can verify the token when the member arrives at our site. I also fixed the Auth Context. I also set up certain pages and items to be only accessible to users with role of "guardian", which comes from the Auth Context.

I also started on the Member signup page, where the member lands after receiving the email and clicking on the invite link

## Friday, August 23, 2024

Today I fixed the entire user flow so that when a user comes to any page, if they are not logged in with an access code, they will be directed to the "/" page with the option to signup or login.

## Monday, August 26, 2024

Today I added filter functionality for the milestones and media pages.
I fixed some styling throughout the app.
I added a tooltip to the delete button on the comments so someone doesn't inadvertantly hit it.

Fixed navigation after updating wishlist

## Tuesday, August 27, 2024

Today I added the videos to the site using Iframe and did all the styling for that. I also figured out how to create a async pytest for one of our post endpoints which was running two database methods (two separte await calls) and run tests in the Dockerfile.

## Wednesday, August 28, 2024

Today I am working on writing the descriptions of the microservices in our readme and adding all endpoints to the tables...I also added our MIT licence md file.
I fixed the select child option in the navbar, and i worked on a lot of styling on the whole app.

I changed the schema for the child and create forms. I wrote my unit test. I changed the docker file to run tests upon docker-compose up.

Clarissa and I both worked on making the entire site responsive for mobile devices.

## Thursday, August 29, 2024

made dashboard responsive, added logo to the navbar, added the ability to delete a child, fixed the member sign up flow. Created a separate reusable menu item component for the nav bar (one for desktop and another for mobile)

## Friday, August 30, 2024

## Tuesday, Sept 2, 2024

Today I added the guardian name to the email that the member receives and added this name to the landing page that the member arrives at. I also fixed it so that after a member or guardian signs up, since Caleb will not be passing an access token upon signup, the token endpoint is immediately called afterwards so that we can get an access token so members don't sign up and then have to login as well.

## Wednesday, Sept 3, 2024

Today Clarissa and I removed all unnecessary code and did a general clean up of the code.

I also updated the frontend login, guardian signup and membersignup to accept the new endpoints that Caleb is working on for auth.

I also re-did the member email flow, fixing it back to what it was before Caleb changed it.

FINAL NOTE:

We are waiting for Caleb to finish the member signup backend endpoint, and then we are DONE!! I am making sure the README file is up to day and finalized...
