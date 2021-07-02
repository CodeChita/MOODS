# MOODS :):


## Description

MOODS is an app that enables users to track their moods on a regular basis. The aim is to help people, especially those with relevant disorders, to feel more in control and aware of factors that influence their emotions.

 
## User Stories

- **404** - As a user I want to see a nice encouraging 404 page when I go to a page that doesn’t exist
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I can easily see what the app is about and where to login and signup
- **sign up** - As a user I want to sign up without much effort to join the app. I also want to see my privacy concerns to be taken into consideration.
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account without much effort
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one sees my account without authorisation.
- **profile details** - As a user I want to see a pretty, personalised account with my current data as soon as I log in. In there, I want to easily access the information needed.
- **edit profile**- As a user I want to be able to edit my account, delete data and add new information.
-**delete profile** As a user, I want to be able to easily delete my profile at any given time. 

## Backlog

User profile:
-add contact information of people I am close to 
-automatically alert those people in case of relevant mood changes
-greet current user with their name


## ROUTES:

- GET / 
  - renders the homepage with login/signup button

- GET /auth/signup
  - redirects to / if user logged in        
  - renders the signup form (with flash msg)
  -creates User in db

- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - username
    - email       //should email be optional?
    - password                     

- GET /auth/login
  - redirects to / if user logged in
  - renders the login form 

- POST /auth/login
  - redirects to / if user logged in
  - body:
    - username
    - password
- POST /auth/logout
  - body: (empty)

- GET /profile
  - renders personalised profile page 

- POST /profile/edit
  - redirects to / if user is anonymous
  - body: 
    - name
    -profile information


 -POST / profile/delete
 -renders delete button
 -deletes profile from db   


## Models

User model
 
```
username: String
password: String
email: String        //should email be optional?
```

Mood model          

```
               //since you're more familar with psychology, please insert Model here ;)
``` 

## Links

### Trello

https://trello.com/b/94lrfzXc/moods

### Git

https://github.com/CodeChita/MOODS

[Deploy Link]              //to be inserted

### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1lOVf4Huj-7S_9Bs1ybYB2aUbuiQMze62Tj1BgcDE2-4/edit?usp=sharing)   //your ok with this presentation template?

