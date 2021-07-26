# AWSProjects
This Repository has sample projects related to AWS

Go inside /website folder and run **yarn install** to install all the dependencies to your local . once the dependencies are installed run **yarn start ** to start your application in https:localhost:3000

The authentication and authorization is built with **cognito user service** . Once the application is up and running  **click giddy up** . This will lead you to sign in the application 

**AWS Lambda function** is used for the **OTP mail** and **acceptance of domain for email** ( AWS LAMBDA FUNCTION IS IMPLEMENTED TO SUPPORT ONLY GMAIL AND MAILINATOR ACCOUNT )

Once sign in , you can **click any location in the map and request for a ride** , a ride will be requested , and after few seconds you will be provided with the link to view the status of the ride ( **This status has been implemented with simple aws lamda function using API Gateway** . No complicated features has been added in API gateway as I am restricted with access . Hence I used a Simple API gateway Implementation )

When you click on **localhost:3000/profile** , you will be provided with the **list of users** in the cognito pool . You can have the feature the search,filter,sort,download and print those userlist . You can see the email and phone number of the logged in user

As I dont have permission for the aws s3 bucket and dynamo DB , I haven't implemented those storage and retrieval which is not required as a part of the requirement.
