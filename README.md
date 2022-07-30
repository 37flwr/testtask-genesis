# Test task Genesis

## Possible api calls

## Get http://localhost:3000/api/rate

# Responses:

Status 200: Returns current BTC price in UAH

Status 400: Internal error

# Logic

/rate call get triggered -> call to third part api (https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=uah) gets invoked -> if third party api call was done successfully user gets response with status 200 and current BTC price -> if third party api call was failed user gets response with status 400 and error message

## Post http://localhost:3000/api/subscribe

Accepts a body with an email property

# Accepts:

Body: {"email":"youremail@mail.com"}

# Responses:

Status 200: Returns success, with message saying that you have been successfully subscribed

Status 400: Internal error

Status 409: User with such email already subscribed

# Logic

/subscribe call get triggered -> body is being parsed to get an email -> if email property is not found user get response with status 400 and a message saying that parameters are insufficient or missing -> if email is found it is being checked for not being present in users "database" -> if it is found in users database user gets a response with status 409 and a message saying that such user already exists in a "database" -> if no such user was found email gets through a validation -> if an email is valid user is being subscribed -> if email is not valid users gets a response with status 400 and a message saying that some internal error occured

## Post http://localhost:3000/api/subscribe/<youremail@mail.com>

Simplified version of 'http://localhost:3000/api/subscribe' call, which does not require body, but expects an email to come from the url

# Responses:

Status 200: Returns success, with message saying that you have been successfully subscribed

Status 400: Internal error

Status 409: User with such email already subscribed

# Logic

Logic is pretty same to the /subscribe call except the fact that email is being looked for not in the body but is being searched for in params

# Post http://localhost:3000/api/sendEmails

Sends email with current BTC price in UAH to all subscribed users

# Responses:

Status 200: Emails have been successfully sent

Status 400: Internal error

Status 409: No subscribed users was found

# Logic

App checks if there is at least one user in the database -> if there is 0 users in the database user get response with status 409 and a message that there are no users found in a database -> if there is more that 0 users app runs a call to the third party api (https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=uah) to get current BTC price -> if call is failed user gets a response with status 400 and a message saying that something went wrong internally -> if call is successful app tries to send an email -> if email was not sent user get a response with status 400 and a message saying that emails were not sent -> if emails were sent user get a response with status 200 and a message saying that emails were sent
