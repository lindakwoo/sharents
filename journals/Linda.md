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
